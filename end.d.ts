declare namespace NodeJS {
  interface ProcessEnv {
    readonly PORT: number;
    readonly DB: string;
    readonly NODE_ENV: "development" | "production";
    readonly BASE_URL: string;
    readonly JWT_SECRET: string;
    readonly JWT_SECRET_RESET: string;
    readonly JWT_EXPIRE: string;
    readonly JWT_EXPIRE_RESET: string;
    readonly EMAIL_HOST: string;
    readonly EMAIL_USERNAME: string;
    readonly EMAIL_PASSWORD: string;
    readonly APP_NAME: string;
    readonly GOOGLE_CLIENT_ID: string;
    readonly GOOGLE_CLIENT_SECRET: string;
    readonly GOOGLE_CALLBACK: string;
    readonly HMAC: string;
  }
}
