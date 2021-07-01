import http from "http";
import fs from "fs";
import { Config } from "./types";

export default class HTTP {
  private config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  private getOptions() {
    return {
      hostname: this.config.hostname,
      port: this.config.port,
      timeout: this.config.delayCheckTimeout,
    };
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
            resolve(JSON.parse(resString));
          } catch (error) {
            reject(error);
          }
        });
      });

      req.on("error", (error) => {
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
        console.error(error);
        reject(false);
      });

      req.write(JSON.stringify(data));
      req.end();
    });
  }
}
