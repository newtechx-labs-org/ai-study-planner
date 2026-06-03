"use client";

import * as React from "react";
import { Provider } from "react-redux";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { store } from "@/store";
import AlarmProvider from "@/app/components/AlarmProvider";

export function Providers({ children }) {
  return (
    <Provider store={store}>
      <AppRouterCacheProvider options={{ enableCssLayer: true }}>
        <AlarmProvider>{children}</AlarmProvider>
      </AppRouterCacheProvider>
    </Provider>
  );
}
