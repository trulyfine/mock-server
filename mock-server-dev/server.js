const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')
const apiData = require('./apiData')
const fs = require('fs')
const crypto = require('cryto')
const {
    port,
    targetServer,
    ignoreParams,
    groupMode,
    mockApis
} = require('./config')
const exp = require('constants')
const app = express();
const mockData = {
    ...apiData
}
fs.writeFile('log.txt', '', (err) => {
    if (err) {
        console.error('Error occured while clearing log file')
    }
})
let requestBodyData = '';
// 创建代理中间件
const apiProxy = createProxyMiddleware({
    target: targetServer,
    changeOrigin: true,
    secure: false,
    cookieDomainRewrite: '',
    onProxyReq: (proxyReq, req, res) => {
        if (requestBodyData) {
            proxyReq.write(requestBodyData);
            proxyReq.end();
        }
    }
})

app.use((req, res, next) => {
    let rawData ='';
    req.on('data', (chunk) => {
        rawData += chunk;
    })
    req.on('end', (chunk) => {
        requestBodyData = rawData;
        next();
    })
})

app.use((req, res, next) => {
    if (!mockApis.includes(req.originalUrl)) return next();
    const bodyObj = JSON.parse(requestBodyData);
    removeIgnoredFields(bodyObj, ignoreParams);
    let key = '';
    let tmp = JSON.stringify(bodyObj, (key, value) => {
        if (typeof value === 'number') {
            return String(value)
        }
    })
    key = groupMode === 'hash' ? generateHash(tmp) : tmp;
    const mockResponse = key ? mockData[req.originalUrl]?.[key] : mockData[req.originalUrl];
    if (mockResponse) {
        if (req.method === 'POST') {
            res.json(mockResponse);
        } else {
            next();
        }
    } else {
        const log = {
            error_info: 'not match',
            key,
            url: req.originalUrl,
            params: bodyObj
        }
        fs.appendFile('log.txt', JSON.stringify(log) + '\n', (err) => {
            if (err) {
                console.error('Error occured while writing to log file');
            }
        })
        next()
    };
})

// 使用代理中间件转发未匹配的接口给目标服务器
app.use(apiProxy);

// 启动服务器
app.listen(port, () => {
    console.log(`Mock server is runnning on port ${port}`);
})

function removeIgnoredFields (obj, ignoredParams) {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }
    const keys = Object.keys(obj);
    for (const key of keys) {
        if (ignoreParams.includes(key)) {
            delete obj[key];
        } else {
            obj[key] = removeIgnoredFields(obj[key], ignoreParams);
        }
    }
    const sortedObj = {};
    Object.keys(obj)
    .sort()
    .forEach((key) => {
        sortedObj[key] = obj[key];
    })
}

function generateHash(data) {
    const hash = crypto.createHash('sha256');
    hash.update(data);
    return hash.digest('hex');
}