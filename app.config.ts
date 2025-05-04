import "dotenv/config";

export default {
  expo: {
    name: "uber",
    slug: "uber",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#2F80ED",
    },
    extra: {
      googleApiKey: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.gthamza.uber",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.gthamza.uber",
    },
    web: {
      bundler: "metro",
      output: "server",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      [
        "expo-router",
        {
          origin: "https://uber.dev/",
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
  },
};
