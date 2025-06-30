### 使用方法（测试版）
1. Resource/Config/t2_config.ini hui菜单url前缀配置,如：

```ini
3371 = http://127.0.0.1:3000/app/hsfundO45/#
```
2. 修改server.js配置

```js
const port = 3000 // 端口
const targetServer = 'http://10.20.47.32:8088' // 设置目标服务器的地址
const targetStaticServer = 'http://10.20.47.32:8088/app/hsfundO45Equity' // 设置目标静态服务器的地址
```