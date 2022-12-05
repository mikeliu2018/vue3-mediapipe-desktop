declare global {
  interface Window {
    electronAPI: {
      getPlatformVersion: (platform: string) => Window.electronAPI;
      handleLoginWithGoogle: (
        callback: (e: IpcRendererEvent, v: UserToken) => Promise<void>
      ) => Window.electronAPI;
    };
    versions: {
      name: string;
      version: string;
    };
  }

  interface UserToken {
    access_token: string;
    expiry_date: string;
    id_token: string;
    refresh_token: string;
    scope: string;
    token_type: string;
  }

  interface UserInfo {
    account_source_email: string;
    account_source_id: string;
    account_source_name: string;
    account_source_picture: string;
    account_source_type: string;
    created_at: string;
    updated_at: string;
  }
}

export {};
