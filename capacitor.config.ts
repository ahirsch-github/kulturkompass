import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kulturkompass.app',
  appName: 'kulturkompass',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
