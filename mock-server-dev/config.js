const { oms } = require('./mockApis');
const port = 3000 // 端口
const targetServer = 'http://10.40.10/113:8088' // 设置目标服务器地址
// 使用参数区分接口的时候，哪些参数需要忽略
const ignoreParams = [
    'login_operator',
    'create_operator',
    'login_operator_name',
    'login_company',
    'mac',
    'volserial_no'
]
const groupMode = 'params' // 分组模式 hash|params|none
const mockApis = [
    ...oms
]

module.exports = {
    port,
    targetServer,
    ignoreParams,
    groupMode,
    mockApis
}