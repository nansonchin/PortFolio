import { Outlet } from "react-router-dom";
import TerminalAssistant from "../components/TerminalAssistant/TerminalAssistant";
import SystemOverlay from "../components/SystemOverlay/SystemOverlay";
import IntroScreen from "../components/Intro/IntroScreen";

export default function RootLayout() {
  return (
    <>
      <SystemOverlay />
      <IntroScreen/>
      <TerminalAssistant />
      <Outlet />
    </>
  );
}
