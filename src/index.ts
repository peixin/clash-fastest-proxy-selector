import HTTP from "./http";
import { Config } from "./types";

const config: Config = {
  selectorName: "🔰国外流量",
  hostname: "127.0.0.1",
  port: 9090,
  delayCheckTimeout: 3000,
  delayCheckURL: "https://www.google.com",
};
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

const init = () => {
  let [selectorName, hostname, port, delayCheckTimeout, delayCheckURL] =
    process.argv.slice(2);
  if (selectorName) {
    config.selectorName = selectorName;
  }
  if (hostname) {
    config.hostname = hostname;
  }
  if (port) {
    config.port = parseInt(port);
  }
  if (delayCheckTimeout) {
    config.delayCheckTimeout = parseInt(delayCheckTimeout);
  }
  if (delayCheckURL) {
    config.delayCheckURL = delayCheckURL;
  }

  console.log(config);
  console.log("");
  console.log("");
};

export const run = async () => {
  init();
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
  run();
}
