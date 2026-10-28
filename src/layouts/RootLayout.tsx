import { Outlet } from "react-router-dom";
import TerminalAssistant from "../components/TerminalAssistant/TerminalAssistant";
import SystemOverlay from "../components/SystemOverlay/SystemOverlay";
import IntroScreen from "../components/Intro/IntroScreen";
import ScrollToTop from "../components/ScrollToTop/ScrollToTop";
import PageCurtain from "../components/PageTransition/PageCurtain";
import JarvisNavFlash from "../components/PageTransition/JarvisNavFlash";

export default function RootLayout() {
  return (
    <>
      <SystemOverlay />
      <IntroScreen/>
      <PageCurtain/>
      <JarvisNavFlash/>
      <ScrollToTop/>
      <TerminalAssistant />
      <Outlet />
    </>
  );
}
