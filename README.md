# Clash Fastest Proxy Selector
A tool to automatically select the fastest proxy node for [Clash](https://github.com/Dreamacro/clash)/[ClashX](https://github.com/yichengchen/clashX)/[Clash Pro](https://install.appcenter.ms/users/clashx/apps/clashx-pro/distribution_groups/public)

### Installation
`yarn global add clash-fastest-proxy-selector` 

or 

`npm install clash-fastest-proxy-selector -g`



### Usage

- `clash-fastest-proxy`
- `clash-fastest-proxy 🔰国外流量 127.0.0.1 9090 3000 https://www.google.com`



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