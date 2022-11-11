export {};

declare global {
  interface Window {
    platform: {
      getVersion: (platform: string) => Window.versions;
    };
    versions: {
      name: string;
      version: string;
    };
  }
}
