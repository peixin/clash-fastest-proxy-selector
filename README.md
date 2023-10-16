[![npm version](https://badge.fury.io/js/clash-fastest-proxy-selector.svg)](https://badge.fury.io/js/clash-fastest-proxy-selector)

# Clash Fastest Proxy Selector
A tool to automatically select the fastest proxy node for [Clash](https://github.com/Dreamacro/clash)/[ClashX](https://github.com/yichengchen/clashX)/[Clash Pro](https://install.appcenter.ms/users/clashx/apps/clashx-pro/distribution_groups/public)


[Clash RESTful API](https://clash.gitbook.io/doc/restful-api)


### Installation
- `yarn global add clash-fastest-proxy-selector` 
- `pnpm install clash-fastest-proxy-selector -g` 
- `npm install clash-fastest-proxy-selector -g`



### Usage
- `clash-fastest-proxy --help`
- `clash-fastest-proxy`
- `clash-fastest-proxy -s 手动选择 -h 127.0.0.1 -p 9090 -t 3000 -u https://www.google.com -r ShadowsocksR -e 香港  --api-token xxxxx`

- with `crontab` e.g. 
```
20 * * * * echo "---------------`date`---------------" >> ~/.config/clash/clash-fastest-proxy.log && /usr/local/bin/clash-fastest-proxy --exclude-node-names 普通 >> ~/.config/clash/clash-fastest-proxy.log 2>&1
```


### Default Config

```
{
  selectorName: '手动选择',
  hostname: '127.0.0.1',
  port: 9090,
  delayCheckTimeout: 3000,
  delayCheckURL: 'https://www.google.com',
  excludeNodeNames: undefined,
  proxyType: [ 'Trojan', 'ShadowsocksR' ],
  apiToken: undefined
};
```



### Building locally

- `yarn build`
- `yarn start`

### Develop
use [ts-node](https://github.com/TypeStrong/ts-node)
pnpm install ts-node -g