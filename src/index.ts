import { GraphQLRequestContext } from "apollo-server-plugin-base";
import { PerformanceObserver, performance } from "perf_hooks";
import generateId from "./generate-id";
import fetch from "node-fetch";
import { PluginConfig } from "./types";
let startMark: string;
let endMark: string;
let measureName: string;
let additionInfo: any = {};
let logServerInfo: PluginConfig;

const obs = new PerformanceObserver((items) => {
  const perfInfo = items.getEntries()[0];
  const logInfo = {
    perfInfo,
    additionInfo,
  };
  fetch(logServerInfo.enginUrl, {
    method: "POST",
    headers: {
      "Authorization-key": logServerInfo.key,
    },
    body: JSON.stringify(logInfo),
  })
    .then(async (data) => {
      performance.clearMarks(startMark);
      performance.clearMarks(endMark);
    })
    .catch(() => {});
});

obs.observe({ entryTypes: ["measure"] });

export default (config: PluginConfig) => {
  logServerInfo = config;
  return {
    requestDidStart(service: any) {
      const isIntrospectionRequest =
        service.request.operationName === "IntrospectionQuery";
      if (isIntrospectionRequest) {
        return;
      }

      startMark = generateId("xxxx-xxxx-xxxx");
      performance.mark(startMark);
      endMark = generateId("xxxx-xxxx-xxxx");
      measureName = `${startMark} to ${endMark}`;

      return {
        parsingDidStart(requestContext: unknown) {
          console.log("Parsing started!");
        },
        willSendResponse(context: GraphQLRequestContext): void {
          if (context.response.errors) {
            additionInfo = Object.assign(additionInfo, {
              errors: context.response.errors,
            });
          }

          performance.mark(endMark);
          performance.measure(measureName, startMark, endMark);
        },
      };
    },
  };
};
