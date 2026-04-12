# cf-nodes-aggregator
将多个cf的节点的`uuid`和`sni`聚合到一个订阅中

每个账号10w请求限制，注册多个CF账号后，除非统一`UUID`，否则无法利用`edgetunnel`的单面板管理多节点功能

所以，我提供了一个工具，用来归集不同的`UUID`和`SNI`

## 原理
目前大家部署的`edgetunnel`和`cfnew`等项目，只要提供`uuid`和`sni`，就可以生成一个原地址的订阅链接
只要将此链接中的`IP`地址修改成优选的IP或域名，就可以生成无数新地址，并且还能访问


## 部署方法
1. 通过各种软件订阅`clash`或`v2ray`后，打开配置，找到`uuid`和`sni`，记录到`_worker.js`中的`UUID_SNI`中。多记录一对就多`10w`每天
2. 选择优选域名或优选IP的获取方式，转换后的数据要求为`{ip,port,remark}`，如果缺`port`，则默认`443`，如果缺`remark`，则默认空
3. 将修改后的代码部署到`Cloudflare Workers/Pages`，然后就可以测试了

## 使用方法
1. 访问 `https://*.pages.dev/v2ray`，可以查看生成的`v2ray`信息
2. 访问 `https://*.pages.dev/base64`，可以查看生成的`v2ray`转`base64`格式信息
3. 访问 `https://*.pages.dev/sub`，可以查看`clash`新订阅地址，复制新地址到浏览器或各软件中即可
4. 访问 `https://*.pages.dev/clash`，本质是返回了`clash`新订阅地址所获取的数据

## 额外功能
1. 订阅时指定`UA`，解决部分软件不支持设置`UA`，但机场又有特殊需求的场景
2. 修改`handle_ua`代码为机场地址，以及`User-Agent`
3. 访问 `https://*.pages.dev/ua`，就为机场配置文件

## 其他问题
1. `workers.dev`地址无法访问怎么办？
	1. 临时可以科学上网，访问`https://*.workers.dev/sub`得到的新地址一般可以直接访问
	2. 部署成`Pages`, `*.pages.dev`一般是可以直接访问的
	3. 添加自定义域，以后用新域名访问也可以
2. 如何知道某个`uuid`和`sni`失效了？
	1. 使用`v2rayN`订阅 `https://*.pages.dev/v2ray`
	2. `Ctrl+R` 测试真连接延迟
	3. 按别名排序，观察某个`uuid`是否全为`-1`，别名`remark`前是`uuid`的前4位，可用于区分
