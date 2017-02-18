FROM node:6
MAINTAINER Jiahao Dai <jiahao.dai@hypers.com>

ADD index.js /var/tmp/index.js
ADD package.json /var/tmp/package.json
ADD whitelist_template.pac /var/tmp/whitelist_template.pac

WORKDIR /var/tmp/
RUN curl -fsSk -o cn-aggregated.zone.txt http://www.ipdeny.com/ipblocks/data/aggregated/cn-aggregated.zone \
  && npm install \
  && npm install http-server -g \
  && node ./ \
  && mv whitelist.pac index.html


EXPOSE 8080
ENTRYPOINT ["/usr/local/bin/http-server", "/var/tmp/"]
