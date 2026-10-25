export type Platform = "ios" | "android" | "desktop" | "unknown";

export type Browser =
  | "safari"
  | "chrome"
  | "samsung"
  | "firefox"
  | "edge"
  | "in-app"
  | "other";

export type HomeScreenStep = {
  id: string;
  text: string;
};

export type HomeScreenGuide = {
  platform: Platform;
  browser: Browser;
  alreadyOnHomeScreen: boolean;
  shouldExplain: boolean;
  title: string;
  intro: string;
  steps: HomeScreenStep[];
};

export type GetHomeScreenGuideOptions = {
  appName?: string;
  userAgent?: string;
  displayMode?: "browser" | "standalone";
  standalone?: boolean;
  /** Utile pour reconnaître un iPad qui se présente comme un Mac. */
  maxTouchPoints?: number;
};

export type HomeScreenBannerProps = {
  appName?: string;
  onDismiss?: () => void;
  storageKey?: string;
  className?: string;
};
