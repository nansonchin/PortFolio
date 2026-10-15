import { Outlet } from "react-router-dom";
import TerminalAssistant from "../components/TerminalAssistant/TerminalAssistant";
import SystemOverlay from "../components/SystemOverlay/SystemOverlay";

export default function RootLayout() {
  return (
    <>
      <SystemOverlay />
      <TerminalAssistant />
      <Outlet />
    </>
  );
}
