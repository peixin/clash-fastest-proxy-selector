import http from "http";
import { Config } from "./types";

export default class HTTP {
  private config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  private getOptions() {
    const options = {
      hostname: this.config.hostname,
      port: this.config.port,
      timeout: this.config.delayCheckTimeout,
    } as { [key: string]: number | string | object };

    if (this.config.apiToken) {
      options.headers = {
        Authorization: `Bearer ${this.config.apiToken}`,
      };
    }

    return options;
  }

  get<T>(path: string) {
    const options = { ...{ path: path, method: "GET" }, ...this.getOptions() };

    return new Promise<T>((resolve, reject) => {
      const req = http.request(options, (res) => {
        const body: Buffer[] = [];

        res.on("data", (chunk) => body.push(chunk));
        res.on("end", () => {
          try {
            const resString = Buffer.concat(body).toString();

            if (res.statusCode?.toString().startsWith("4")) {
              console.error("Clash API need Unauthorized:");
              console.error("clash-fastest-proxy --api-token xxxxx");
              reject("Clash API need Unauthorized");
            } else {
              resolve(JSON.parse(resString));
            }
          } catch (error) {
            console.error("get http error");
            console.error(error);
            reject(error);
          }
        });
      });

      req.on("error", (error) => {
        console.error("get http error");
        console.error(error);
        reject(error);
      });

      req.end();
    });
  }

  put(path: string, data: object) {
    const options = { ...{ path: path, method: "PUT" }, ...this.getOptions() };

    return new Promise<boolean>((resolve, reject) => {
      const req = http.request(options, (res) => {
        const body: Buffer[] = [];

        res.on("data", (chunk) => body.push(chunk));
        res.on("end", () => {
          const resString = Buffer.concat(body).toString();
          resolve(res.statusCode === 204);
        });
      });

      req.on("error", (error) => {
        console.error("put http error");
        console.error(error);
        reject(false);
      });

      req.write(JSON.stringify(data));
      req.end();
    });
  }
}
