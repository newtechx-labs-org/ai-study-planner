"use client";

import * as React from "react";
import { Provider } from "react-redux";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { store } from "@/store";

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-toolpad-color-scheme="light">
      <body>
        <Provider store={store}>
          <AppRouterCacheProvider options={{ enableCssLayer: true }}>
            {children}
          </AppRouterCacheProvider>
        </Provider>
      </body>
    </html>
  );
}
