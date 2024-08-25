import { config } from 'dotenv';

config();

export type EnvironmentVariable = { [key: string]: string | undefined };
export type EnvironmentsTypes =
  | 'DEVELOPMENT'
  | 'STAGING'
  | 'PRODUCTION'
  | 'TESTING';
export const Environments = ['DEVELOPMENT', 'STAGING', 'PRODUCTION', 'TESTING'];

export class EnvironmentSettings {
  constructor(private env: EnvironmentsTypes) {}

  getEnv() {
    return this.env;
  }

  isProduction() {
    return this.env === 'PRODUCTION';
  }

  isStaging() {
    return this.env === 'STAGING';
  }

  isDevelopment() {
    return this.env === 'DEVELOPMENT';
  }

  isTesting() {
    return this.env === 'TESTING';
  }
}

class AppSettings {
  constructor(
    public env: EnvironmentSettings,
    public api: APISettings,
  ) {}
}

class APISettings {
  // Application
  public readonly APP_PORT: number;

  // Database
  public readonly MONGO_URI: string;
  public readonly MONGO_URI_FOR_TESTS: string;
  public readonly POSTGRES_URI: string;
  public readonly POSTGRES_URI_FOR_TESTS: string;

  constructor(private readonly envVariables: EnvironmentVariable) {
    // Application
    this.APP_PORT = this.getNumberOrDefault(envVariables.APP_PORT as string, 3000);

    // Database
    this.MONGO_URI =
      envVariables.MONGO_URI ?? 'mongodb://localhost/blog-nest';
    this.MONGO_URI_FOR_TESTS =
      envVariables.MONGO_URI_FOR_TESTS ?? 'mongodb://localhost/blog-test';
    this.POSTGRES_URI =
      envVariables.POSTGRES_URI ?? "postgres://postgres/777666@localhost:5432/blog-nest-db"
    this.POSTGRES_URI_FOR_TESTS =
      envVariables.POSTGRES_URI_FOR_TESTS ?? 'postgres://postgres/777666@localhost:5432/blog-nest-test'; 
  
  }

  private getNumberOrDefault(value: string, defaultValue: number): number {   
    const parsedValue = Number(value);

    if (isNaN(parsedValue)) {
      return defaultValue;
    }

    return parsedValue;
  }
}

const env = new EnvironmentSettings(
  (Environments.includes((process.env.ENV as string)?.trim())
    ? (process.env.ENV as string).trim()
    : 'DEVELOPMENT') as EnvironmentsTypes,
);

const api = new APISettings(process.env);
export const appSettings = new AppSettings(env, api);