"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { getHomeScreenGuide } from "./getHomeScreenGuide.js";
import type { HomeScreenBannerProps, HomeScreenGuide } from "./types.js";

const DEFAULT_STORAGE_KEY = "sur-lecran:dismissed";
const dismissedForThisVisit = new Set<string>();

export function HomeScreenBanner({
  appName,
  onDismiss,
  storageKey = DEFAULT_STORAGE_KEY,
  className,
}: HomeScreenBannerProps) {
  const [guide, setGuide] = useState<HomeScreenGuide | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setDismissed(isDismissed(storageKey));
    setGuide(getHomeScreenGuide({ appName }));
  }, [appName, storageKey]);

  function close(): void {
    rememberDismissal(storageKey);
    setDismissed(true);
    onDismiss?.();
  }

  if (!guide || !guide.shouldExplain || dismissed) return null;

  return (
    <aside className={className} style={bannerStyle} aria-label={guide.title}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>{guide.title}</h2>
        <button type="button" style={closeStyle} onClick={close}>
          Fermer
        </button>
      </div>
      <p style={introStyle}>{guide.intro}</p>
      <ol style={listStyle}>
        {guide.steps.map((step) => (
          <li key={step.id}>{step.text}</li>
        ))}
      </ol>
    </aside>
  );
}

function isDismissed(key: string): boolean {
  try {
    return window.localStorage.getItem(key) === "1";
  } catch {
    return dismissedForThisVisit.has(key);
  }
}

function rememberDismissal(key: string): void {
  try {
    window.localStorage.setItem(key, "1");
  } catch {
    dismissedForThisVisit.add(key);
  }
}

const bannerStyle: CSSProperties = {
  position: "fixed",
  left: 16,
  right: 16,
  bottom: 0,
  zIndex: 1000,
  margin: 0,
  padding: "16px 16px calc(16px + env(safe-area-inset-bottom))",
  background: "#ffffff",
  color: "#1a1a1a",
  borderRadius: "16px 16px 0 0",
  boxShadow: "0 -8px 24px rgba(0, 0, 0, 0.12)",
  fontFamily: "system-ui, sans-serif",
};

const headerStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 12,
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: 18,
  lineHeight: 1.3,
};

const closeStyle: CSSProperties = {
  flex: "0 0 auto",
  border: 0,
  background: "transparent",
  color: "inherit",
  font: "inherit",
  cursor: "pointer",
};

const introStyle: CSSProperties = {
  margin: "8px 0 0",
};

const listStyle: CSSProperties = {
  margin: "12px 0 0",
  paddingLeft: 20,
};
