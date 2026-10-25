/**
 * @vitest-environment happy-dom
 */
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { HomeScreenBanner } from "./HomeScreenBanner.tsx";

const IPHONE_SAFARI =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1";
const DESKTOP_CHROME =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36";

afterEach(() => {
  cleanup();
  localStorage.clear();
});

describe("HomeScreenBanner", () => {
  it("affiche les étapes iPhone", async () => {
    setUserAgent(IPHONE_SAFARI);
    render(<HomeScreenBanner appName="Cookezy" />);
    expect(
      await screen.findByRole("heading", {
        name: "Ajouter Cookezy à l’écran d’accueil",
      }),
    ).toBeTruthy();
    expect(screen.getByText(/Sur l’écran d’accueil/)).toBeTruthy();
  });

  it("reste caché sur ordinateur", async () => {
    setUserAgent(DESKTOP_CHROME);
    render(<HomeScreenBanner appName="Cookezy" />);
    await expect(
      screen.findByRole("heading", {}, { timeout: 300 }),
    ).rejects.toThrow();
  });

  it("disparaît après Fermer et prévient l’app", async () => {
    setUserAgent(IPHONE_SAFARI);
    const onDismiss = vi.fn();
    render(
      <HomeScreenBanner
        appName="Cookezy"
        onDismiss={onDismiss}
        storageKey="sur-lecran:test"
      />,
    );
    fireEvent.click(await screen.findByRole("button", { name: "Fermer" }));
    expect(onDismiss).toHaveBeenCalledOnce();
    expect(screen.queryByRole("button", { name: "Fermer" })).toBeNull();
    expect(localStorage.getItem("sur-lecran:test")).toBe("1");
  });
});

function setUserAgent(userAgent: string): void {
  Object.defineProperty(window.navigator, "userAgent", {
    value: userAgent,
    configurable: true,
  });
}
