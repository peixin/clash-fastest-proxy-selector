export interface Config {
  selectorName: string;
  hostname: string;
  port: number;
  delayCheckTimeout: number;
  delayCheckURL: string;
  excludeNodeNames?: string[];
  proxyType:  Array<ProxyType>;
}

export type ProxyType = "Vmess" | "Trojan" | "ShadowsocksR";