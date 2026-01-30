import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.italostudy.app',
  appName: 'ITALOSTUDY',
  webDir: 'dist',
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    GoogleAuth: {
      scopes: ["profile", "email"],
      serverClientId: "1024628325882-r22rscgquf6sivlqpk7r3vj973u5575v.apps.googleusercontent.com",
      clientId: "1024628325882-r22rscgquf6sivlqpk7r3vj973u5575v.apps.googleusercontent.com",
      androidClientId: "1024628325882-r22rscgquf6sivlqpk7r3vj973u5575v.apps.googleusercontent.com",
      forceCodeForRefreshToken: true,
    },
  },
};

export default config;
