module.exports = {
  packagerConfig: {
    protocols: [
      {
        name: "Electron Login",
        schemes: ["electron-login"],
        protocol: "electron-login",
      },
    ],
  },
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        mimeType: ["x-scheme-handler/electron-login"],
      },
    },
    // {
    //   name: '@electron-forge/maker-zip',
    //   platforms: ['darwin'],
    // },
    // {
    //   name: '@electron-forge/maker-deb',
    //   config: {},
    // },
    // {
    //   name: '@electron-forge/maker-rpm',
    //   config: {},
    // },
  ],
};
