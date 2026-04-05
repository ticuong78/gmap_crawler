export const shouldRunFullLiveGoogleMapsTests =
  process.env.RUN_FULL_LIVE_GOOGLE_MAPS_TESTS === "1" || process.env.CI !== "true";
