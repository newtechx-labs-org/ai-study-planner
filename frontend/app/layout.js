import "./globals.css";
import * as React from "react";
import { Providers } from "./providers";

export const metadata = {
  title: "AI Study Planner",
  description: "Build personalized study schedules with AI-powered planning",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-toolpad-color-scheme="light">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
