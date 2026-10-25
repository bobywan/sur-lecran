import { describe, expect, it } from "vitest";
import { getHomeScreenGuide } from "./getHomeScreenGuide.ts";

const IPHONE_SAFARI =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1";
const IPHONE_CHROME =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/129.0.6668.46 Mobile/15E148 Safari/604.1";
const IPHONE_EDGE =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) EdgiOS/129.0.2792.52 Version/18.0 Mobile/15E148 Safari/604.1";
const IPHONE_FIREFOX =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/131.0 Mobile/15E148 Safari/605.1.15";
const IPHONE_OTHER =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148";
const ANDROID_CHROME =
  "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.6668.70 Mobile Safari/537.36";
const ANDROID_SAMSUNG =
  "Mozilla/5.0 (Linux; Android 14; SAMSUNG SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/26.0 Chrome/122.0.6261.64 Mobile Safari/537.36";
const ANDROID_FIREFOX =
  "Mozilla/5.0 (Android 14; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0";
const ANDROID_EDGE =
  "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.6668.70 Mobile Safari/537.36 EdgA/129.0.2792.52";
const ANDROID_OTHER =
  "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Mobile Safari/537.36";
const INSTAGRAM =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 350.0.0.0.0";
const DESKTOP_CHROME =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36";
const IPAD_AS_MAC =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15";

