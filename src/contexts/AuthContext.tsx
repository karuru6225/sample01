import React, { useContext, useState, useEffect } from "react";
import { CognitoUser } from "amazon-cognito-identity-js";
import Amplify, { Auth } from "aws-amplify";
import { ApiItem } from "./types";

interface AuthContextValue {
  signUp: (
    username: string,
    email: string,
    password: string
  ) => Promise<CognitoUser | undefined | void>;
  confirmSignUp: (username: string, code: string) => Promise<void>;
  signIn: (username: string, password: string) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  signOut: () => Promise<void>;
  getToken: () => Promise<string>;
  isAuthenticated: boolean;
  isNewPasswordRequired: boolean;
  isLoading: boolean;
  error?: Error | null;
  user?: CognitoUser | null;
}

const AuthContext = React.createContext<AuthContextValue>(
  {} as AuthContextValue
);

export const useAuth = (): AuthContextValue =>
  useContext<AuthContextValue>(AuthContext);

interface Props {
  awsConfig: {
    Auth: {
      userPoolId: string;
      userPoolWebClientId: string;
      region: string;
    };
  };
  apiConfig?: {
    endpoint: string;
    api: ApiItem[];
  };
  children: React.ReactNode;
}

export const AuthProvider: React.FC<Props> = (props: Props) => {
  const { awsConfig, apiConfig } = props;
  const awsAuthConfig = {
    authenticationFlowType: "USER_PASSWORD_AUTH",
    ...awsConfig.Auth,
  };

  const { endpoint, api } = apiConfig || { endpoint: "", api: [] };

  const endpoints = api.map(({ name }) => ({
    name,
    endpoint,
    custom_header: async () => {
      return {
        Authorization: await getToken(),
      };
    },
  }));

  const configure = {
    Auth: awsAuthConfig,
    API: { endpoints },
  };

  Amplify.configure(configure);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // eslint-disable-next-line
  const [isNewPasswordRequired, setIsNewPasswordRequired] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [user, setUser] = useState<CognitoUser | null>(null);

  useEffect(() => {
    checkCurrentAuthenticatedUser();
  }, []);

  const checkCurrentAuthenticatedUser = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const _user = await Auth.currentAuthenticatedUser();
      setUser(_user);
      setIsAuthenticated(true);
    } catch (e) {
      setIsAuthenticated(false);
      setUser(null);
    }
    setIsLoading(false);
  };

  const signUp = async (
    username: string,
    email: string,
    password: string
  ): Promise<CognitoUser | undefined> => {
    setIsLoading(true);
    setError(null);
    let result;
    try {
      const params = {
        username,
        password,
        attributes: {
          email,
        },
      };
      result = await Auth.signUp(params);
      setUser(result.user);
    } catch (e) {
      setError(e);
    }
    setIsLoading(false);
    return result?.user;
  };

  const confirmSignUp = async (username: string, code: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await Auth.confirmSignUp(username, code);
    } catch (e) {
      setError(e);
    }
    setIsLoading(false);
  };
  const signIn = async (username: string, password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await Auth.signIn(username, password);
      await checkCurrentAuthenticatedUser();
    } catch (e) {
      console.log(e);
      setError(e);
      setIsAuthenticated(false);
      setUser(null);
    }
    setIsLoading(false);
  };

  // eslint-disable-next-line
  const changePassword = async (oldPassword: string, newPassword: string): Promise<void> => {
    throw new Error("not implemented");
  };

  const signOut = async (): Promise<void> => {
    await Auth.signOut();
    setIsAuthenticated(false);
    setUser(null);
  };

  const getToken = async () => {
    if (isAuthenticated) {
      return `Bearer ${(await Auth.currentSession())
        .getIdToken()
        .getJwtToken()}`;
    }
    return "";
  };

  return (
    <AuthContext.Provider
      value={{
        signUp,
        confirmSignUp,
        signIn,
        changePassword,
        signOut,
        isAuthenticated,
        isNewPasswordRequired,
        isLoading,
        error,
        user,
        getToken,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
