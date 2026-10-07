import {
  useEffect,
  useState,
  type RefObject,
} from "react";


import {
  createCursorIdleAnimation,
} from "../animations/cursorIdleAnimation";


type UseCursorIdleProps = {
  visualRef:
    RefObject<HTMLDivElement | null>;

  idleDelay?: number;
};


export function useCursorIdle({
  visualRef,
  idleDelay = 1200,
}: UseCursorIdleProps) {

  const [
    isIdle,
    setIsIdle,
  ] = useState(false);


  useEffect(() => {

    const visual =
      visualRef.current;


    if (!visual) {
      return;
    }


    const animation =
      createCursorIdleAnimation({
        visual,
      });


    let idleTimer:
      number | undefined;


    const clearIdleTimer = () => {

      if (
        idleTimer !== undefined
      ) {

        window.clearTimeout(
          idleTimer,
        );


        idleTimer =
          undefined;

      }

    };


    const startIdleTimer = () => {

      clearIdleTimer();


      idleTimer =
        window.setTimeout(() => {

          animation.enterIdle();


          setIsIdle(true);


          idleTimer =
            undefined;

        }, idleDelay);

    };


    const handleMouseMove = () => {

      /**
       * Wake the Cursor immediately.
       */
      animation.exitIdle();


      setIsIdle(false);


      /**
       * Restart the Idle timer.
       */
      startIdleTimer();

    };


    window.addEventListener(
      "mousemove",
      handleMouseMove,
    );


    /**
     * Start initial Idle timer.
     */
    startIdleTimer();


    return () => {

      clearIdleTimer();


      window.removeEventListener(
        "mousemove",
        handleMouseMove,
      );


      animation.destroy();


      setIsIdle(false);

    };

  }, [
    visualRef,
    idleDelay,
  ]);


  return isIdle;
}