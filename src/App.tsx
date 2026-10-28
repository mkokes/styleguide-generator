import { App as AntApp, ConfigProvider, Spin } from "antd";
import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import GuideList from "./pages/GuideList";
import ImportShared from "./pages/ImportShared";
import NotFound from "./pages/NotFound";
import { themeConfig } from "./theme";
import { useThemeMode } from "./useThemeMode";

const Wizard = lazy(() => import("./pages/Wizard"));

export default function App() {
  const { mode, pref, setPref } = useThemeMode();
  return (
    <ConfigProvider theme={themeConfig(mode)}>
      <AntApp>
        <Routes>
          <Route element={<AppLayout themePref={pref} onThemePrefChange={setPref} />}>
            <Route index element={<GuideList />} />
            <Route
              path="guide/:id/:step?"
              element={
                <Suspense fallback={<Spin className="route-loading" />}>
                  <Wizard />
                </Suspense>
              }
            />
            <Route path="import" element={<ImportShared />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </AntApp>
    </ConfigProvider>
  );
}
