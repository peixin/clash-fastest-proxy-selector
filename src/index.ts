import HTTP from "./http";
import fs from "fs";
import path from "path";
import os from "os";
import { Config } from "./types";

const configPath = path.join(
  os.homedir(),
  ".config",
  "clash",
  "clash-fastest-proxy-selector.json"
);

const getConfig = () => {
  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(
      configPath,
      JSON.stringify(
        {
          selectorName: "🔰国外流量",
          hostname: "127.0.0.1",
          port: 9090,
          delayCheckTimeout: 3000,
          delayCheckURL: "https://www.google.com",
        },
        null,
        2
      )
    );
  }
  const config = require(configPath) as Config;
  console.log(`Config Path: ${configPath}`);
  console.log(config);
  console.log("");
  console.log("");
  return config;
};

const config = getConfig();
const http = new HTTP(config);

const getProxies = async () => {
  const { proxies } = await http.get<{
    proxies: { name: string; type: string }[];
  }>(`/providers/proxies/${encodeURIComponent(config.selectorName)}`);

  return proxies
    .filter((proxy) => proxy.type === "Vmess")
    .map((proxy) => proxy.name);
};

const checkDelay = async (proxiesName: string[]) => {
  const checkList = proxiesName.map((name) =>
    http.get<{ delay: number }>(
      `/proxies/${encodeURIComponent(name)}/delay?timeout=${
        config.delayCheckTimeout
      }&url=${encodeURIComponent(config.delayCheckURL)}`
    )
  );
  const delays = await Promise.all(checkList);

  return proxiesName.map((name, index) => ({
    name,
    delay: delays[index]["delay"] || Number.MAX_VALUE,
  }));
};

const getFastestProsy = (delaysInfo: { name: string; delay: number }[]) =>
  delaysInfo.length ? delaysInfo.sort((a, b) => a.delay - b.delay)[0] : null;

const selectProxy = async (prosyName: string) => {
  return await http.put(`/proxies/${encodeURIComponent(config.selectorName)}`, {
    name: prosyName,
  });
};

const main = async () => {
  const proxiesName = await getProxies();
  const delays = await checkDelay(proxiesName);
  const fastestProsy = getFastestProsy(delays);

  if (fastestProsy) {
    const success = await selectProxy(fastestProsy.name);

    if (success) {
      console.log(
        `Fasted Proxy Selected:\n${JSON.stringify(fastestProsy, null, 2)}`
      );
    }
  } else {
    console.error(`No Proxy.`);
    console.log(proxiesName);
    console.log(delays);
  }
};

if (require.main === module) {
  main();
}
