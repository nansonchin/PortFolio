import { lightboxImageIn } from "../animations/lightboxImageTransition";

export function useLightboxImageTransition(
  imageRef: React.RefObject<HTMLImageElement | null>,
) {
  function handleImageLoad() {
    if (!imageRef.current) {
      return;
    }

    lightboxImageIn({
      element: imageRef.current,
    });
  }

  return handleImageLoad;
}
