const fs = require('fs')
const crypto = require('crypto')
const outputFile = 'apiData.js'
let apiData = {} // 存储未匹配的接口及其响应数据
function handleDecodedResponse(body, req, groupMode) {
  const str = body.toString('utf-8')
  let response

  try {
    response = JSON.parse(str)
  } catch (error) {
    response = str
  }

  if (groupMode === 'none') {
    apiData[req.originalUrl] = response
  } else {
    let key = '';
    let tmp = JSON.stringify(req.body, (key, value) => {
      if (typeof value === 'number') {
        return String(value);
      }
      return value;
    })
    key = groupMode === 'hash' ? generateHash(tmp) : tmp
    if (!apiData[req.originalUrl]) {
      apiData[req.originalUrl] = {}
    }
    apiData[req.originalUrl][key] = response
  }

  // 将未匹配的接口及其响应数据输出到文件
  fs.writeFile(outputFile, 'module.exports = ' + formatObjectOutput(apiData), (err) => {
    if (err) {
      console.error('Failed to write to file:', err)
    }
  })
}
function formatObjectOutput(data) {
  const output = Object.keys(data)
    .map((key) => `  ${JSON.stringify(key)}: ${formatValue(data[key])}`)
    .join(',\n')
  return `{\n${output}\n}`
}

function formatValue(value) {
  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2)
  }
  return JSON.stringify(value)
}

function uuid() {
  return ([1e3] + -1e3 + -4e3 + -8e3).replace(/[018]/g, (c) => {
    const randomByte = crypto.randomBytes(1)[0]
    return (c ^ (randomByte & (15 >> (c / 4)))).toString(16)
  })
}

function generateHash(data) {
  const hash = crypto.createHash('sha256')
  hash.update(data)
  return hash.digest('hex')
}

// 用 Promise 包装获取请求体的异步操作
function getRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk
    })
    req.on('end', () => {
      resolve(body)
    })
    req.on('error', (err) => {
      reject(err)
    })
  })
}
function removeIgnoredFields(obj, ignoredParams) {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  const keys = Object.keys(obj)
  for (const key of keys) {
    if (ignoredParams.includes(key)) {
      delete obj[key]
    } else {
      obj[key] = removeIgnoredFields(obj[key], ignoredParams)
    }
  }

  const sortedObj = {}
  Object.keys(obj)
    .sort()
    .forEach((key) => {
      sortedObj[key] = obj[key]
    })
  return sortedObj
}
module.exports = {
  handleDecodedResponse,
  formatObjectOutput,
  formatValue,
  uuid,
  generateHash,
  getRequestBody,
  removeIgnoredFields,
}
