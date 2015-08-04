# CIDR2PAC

A es6 script for covering CIDRs list to PAC proxy script.

一个用于将 CIDR 列表文件转换为 PAC 自动代理文件的脚本。


中国IP段CIDR列表地址：（项目中已自带）

http://www.ipdeny.com/ipblocks/data/aggregated/cn-aggregated.zone

## 使用姿势

```bash
// 安装 io.js 与 npm
// 根据需求修改 index.js 文件中的 CIDR_PATH / PAC_PATH / PROXY 三个常量

$ git clone https://github.com/wspl/CIDR2PAC.git
$ cd ./CIDR2PAC
$ npm install
$ iojs ./

// 然后就可以在 PAC_PATH 对应目录找到你的 PAC 文件。
```


## 镜像

该 PAC 文件将使国内 IP 网站跳过代理，非国内 IP 网站走 `127.0.0.1:1080` 的代理。


Github Raw： https://raw.githubusercontent.com/wspl/CIDR2PAC/master/whitelist.pac
（可以直接贴到浏览器代理设置的 pac 地址栏中，当然首先得能访问 Github _(:з」∠)_）
