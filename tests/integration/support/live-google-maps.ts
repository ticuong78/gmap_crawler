export const shouldRunLiveGoogleMapsTests =
  process.env.RUN_LIVE_GOOGLE_MAPS_TESTS === "1" || process.env.CI !== "true";
