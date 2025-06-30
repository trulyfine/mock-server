#### 使用方法(参考模块中的README)
`js
 npm start
`
#### 模块介绍
1. mock-server-test 
- 用于代理测试版客户端，收集客户端接口数据，提供给开发版mock;
- 在测试端启用mock-server-test可以将测试环境的所有接口数据收集到apiData.js
- 将apiData复制到开发版本的apiData.js中即可在开发环境完全模拟测试环境的数据，可以在环境不好的时候非常方便的排查和复现问题
2. mock-server-dev  
- 用于代理本地开发服务器，mock接口数据
- 用于快速切换环境，日常开发从一个环境切换到另一个环境需要重启dev-server，这个过程十分缓慢（十几分钟）。而使用了mock-server-dev，只需要修改mock-server-dev的目标IP，重启即可（秒启）
