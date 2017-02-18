FROM node:6
MAINTAINER Jiahao Dai <jiahao.dai@hypers.com>

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update \
  && apt-get install --force-yes -y \
    git \
  \
  && apt-get clean -y \
  && rm -rf /var/lib/apt/lists/* \
  && rm -rf /tmp/* \
  && rm -rf /usr/{{lib,share}/locale,share/{man,doc,info,gnome/help,cracklib,il8n},{lib,lib64}/gconv,bin/localedef,sbin/build-locale-archive}

WORKDIR /var/tmp/
RUN git clone --depth=1 https://github.com/wspl/CIDR2PAC.git \
  && cd /var/tmp/CIDR2PAC \
  && curl -fsSk -o cn-aggregated.zone.txt http://www.ipdeny.com/ipblocks/data/aggregated/cn-aggregated.zone \
  && npm install \
  && npm install http-server -g \
  && node ./ \
  && mv whitelist.pac index.html


VOLUME 8080
ENTRYPOINT ["http-server", "./"]
