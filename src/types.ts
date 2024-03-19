export interface Config {
  selectorName: string;
  hostname: string;
  port: number;
  delayCheckTimeout: number;
  delayCheckURL: string;
  excludeNodeNames?: string[];
  proxyType?: string[];
  apiToken?: string;
}
