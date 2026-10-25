import type { Browser, Platform } from "./types.js";

export type DetectInput = {
  userAgent: string;
  displayMode?: "browser" | "standalone";
  standalone?: boolean;
  maxTouchPoints?: number;
};

export type DetectedClient = {
  platform: Platform;
  browser: Browser;
  alreadyOnHomeScreen: boolean;
};

const IN_APP = /Instagram|FBAN|FB_IAB|TikTok|Snapchat|Line\//i;

export function detect(input: DetectInput): DetectedClient {
  const platform = detectPlatform(input.userAgent, input.maxTouchPoints ?? 0);
  return {
    platform,
    browser: detectBrowser(input.userAgent, platform),
    alreadyOnHomeScreen:
      input.displayMode === "standalone" || input.standalone === true,
  };
}

function detectPlatform(userAgent: string, maxTouchPoints: number): Platform {
  if (/iPhone|iPad|iPod/i.test(userAgent)) return "ios";
  if (/Macintosh/i.test(userAgent) && maxTouchPoints > 1) return "ios";
  if (/Android/i.test(userAgent)) return "android";
  if (userAgent.trim() === "") return "unknown";
  return "desktop";
}

function detectBrowser(userAgent: string, platform: Platform): Browser {
  if (IN_APP.test(userAgent)) return "in-app";

  if (platform === "ios") {
    if (/CriOS/i.test(userAgent)) return "chrome";
    if (/FxiOS/i.test(userAgent)) return "firefox";
    if (/EdgiOS/i.test(userAgent)) return "edge";
    if (/Safari/i.test(userAgent)) return "safari";
    return "other";
  }

  if (platform === "android") {
    if (/SamsungBrowser/i.test(userAgent)) return "samsung";
    if (/EdgA\/|Edg\//i.test(userAgent)) return "edge";
    if (/Firefox/i.test(userAgent)) return "firefox";
    if (/Chrome/i.test(userAgent)) return "chrome";
    return "other";
  }

  if (platform === "desktop") {
    if (/Edg\//i.test(userAgent)) return "edge";
    if (/Firefox/i.test(userAgent)) return "firefox";
    if (/Chrome/i.test(userAgent)) return "chrome";
    if (/Safari/i.test(userAgent)) return "safari";
  }

  return "other";
}
