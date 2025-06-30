const port = 3000 // 端口
// const targetServer = 'http://10.20.47.32:8088' // 设置目标服务器的地址
// const targetStaticServer = 'http://10.20.47.32:8088/app/hsfundO45' // 设置目标静态服务器的地址
// const targetServer = 'http://10.20.163.247:8088' // 设置目标服务器的地址
// const targetStaticServer = 'http://10.20.163.247:8088/app/hsfundO45' // 设置目标静态服务器的地址
const targetServer = 'http://10.20.47.236:8088' // 设置目标服务器的地址
const targetStaticServer = 'http://10.20.47.236:8088/app/hsfundO45' // 设置目标静态服务器的地址
const urlPrefix = ['/g', '/dev.0'] // 收集指定url前缀的接口
// 使用参数区分接口时候，哪些参数需要忽略
const ignoredParams = [
  'login_operator',
  'create_operator',
  'login_operator_name',
  'login_company',
  'mac',
  'volserial_no',
  'computer_name',
  'login_ip',
  'ws_cpu',
  'menu_id_op',
  'operator_no',
  'company_id',
  'menu_code',
  'business_date',
  'trade_operator',
  'terminal_info',
  'request_num',
  'page_size',
  '_row_key'
]
const groupMode = 'params' // 分组模式 hash|params|none

module.exports = {
  port,
  targetServer,
  targetStaticServer,
  urlPrefix,
  ignoredParams,
  groupMode,
}
