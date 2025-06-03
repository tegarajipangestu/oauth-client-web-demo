/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.

interface NextAppConfig {
  appName: string;
  clientId: string;
  clientSecret?: string;
  hostUrl: string;
  hydraUrl: string;
  port?: string;
}
