[![npm version](https://badge.fury.io/js/clash-fastest-proxy-selector.svg)](https://badge.fury.io/js/clash-fastest-proxy-selector)

# Clash Fastest Proxy Selector
A tool to automatically select the fastest proxy node for [Clash](https://github.com/Dreamacro/clash)/[ClashX](https://github.com/yichengchen/clashX)/[Clash Pro](https://install.appcenter.ms/users/clashx/apps/clashx-pro/distribution_groups/public)

### Installation
`yarn global add clash-fastest-proxy-selector` 

or 

`npm install clash-fastest-proxy-selector -g`



### Usage
- `clash-fastest-proxy --help`
- `clash-fastest-proxy`
- `clash-fastest-proxy -s 🔰国外流量 -h 127.0.0.1 -p 9090 -t 3000 -u https://www.google.com -e 香港`
- with `crontab` e.g. 
```
0 8-23/3 * * 1-5 echo "\n"`date`"\n----------------------------" >> ~/.config/clash/clash-fastest-proxy.log && ~/.asdf/shims/node ~/.config/yarn/global/node_modules/.bin/clash-fastest-proxy >> ~/.config/clash/clash-fastest-proxy.log 2>&1
```


### Default Config

```
{
  selectorName: "🔰国外流量",
  hostname: "127.0.0.1",
  port: 9090,
  delayCheckTimeout: 3000,
  delayCheckURL: "https://www.google.com",
};
```



### Building locally

- `yarn build`
- `yarn start`

### Develop
use [ts-node](https://github.com/TypeStrong/ts-node)