describe("getHomeScreenGuide", () => {
  it("reste neutre sans window ni userAgent", () => {
    expect(getHomeScreenGuide()).toEqual({
      platform: "unknown",
      browser: "other",
      alreadyOnHomeScreen: false,
      shouldExplain: false,
      title: "",
      intro: "",
      steps: [],
    });
  });

  it("cite Cookezy dans le titre", () => {
    const guide = getHomeScreenGuide({
      appName: "Cookezy",
      userAgent: IPHONE_SAFARI,
    });
    expect(guide.title).toBe("Ajouter Cookezy à l’écran d’accueil");
  });

  it("dit l’application quand le nom manque", () => {
    const guide = getHomeScreenGuide({ userAgent: IPHONE_SAFARI });
    expect(guide.title).toBe("Ajouter l’application à l’écran d’accueil");
    expect(guide.intro).toContain("l’application");
  });

  it("explique Safari sur iPhone", () => {
    const guide = getHomeScreenGuide({
      appName: "Cookezy",
      userAgent: IPHONE_SAFARI,
    });
    expect(guide.platform).toBe("ios");
    expect(guide.browser).toBe("safari");
    expect(guide.shouldExplain).toBe(true);
    expect(guide.steps.map((step) => step.text).join(" ")).toMatch(
      /Safari/,
    );
    expect(guide.steps.map((step) => step.text).join(" ")).toMatch(
      /Partager/,
    );
    expect(guide.steps.map((step) => step.text).join(" ")).toMatch(
      /Sur l’écran d’accueil/,
    );
    expect(guide.steps.map((step) => step.text).join(" ")).toMatch(/Ajouter/);
  });

  it("explique Chrome, Edge et Firefox sur iPhone", () => {
    const chrome = getHomeScreenGuide({ userAgent: IPHONE_CHROME });
    const edge = getHomeScreenGuide({ userAgent: IPHONE_EDGE });
    const firefox = getHomeScreenGuide({ userAgent: IPHONE_FIREFOX });

    expect(chrome).toMatchObject({ platform: "ios", browser: "chrome" });
    expect(edge).toMatchObject({ platform: "ios", browser: "edge" });
    expect(firefox).toMatchObject({ platform: "ios", browser: "firefox" });
    expect(textOf(chrome)).toMatch(/Chrome/);
    expect(textOf(edge)).toMatch(/Edge/);
    expect(textOf(firefox)).toMatch(/Firefox/);
    for (const guide of [chrome, edge, firefox]) {
      expect(textOf(guide)).toMatch(/Partager/);
      expect(textOf(guide)).toMatch(/Sur l’écran d’accueil/);
    }
  });

  it("envoie un iPhone inconnu vers Safari", () => {
    const guide = getHomeScreenGuide({ userAgent: IPHONE_OTHER });
    expect(guide).toMatchObject({ platform: "ios", browser: "other" });
    expect(textOf(guide)).toMatch(/Ouvrir dans Safari/);
    expect(textOf(guide)).toMatch(/Sur l’écran d’accueil/);
  });

  it("reconnaît Instagram comme une app intégrée", () => {
    const guide = getHomeScreenGuide({ userAgent: INSTAGRAM });
    expect(guide).toMatchObject({ platform: "ios", browser: "in-app" });
    expect(textOf(guide)).toMatch(/Ouvrir dans Safari/);
  });

  it("explique Chrome et Edge sur Android", () => {
    const chrome = getHomeScreenGuide({ userAgent: ANDROID_CHROME });
    const edge = getHomeScreenGuide({ userAgent: ANDROID_EDGE });
    expect(chrome).toMatchObject({ platform: "android", browser: "chrome" });
    expect(edge).toMatchObject({ platform: "android", browser: "edge" });
    expect(textOf(chrome)).toMatch(/Installer l’application/);
    expect(textOf(chrome)).toMatch(/Ajouter à l’écran d’accueil/);
    expect(textOf(edge)).toMatch(/Installer l’application/);
  });

  it("explique Samsung Internet", () => {
    const guide = getHomeScreenGuide({ userAgent: ANDROID_SAMSUNG });
    expect(guide).toMatchObject({ platform: "android", browser: "samsung" });
    expect(textOf(guide)).toMatch(/Ajouter la page à/);
    expect(textOf(guide)).toMatch(/Écran d’accueil/);
  });

  it("explique Firefox sur Android", () => {
    const guide = getHomeScreenGuide({ userAgent: ANDROID_FIREFOX });
    expect(guide).toMatchObject({ platform: "android", browser: "firefox" });
    expect(textOf(guide)).toMatch(/Installer/);
    expect(textOf(guide)).toMatch(/Ajouter à l’écran d’accueil/);
  });

  it("envoie un Android inconnu vers Chrome", () => {
    const guide = getHomeScreenGuide({ userAgent: ANDROID_OTHER });
    expect(guide).toMatchObject({ platform: "android", browser: "other" });
    expect(textOf(guide)).toMatch(/Ouvrir dans Chrome/);
    expect(textOf(guide)).toMatch(/Ajouter à l’écran d’accueil/);
  });

  it("ne propose pas d’explication sur ordinateur", () => {
    const guide = getHomeScreenGuide({
      appName: "Cookezy",
      userAgent: DESKTOP_CHROME,
    });
    expect(guide.platform).toBe("desktop");
    expect(guide.shouldExplain).toBe(false);
    expect(guide.steps).toEqual([]);
    expect(guide.intro).toBe(
      "Ouvre cette page sur ton téléphone pour ajouter Cookezy à l’écran d’accueil.",
    );
  });

  it("traite un iPad déguisé en Mac comme un iPhone", () => {
    const guide = getHomeScreenGuide({
      userAgent: IPAD_AS_MAC,
      maxTouchPoints: 5,
    });
    expect(guide).toMatchObject({
      platform: "ios",
      browser: "safari",
      shouldExplain: true,
    });
    expect(textOf(guide)).toMatch(/Safari/);
  });

  it("sait quand la page est déjà ouverte depuis l’icône", () => {
    const byDisplayMode = getHomeScreenGuide({
      appName: "Cookezy",
      userAgent: IPHONE_SAFARI,
      displayMode: "standalone",
    });
    const byStandalone = getHomeScreenGuide({
      appName: "Cookezy",
      userAgent: ANDROID_CHROME,
      standalone: true,
    });

    for (const guide of [byDisplayMode, byStandalone]) {
      expect(guide.alreadyOnHomeScreen).toBe(true);
      expect(guide.shouldExplain).toBe(false);
      expect(guide.steps).toEqual([]);
      expect(guide.intro).toBe("Cookezy est déjà sur l’écran d’accueil.");
    }
  });
});

function textOf(guide: { steps: Array<{ text: string }> }): string {
  return guide.steps.map((step) => step.text).join(" ");
}
