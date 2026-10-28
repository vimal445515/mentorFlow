export const env = {
  apiBaseUrl:
    (process.env.API_BASE_URL as string) || (process.env.VITE_API_BASE_URL as string) || "/api/v1",
  appName: "MentorFlow",
};
