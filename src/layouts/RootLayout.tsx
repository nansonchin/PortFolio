import { Outlet } from "react-router-dom";
import TerminalAssistant from "../components/TerminalAssistant/TerminalAssistant";
import SystemOverlay from "../components/SystemOverlay/SystemOverlay";
import IntroScreen from "../components/Intro/IntroScreen";
import ScrollToTop from "../components/ScrollToTop/ScrollToTop";
import PageTransition from "../components/PageTransition/PageTransition";

export default function RootLayout() {
  return (
    <>
      <SystemOverlay />
      <IntroScreen />
      <PageTransition />
      <ScrollToTop />
      <TerminalAssistant />
      <Outlet />
    </>
  );
}
