import { detect, type DetectInput } from "./detect.js";
import { buildGuide } from "./guides.js";
import type { GetHomeScreenGuideOptions, HomeScreenGuide } from "./types.js";

const NEUTRAL: HomeScreenGuide = {
  platform: "unknown",
  browser: "other",
  alreadyOnHomeScreen: false,
  shouldExplain: false,
  title: "",
  intro: "",
  steps: [],
};

export function getHomeScreenGuide(
  options: GetHomeScreenGuideOptions = {},
): HomeScreenGuide {
  const input = resolveInput(options);
  if (!input) return NEUTRAL;
  return buildGuide(detect(input), options.appName);
}

function resolveInput(
  options: GetHomeScreenGuideOptions,
): DetectInput | null {
  if (options.userAgent !== undefined) {
    return {
      userAgent: options.userAgent,
      displayMode: options.displayMode,
      standalone: options.standalone,
      maxTouchPoints: options.maxTouchPoints,
    };
  }

  if (typeof window === "undefined") return null;

  const nav = window.navigator;
  const iosNavigator = nav as Navigator & { standalone?: boolean };
  return {
    userAgent: nav.userAgent,
    displayMode:
      options.displayMode ??
      (window.matchMedia("(display-mode: standalone)").matches
        ? "standalone"
        : "browser"),
    standalone: options.standalone ?? Boolean(iosNavigator.standalone),
    maxTouchPoints: options.maxTouchPoints ?? nav.maxTouchPoints,
  };
}
