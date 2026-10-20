import { setAiProvider } from "./aiProvider";
import { ProxyProvider } from "./proxyProvider";

export function setupAI() {
  
  setAiProvider(new ProxyProvider("/api/chat"));
}