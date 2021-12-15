export interface ApiItem {
  name: string;
  path: string;
}

export interface RequestParams {
  body?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  headers?: { string: string };
  responseType?: string;
  timeout?: number;
}

export interface ApiConfig {
  endpoint: string;
  api: ApiItem[];
}
