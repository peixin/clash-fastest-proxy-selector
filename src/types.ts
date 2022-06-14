export interface Config {
  selectorName: string;
  hostname: string;
  port: number;
  delayCheckTimeout: number;
  delayCheckURL: string;
  excludeNodeNames?: string[];
  proxyType: "Vmess" | "Trojan";
}
