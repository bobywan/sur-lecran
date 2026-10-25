import type { DetectedClient } from "./detect.js";
import type { Browser, HomeScreenGuide, HomeScreenStep, Platform } from "./types.js";

export function buildGuide(
  detected: DetectedClient,
  appName?: string,
): HomeScreenGuide {
  if (detected.platform === "unknown") return neutralGuide();

  const app = appLabel(appName);
  const title = `Ajouter ${app} à l’écran d’accueil`;

  if (detected.alreadyOnHomeScreen) {
    return {
      ...detected,
      shouldExplain: false,
      title,
      intro: `${app} est déjà sur l’écran d’accueil.`,
      steps: [],
    };
  }

  if (detected.platform === "desktop") {
    return {
      ...detected,
      shouldExplain: false,
      title,
      intro: `Ouvre cette page sur ton téléphone pour ajouter ${app} à l’écran d’accueil.`,
      steps: [],
    };
  }

  return {
    ...detected,
    shouldExplain: true,
    title,
    intro: `Voici comment ajouter ${app} à l’écran d’accueil.`,
    steps: stepsFor(detected.platform, detected.browser),
  };
}

function appLabel(appName: string | undefined): string {
  const trimmed = appName?.trim();
  return trimmed ? trimmed : "l’application";
}

function stepsFor(platform: Platform, browser: Browser): HomeScreenStep[] {
  if (platform === "ios") {
    if (
      browser === "safari" ||
      browser === "chrome" ||
      browser === "edge" ||
      browser === "firefox"
    ) {
      return iosShareSteps(browserName(browser));
    }
    return openInSafariSteps();
  }

  if (browser === "samsung") return samsungSteps();
  if (browser === "firefox") return firefoxAndroidSteps();
  if (browser === "chrome" || browser === "edge") return chromeAndroidSteps();
  return openInChromeSteps();
}

function browserName(browser: Browser): string {
  switch (browser) {
    case "safari":
      return "Safari";
    case "chrome":
      return "Chrome";
    case "edge":
      return "Edge";
    case "firefox":
      return "Firefox";
    default:
      return "le navigateur";
  }
}

function iosShareSteps(browserName: string): HomeScreenStep[] {
  return [
    { id: "open", text: `Ouvre cette page dans ${browserName}.` },
    {
      id: "share",
      text: "Touche le bouton Partager (carré avec une flèche).",
    },
    { id: "add", text: "Touche « Sur l’écran d’accueil »." },
    { id: "confirm", text: "Confirme avec Ajouter." },
  ];
}

function openInSafariSteps(): HomeScreenStep[] {
  return [
    { id: "menu", text: "Touche le menu de l’application." },
    { id: "open", text: "Choisis Ouvrir dans Safari." },
    {
      id: "add",
      text: "Une fois dans Safari, touche Partager puis « Sur l’écran d’accueil ».",
    },
  ];
}

function chromeAndroidSteps(): HomeScreenStep[] {
  return [
    {
      id: "menu",
      text: "Ouvre le menu du navigateur (les trois points).",
    },
    {
      id: "add",
      text: "Touche « Installer l’application » ou « Ajouter à l’écran d’accueil ».",
    },
    { id: "confirm", text: "Confirme." },
  ];
}

function samsungSteps(): HomeScreenStep[] {
  return [
    { id: "menu", text: "Ouvre le menu." },
    { id: "add-page", text: "Touche « Ajouter la page à »." },
    { id: "home", text: "Touche « Écran d’accueil »." },
    { id: "confirm", text: "Confirme." },
  ];
}

function firefoxAndroidSteps(): HomeScreenStep[] {
  return [
    { id: "menu", text: "Ouvre le menu." },
    {
      id: "add",
      text: "Touche « Installer » ou « Ajouter à l’écran d’accueil ».",
    },
    { id: "confirm", text: "Confirme." },
  ];
}

function openInChromeSteps(): HomeScreenStep[] {
  return [
    { id: "menu", text: "Touche le menu de l’application." },
    { id: "open", text: "Choisis Ouvrir dans Chrome." },
    {
      id: "add",
      text: "Dans Chrome, ouvre le menu puis « Ajouter à l’écran d’accueil ».",
    },
  ];
}

function neutralGuide(): HomeScreenGuide {
  return {
    platform: "unknown",
    browser: "other",
    alreadyOnHomeScreen: false,
    shouldExplain: false,
    title: "",
    intro: "",
    steps: [],
  };
}
