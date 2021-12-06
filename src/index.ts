import HTTP from "./http";
import { Config } from "./types";
import yargs from "yargs";

const config = {
  selectorName: "🔰国外流量",
  hostname: "127.0.0.1",
  port: 9090,
  delayCheckTimeout: 3000,
  delayCheckURL: "https://www.google.com",
  excludeNodeNames: ["香港"],
} as Config;

const http = new HTTP(config);

const getProxies = async () => {
  const { proxies } = await http.get<{
    proxies: { name: string; type: string }[];
  }>(`/providers/proxies/${encodeURIComponent(config.selectorName)}`);

  return excludeProxies(
    proxies.filter((proxy) => proxy.type === "Vmess").map((proxy) => proxy.name),
    config.excludeNodeNames
  );
};

const excludeProxies = (proxiesName: string[], excludes?: string[]) => {
  if (excludes?.length) {
    return proxiesName.filter((name) => excludes.some((exclude) => name.search(exclude) === -1));
  }
  return proxiesName;
};

const checkDelay = async (proxiesName: string[]) => {
  const checkList = proxiesName.map((name) =>
    http.get<{ delay: number }>(
      `/proxies/${encodeURIComponent(name)}/delay?timeout=${config.delayCheckTimeout}&url=${encodeURIComponent(
        config.delayCheckURL
      )}`
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

const init = async () => {
  const argv = await yargs.usage("Clash auto select fastest proxy tool").options({
    "selector-name": {
      description: "Clash group name",
      default: config.selectorName,
      type: "string",
      alias: "s",
    },
    "host-name": {
      description: "Clash API host name",
      default: config.hostname,
      type: "string",
      alias: "h",
    },
    port: {
      description: "Clash API port",
      default: config.port,
      type: "number",
      alias: "p",
    },
    "delay-check-timeout": {
      description: "check speed timeout millisecond",
      default: config.delayCheckTimeout,
      type: "number",
      alias: "t",
    },
    "delay-check-url": {
      description: "check speed url",
      default: config.delayCheckURL,
      type: "string",
      alias: "u",
    },

    "exclude-node-names": {
      description: "exclude node names e.g. 香港",
      type: "array",
      alias: "e",
    },
  }).argv;

  const {
    "selector-name": selectorName,
    "host-name": hostname,
    port: port,
    "delay-check-timeout": delayCheckTimeout,
    "delay-check-url": delayCheckURL,
    "exclude-node-names": excludeNodeNames,
  } = argv;

  config.selectorName = selectorName;
  config.hostname = hostname;
  config.port = port;
  config.delayCheckTimeout = delayCheckTimeout;
  config.delayCheckURL = delayCheckURL;
  config.excludeNodeNames = excludeNodeNames as string[] | undefined;

  console.log(config);
  console.log("\n\n");
};

export const run = async () => {
  await init();
  const proxiesName = await getProxies();
  const delays = await checkDelay(proxiesName);
  const fastestProsy = getFastestProsy(delays);

  if (fastestProsy) {
    const success = await selectProxy(fastestProsy.name);

    if (success) {
      console.log(`Fastest Proxy Selected:\n${JSON.stringify(fastestProsy, null, 2)}`);
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
