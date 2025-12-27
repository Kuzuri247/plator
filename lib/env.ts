import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z
      .string()
      .min(1, "Database URL is required")
      .refine((url) => {
        try {
          new URL(url);
          return true;
        } catch {
          return false;
        }
      }, "Must be a valid URL"),
    BETTER_AUTH_SECRET: z
      .string()
      .min(32, "Auth secret must be at least 32 characters"),
    BETTER_AUTH_URL: z
      .string()
      .min(1, "Auth URL is required")
      .refine((url) => {
        try {
          new URL(url);
          return true;
        } catch {
          return false;
        }
      }, "Must be a valid URL"),
    GOOGLE_CLIENT_ID: z.string().min(1, "Google Client ID is required"),
    GOOGLE_CLIENT_SECRET: z.string().min(1, "Google Client Secret is required"),
    IMAGEKIT_PRIVATE_KEY: z.string().min(1, "ImageKit Private Key is required"),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z
      .string()
      .min(1, "App URL is required")
      .refine((url) => {
        try {
          new URL(url);
          return true;
        } catch {
          return false;
        }
      }, "Must be a valid URL"),
    NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY: z
      .string()
      .min(1, "ImageKit Public Key is required"),
    NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT: z
      .string()
      .min(1, "ImageKit URL Endpoint is required")
      .refine((url) => {
        try {
          new URL(url);
          return true;
        } catch {
          return false;
        }
      }, "Must be a valid URL"),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,

    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY:
      process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
    NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT:
      process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
