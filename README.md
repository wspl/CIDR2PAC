# CIDR2PAC

A es6 script for covering CIDRs list to PAC proxy script.

一个用于将 CIDR 列表文件转换为 PAC 自动代理文件的脚本。


中国IP段CIDR列表地址：（项目中已自带 更新自20170218）

http://www.ipdeny.com/ipblocks/data/aggregated/cn-aggregated.zone

## 使用姿势
* 本地部署

```sh
# 安装 node 6+ 与 npm
# 根据需求修改 index.js 文件中的 CIDR_PATH / DIST_PAC_PATH / PROXY 三个常量

git clone https://github.com/wspl/CIDR2PAC.git
cd ./CIDR2PAC
npm install
node ./

# 然后就可以在 **DIST_PAC_PATH** 找到你的 PAC 文件。
```

* 编译运行镜像
```sh
# 安装 docker.io 容器引擎
# 根据需求修改 index.js 文件中的 CIDR_PATH / DIST_PAC_PATH / PROXY 三个常量

git clone https://github.com/wspl/CIDR2PAC.git
cd ./CIDR2PAC
docker build -t tools/cidr2pac .
docker run -d -p 8123:8080 tools/cidr2pac
curl -o my.pac http://127.0.0.1:8123
# 目录下的 **my.pac** 就是你的 PAC 文件
```

* 公有 CaaS
```sh
# CaaS的平台帐号 国内如：alauda.cn daocloud.io(首字母顺序)
# 复制git地址，或者fork本项目。在CaaS平台上创建本项目为源码的**构建仓库**。
# 手动执行构建
# 待完成构建后，将构建的镜像执行为一个运行容器。
# 访问容器的IP或域名，注意默认端口(8080)可能会被CaaS映射为其他端口。
```

## 镜像

该 PAC 文件将使国内 IP 网站跳过代理，非国内 IP 网站走 `127.0.0.1:1080` 的代理。


Github Raw： https://rawgit.com/wspl/CIDR2PAC/master/whitelist.pac
（可以直接贴到浏览器代理设置的 pac 地址栏中，当然首先得能访问 Github \_(:з」∠)\_）


Docker Container:  http://whitelist-cn-pac.daoapp.io/
