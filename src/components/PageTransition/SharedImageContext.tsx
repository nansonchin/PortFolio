import { createContext, useCallback, useContext, useRef, type ReactNode } from "react";

export type SharedImageData = {
  src: string;
  rect: DOMRect;
  slug: string;
};

type SharedImageContextValue = {
  capture: (data: SharedImageData) => void;
  consume: () => SharedImageData | null;
};

const SharedImageContext = createContext<SharedImageContextValue | null>(null);

export function SharedImageProvider({ children }: { children: ReactNode }) {

  const dataRef = useRef<SharedImageData | null>(null);

  const capture = useCallback((data: SharedImageData) => {
    dataRef.current = data;
  }, []);

  const consume = useCallback((): SharedImageData | null => {
    const data = dataRef.current;
    dataRef.current = null;
    return data;
  }, []);

  return (
    <SharedImageContext.Provider value={{ capture, consume }}>
      {children}
    </SharedImageContext.Provider>
  );
}

export function useSharedImage() {
  const ctx = useContext(SharedImageContext);
  if (!ctx) throw new Error("useSharedImage must be used inside SharedImageProvider");
  return ctx;
}