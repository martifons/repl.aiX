'use client';

import { createContext, useContext, ReactNode } from 'react';

const DashboardThemeContext = createContext<boolean>(false);

export function DashboardThemeProvider({ children }: { children: ReactNode }) {
  return (
    <DashboardThemeContext.Provider value={true}>
      {children}
    </DashboardThemeContext.Provider>
  );
}

export function useDashboardTheme() {
  return useContext(DashboardThemeContext);
}
