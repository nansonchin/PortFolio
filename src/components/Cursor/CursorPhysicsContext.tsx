import { createContext, useContext, useMemo, useRef, type ReactNode } from "react";

type Point = { x: number; y: number };

type CursorPhysicsContextType = {
  setMousePosition: (x: number, y: number) => void;
  setOffset: (x: number, y: number) => void;
  getMousePosition: () => Point; 
  getPosition: () => Point;        
  subscribe: (callback: () => void) => () => void;
};

const CursorPhysicsContext = createContext<CursorPhysicsContextType | null>(null);

export function CursorPhysicsProvider({ children }: { children: ReactNode }) {
  const mouse = useRef<Point>({ x: 0, y: 0 });
  const offset = useRef<Point>({ x: 0, y: 0 });
  const listeners = useRef<Set<() => void>>(new Set());

  const api = useMemo<CursorPhysicsContextType>(() => {
    const notify = () => {
      listeners.current.forEach((callback) => callback());
    };

    return {
      setMousePosition(x, y) {
        mouse.current.x = x;
        mouse.current.y = y;
        notify();
      },
      setOffset(x, y) {
        offset.current.x = x;
        offset.current.y = y;
        notify();
      },
      getMousePosition() {
        return { x: mouse.current.x, y: mouse.current.y };
      },
      getPosition() {
        return {
          x: mouse.current.x + offset.current.x,
          y: mouse.current.y + offset.current.y,
        };
      },
      subscribe(callback) {
        listeners.current.add(callback);
        return () => {
          listeners.current.delete(callback);
        };
      },
    };
  }, []);

  return (
    <CursorPhysicsContext.Provider value={api}>
      {children}
    </CursorPhysicsContext.Provider>
  );
}

export function useCursorPhysics() {
  const context = useContext(CursorPhysicsContext);
  if (!context) {
    throw new Error("useCursorPhysics must be used inside CursorPhysicsProvider");
  }
  return context;
}