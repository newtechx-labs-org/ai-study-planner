"use client";

import * as React from "react";
import { Provider } from "react-redux";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { store } from "@/store";

export function Providers({ children }) {
  return (
    <Provider store={store}>
      <AppRouterCacheProvider options={{ enableCssLayer: true }}>
        {children}
      </AppRouterCacheProvider>
    </Provider>
  );
}
