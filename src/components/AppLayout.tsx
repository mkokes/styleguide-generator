import { DesktopOutlined, MoonOutlined, SunOutlined } from "@ant-design/icons";
import { Layout, Segmented } from "antd";
import { Link, Outlet } from "react-router-dom";
import type { ThemePref } from "../theme";

interface Props {
  themePref: ThemePref;
  onThemePrefChange: (pref: ThemePref) => void;
}

export default function AppLayout({ themePref, onThemePrefChange }: Props) {
  return (
    <Layout className="app">
      <Layout.Header className="app-header">
        <Link to="/" className="app-brand">
          <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" width={28} height={28} />
          Styleguide Generator
        </Link>
        <Segmented<ThemePref>
          aria-label="Color theme"
          value={themePref}
          onChange={onThemePrefChange}
          options={[
            { value: "light", icon: <SunOutlined />, title: "Light" },
            { value: "system", icon: <DesktopOutlined />, title: "System" },
            { value: "dark", icon: <MoonOutlined />, title: "Dark" },
          ]}
        />
      </Layout.Header>
      <Layout.Content className="app-content">
        <Outlet />
      </Layout.Content>
    </Layout>
  );
}
