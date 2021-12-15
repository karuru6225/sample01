import React, { useContext } from "react";
import API from "@aws-amplify/api";
import { ApiConfig, RequestParams } from "./types";

interface ApiContextValue {
  get<T>(name: string, params?: RequestParams): Promise<T>;
  post<T>(name: string, params?: RequestParams): Promise<T>;
  put<T>(name: string, params?: RequestParams): Promise<T>;
  del<T>(name: string, params?: RequestParams): Promise<T>;
}

const ApiContext = React.createContext<ApiContextValue>(
  {} as ApiContextValue
);

export const useApi = (): ApiContextValue =>
  useContext<ApiContextValue>(ApiContext);

interface Props {
  apiConfig: ApiConfig;
  children: React.ReactNode;
}

export const ApiProvider: React.FC<Props> = (props: Props) => {
  const { apiConfig } = props;
  const { api } = apiConfig;

  const findApi = (name: string) => {
    const apiConfig = api.find(({ name: n }) => n === name);
    if (!apiConfig) {
      throw new Error("api not found");
    }
    return apiConfig;
  };

  const getParams = async (params?: RequestParams) => {
    let headers = { };
    if (params && params.headers) {
      headers = {
        ...params.headers,
        ...headers,
      };
    }
    // console.log("getParams", { params, headers });
    return {
      ...params,
      headers,
    };
  };

  const apiMethods = {
    get: async (name: string, params?: RequestParams) => {
      const { path } = findApi(name);
      const _params = await getParams(params);
      // console.log(_params);
      return API.get(name, path, _params);
    },
    post: async (name: string, params?: RequestParams) => {
      const { path } = findApi(name);
      const _params = await getParams(params);
      return API.post(name, path, _params);
    },
    put: async (name: string, params?: RequestParams) => {
      const { path } = findApi(name);
      const _params = await getParams(params);
      return API.put(name, path, _params);
    },
    del: async (name: string, params?: RequestParams) => {
      const { path } = findApi(name);
      const _params = await getParams(params);
      return API.del(name, path, _params);
    },
  };

  return (
    <ApiContext.Provider value={apiMethods}>
      {props.children}
    </ApiContext.Provider>
  );
};
