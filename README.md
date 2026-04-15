# cf-nodes-aggregator
将多个cf的节点的`uuid`和`sni`聚合到一个订阅中

每个账号`10w请求`限制，注册多个CF账号后，除非统一`UUID`，否则无法利用`edgetunnel`的单面板管理多节点

所以，我提供了一个工具，用来归集各组`UUID`和`SNI`，实现一个订阅，平均调用所有的节点

## 原理
目前大家部署的`edgetunnel`和`cfnew`等项目，只要提供`uuid`、`sni`等信息，其他参数试试，就可以生成一个原地址的订阅链接
只要将此链接中的`IP`地址修改成优选的IP或域名，就可以生成无数新地址，并且还能访问


## 部署方法
1. 通过各种软件订阅`clash`或`v2ray`后，打开配置，找到`uuid`、`sni`、`path`、`ech`、`tls或security`。多记录一组合就多`10w`每天
2. 选择优选域名或优选IP的获取源，转换后的数据要求为`{ip,port,hash}`，如果缺`hash`，则默认空，缺`port`保持空，后期会修正，
3. 节点信息可以到源码中修改`DEFAULT_NODES`，也可以到`设置`->`变量和机密`，添加`文本`，变量名`NODES`。哪种更方便由用户自己选择
```
# 参考格式。以逗号分割，额外可以使用#开头进行注释
# 四列分别为：uuid、sni、security、ech、path。path直接从配置文件中复制，ech表示是否要开启ECH，注意部分节点不支持
# 可以先到v2rayN中使用优选域名cf.090227.xyz测试是否能通，再填写以下参数
# 注意：security=none不安全，谨慎使用

# https://xxx.eu.cc/sub?token=1e0294bba5c6960fe5f5e600f0a883c9
00000000-0000-4000-8000-000000000000,xxx.eu.cc,tls,true,/proxyip=proxyip.cmliussss.net

# https://xxx.xxxx.de5.net/sub?token=1d5638ceae20667ab8ddef752cae99bf
11111111-1111-4111-8111-111111111111,xxx.xxxx.de5.net,none,false,/proxyip=proxyip.cmliussss.net?ed=2095
```
4. 将代码部署到`Cloudflare Workers/Pages`，已经可以访问`https://*.pages.dev/domain/v2ray`，查看效果
5. 注意：`Pages`部署方式需要再上传一次，对`NODES`的修改才会生效

## 优选域名使用方法(无法决定地区，节点超时概率低，推荐)
1. 访问 `https://*.pages.dev/domain`，默认随机返回20条优选域名
2. 访问 `https://*.pages.dev/domain/v2ray`，可以查看生成的`v2ray`信息
3. 访问 `https://*.pages.dev/domain/base64`，可以查看生成的`v2ray`转`base64`格式信息
4. 访问 `https://*.pages.dev/domain/sub`，可以查看`clash`新订阅地址，复制新地址到浏览器或各软件中即可
5. 访问 `https://*.pages.dev/domain/clash`，本质是返回了`clash`新订阅地址所获取的数据
6. 所有 `/domain/*`，都支持`limit`参数，例如：`https://*.pages.dev/domain?limit=10`

## 优选IP使用方法(可以选定地区，但节点超时概率高)
1. 访问 `https://*.pages.dev/ip`，默认随机返回`HK-US`地区的`IP`，每区5只
2. 访问 `https://*.pages.dev/ip/v2ray`，可以查看生成的`v2ray`信息
3. 访问 `https://*.pages.dev/ip/base64`，可以查看生成的`v2ray`转`base64`格式信息
4. 访问 `https://*.pages.dev/ip/sub`，可以查看`clash`新订阅地址，复制新地址到浏览器或各软件中即可
5. 访问 `https://*.pages.dev/ip/clash`，本质是返回了`clash`新订阅地址所获取的数据
6. `/ip/*`功能都支持`region`和`limit`参数。例如：`https://*.pages.dev/ip?region=HK-US&limit=10-10`。用`-`隔开。建议地区太多时，一定减少数量，可用于`edgetunnel`。

## 推荐订阅设置
```
软件中订阅两条。平时用优选域名，需指定地区时再用优选IP
# 优选域名
https://*.pages.dev/domain/clash?limit=20
# 优选IP
https://*.pages.dev/ip/clash?region=HK-JP-US&limit=10-6-10

```

## 订阅指定UA
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
	1. 按名称排序，观察某个`uuid`是否全为`-1`或`Timeout`，别名`remark`前是`uuid`的前4位，可用于区分
	2. 某软件代理6个一行，可以`NODES`数量不足时复制多份补全6条，这样一列就是同一`uuid`的，整列都超时就可以剔除了
3. `workers`和`pages`有什么区别？
	1. 自己没域名，选`pages`，但每次修改变量要重新上传代码
	2. `workers`修改调试方便，国内可搭配自定义域访问

## ECH
发现目前网络上提供的`v2ray`转`clash`的服务都会丢失`ech`信息，本工具会试着补全`ECH`信息，但需要配置文件的`ech`字段为`true`，
底层会将`ech`信息保存在`path`字段，经过转换后，此字段还保留，可以被再次利用起来。

`edgetunnel`和`cfnew`有对`DNS`覆写的功能，但改`yaml`实在麻烦，还是交给各客户端软件的覆写吧

### 检查浏览器ECH是否开启
https://www.cloudflare-cn.com/ssl/encrypted-sni/#results

### 浏览器ECH设置教程
https://zhuanlan.zhihu.com/p/3739662610

## 参考学习
1. [cmliu/edgetunnel](https://github.com/cmliu/edgetunnel)
2. [byJoey/cfnew](https://github.com/byJoey/cfnew)
3. [hc990275/sub](https://github.com/hc990275/sub)
4. [alienwaregf/Cloudflare-Country-Specific-IP-Filter](https://github.com/alienwaregf/Cloudflare-Country-Specific-IP-Filter)


感谢各位大佬提供的代码和服务

## 优选IP源
- https://raw.githubusercontent.com/hc990275/yx/main/cfyxip.txt
- https://zip.cm.edu.kg/all.txt

## 免责声明
1. 本项目仅供教育、科学研究及个人安全测试之目的。
2. 使用者在下载或使用本项目代码时，必须严格遵守所在地区的法律法规。
3. 作者对任何滥用本项目代码导致的行为或后果均不承担任何责任。
4. 本项目不对因使用代码引起的任何直接或间接损害负责。
5. 建议在测试完成后 24 小时内删除本项目相关部署



