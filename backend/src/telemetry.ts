import {
  AzureMonitorOpenTelemetryOptions,
  useAzureMonitor,
} from "@azure/monitor-opentelemetry";
import { metrics, trace } from "@opentelemetry/api";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { ExpressInstrumentation } from "@opentelemetry/instrumentation-express";
import { HttpInstrumentationConfig } from "@opentelemetry/instrumentation-http";
import { MongoDBInstrumentationConfig } from "@opentelemetry/instrumentation-mongodb";
import { Resource } from "@opentelemetry/resources";
import { SEMRESATTRS_SERVICE_NAME } from "@opentelemetry/semantic-conventions";
import { IncomingMessage } from "http";

export const intializeTelemetry = () => {
  const httpInstrumentationConfig: HttpInstrumentationConfig = {
    enabled: true,
    ignoreIncomingRequestHook: (request: IncomingMessage) => {
      // Ignore OPTIONS incoming requests
      if (request.method === "OPTIONS") {
        return true;
      }
      return false;
    },
  };

  const customResource = Resource.EMPTY;
  customResource.attributes[SEMRESATTRS_SERVICE_NAME] = "Backend";

  const mongoInstrumentationConfig: MongoDBInstrumentationConfig = {
    enabled: true,
    enhancedDatabaseReporting: true,
  };

  const options: AzureMonitorOpenTelemetryOptions = {
    resource: customResource,
    azureMonitorExporterOptions: {
      connectionString: process.env.APPLICATION_INSIGHTS_CONNECTION_STRING,
    },
    instrumentationOptions: {
      http: httpInstrumentationConfig,
      mongoDb: mongoInstrumentationConfig,
    },
  };

  useAzureMonitor(options);
  addOpenTelemetryInstrumentation();
};

/**
 * Add additional OpenTelemetry instrumentation that is not bundled with Azure OpenTelemetry Distro
 */
const addOpenTelemetryInstrumentation = () => {
  const instrumentations = [new ExpressInstrumentation()];
  registerInstrumentations({
    tracerProvider: trace.getTracerProvider(),
    meterProvider: metrics.getMeterProvider(),
    instrumentations: instrumentations,
  });
};
