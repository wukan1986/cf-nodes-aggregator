# cf-nodes-aggregator
将多个cf的节点的`uuid`和`sni`聚合到一个订阅中

每个账号`10w请求`限制，注册多个CF账号后，除非统一`UUID`，否则无法利用`edgetunnel`的单面板管理多节点

所以，我提供了一个工具，用来归集各组`UUID`和`SNI`，实现一个订阅，平均调用所有的节点

## 原理
目前大家部署的`edgetunnel`和`cfnew`等项目，只要提供`uuid`和`sni`，就可以生成一个原地址的订阅链接
只要将此链接中的`IP`地址修改成优选的IP或域名，就可以生成无数新地址，并且还能访问


## 部署方法
1. 通过各种软件订阅`clash`或`v2ray`后，打开配置，找到`uuid`和`sni`。多记录一对就多`10w`每天
2. 选择优选域名或优选IP的获取源，转换后的数据要求为`{ip,port,remark}`，如果缺`port`，则默认`443`，如果缺`remark`，则默认空
3. 将代码部署到`Cloudflare Workers/Pages`，已经可以访问`https://*.pages.dev/v2ray`，查看效果
4. 到`设置`->`变量和机密`，添加`文本`，变量名`UUID_SNI`，以`csv`格式填写，额外可以使用`//`或`#`开头进行注释。例如：
```csv
// https://xxx.eu.cc/sub?token=1e0294bba5c6960fe5f5e600f0a883c9
00000000-0000-4000-8000-000000000000,xxx.eu.cc

# https://xxx.xxxx.de5.net/sub?token=1d5638ceae20667ab8ddef752cae99bf
11111111-1111-4111-8111-111111111111,xxx.xxxx.de5.net
```
5. 注意：`Pages`部署方式需要再上传一次，对`UUID_SNI`的修改才会生效

## 使用方法
1. 访问 `https://*.pages.dev/v2ray`，可以查看生成的`v2ray`信息
2. 访问 `https://*.pages.dev/base64`，可以查看生成的`v2ray`转`base64`格式信息
3. 访问 `https://*.pages.dev/sub`，可以查看`clash`新订阅地址，复制新地址到浏览器或各软件中即可
4. 访问 `https://*.pages.dev/clash`，本质是返回了`clash`新订阅地址所获取的数据

## 额外功能
1. 订阅时指定`UA`，临时解决部分软件不支持自定义`UA`的场景
2. 访问 `https://*.pages.dev/fetch?ua=clash&url=https://xxx.xxxx.de5.net/sub?token=xxxx`
3. `ua`为指定的`User-Agent`，`url`为机场订阅地址
4. 此功能也能解决部分订阅地址无法直接访问的的场景

## 其他问题
1. `workers.dev`地址无法访问怎么办？
	1. 临时可以科学上网，访问`https://*.workers.dev/sub`得到的新地址一般可以直接访问
	2. 部署成`Pages`, `*.pages.dev`一般是可以直接访问的
	3. 添加自定义域，用新域名访问也可以
2. 如何知道某个`uuid`和`sni`失效了？
	1. 使用`v2rayN`订阅 `https://*.pages.dev/v2ray`
	2. `Ctrl+R` 测试真连接延迟
	3. 按别名排序，观察某个`uuid`是否全为`-1`，别名`remark`前是`uuid`的前4位，可用于区分
3. `workers`和`pages`有什么区别？
	1. 自己没域名，选`pages`，但每次修改变量要重新上传代码
	2. `workers`修改调试方便，国内可搭配自定义域访问

## 参考学习
1. [edgetunnel](https://github.com/cmliu/edgetunnel)
2. [cfnew](https://github.com/byJoey/cfnew)

感谢各位大佬提供的代码和服务

## 免责声明
1. 本项目仅供教育、科学研究及个人安全测试之目的。
2. 使用者在下载或使用本项目代码时，必须严格遵守所在地区的法律法规。
3. 作者对任何滥用本项目代码导致的行为或后果均不承担任何责任。
4. 本项目不对因使用代码引起的任何直接或间接损害负责。
5. 建议在测试完成后 24 小时内删除本项目相关部署