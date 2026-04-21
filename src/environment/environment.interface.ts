export interface EnvironmentInterface {
  baseUrl: string;
  scraperBaseUrl: string;
  auth: {
    issuer: string;
    clientId: string;
    responseType: string;
    scope: string;
  };
}
