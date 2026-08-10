export interface EnvironmentInterface {
  baseUrl: string;
  scraperBaseUrl: string;
  transformerBaseUrl: string;
  adminBackendBaseUrl: string;
  auth: {
    issuer: string;
    clientId: string;
    responseType: string;
    scope: string;
  };
}
