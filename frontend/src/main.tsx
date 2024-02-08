import {
  ReactPlugin,
  withAITracking,
} from "@microsoft/applicationinsights-react-js";
import {
  ApplicationInsights,
  ITelemetryItem,
} from "@microsoft/applicationinsights-web";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./index.css";

const queryClient = new QueryClient();

const reactPlugin = new ReactPlugin();

const appInsights = new ApplicationInsights({
  config: {
    connectionString: import.meta.env
      .VITE_APPLICATION_INSIGHTS_CONNECTION_STRING,
    enableAutoRouteTracking: true, // react-router doesn't expose router history
    extensions: [reactPlugin],
    enableCorsCorrelation: true,
  },
});

appInsights.addTelemetryInitializer((env: ITelemetryItem) => {
  if (env.tags) env.tags["ai.cloud.role"] = "Frontend";
});

appInsights.loadAppInsights();
appInsights.appInsights.trackPageView();

const TrackedRootApp = withAITracking(reactPlugin, App);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TrackedRootApp />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);
