import { useRef } from "react";
import { useLightboxAnimation } from "../../hooks/useLightboxAnimation";
import { useLightboxKeyboard } from "../../hooks/useLightBoxKeyboard";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";
import type { ProjectGalleryImageModel } from "../../models/ProjectGalleryImageModel";
import LightboxBackdrop from "./LightboxBackDrop";
import LightboxButton from "./LightboxButton";
import LightboxCounter from "./LightboxCounter";
import LightboxImage from "./LightBoxImage";
import LightboxPortal from "./LightboxPortal";
import { useLightboxImageTransition } from "../../hooks/useLightboxImageTransition";

export type LightboxProps = {
  image: ProjectGalleryImageModel | null;
  currentIndex: number;
  total: number;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
};

function Lightbox({
  image,

  currentIndex,

  total,

  onClose,

  onNext,

  onPrevious,
}: LightboxProps) {
  useLockBodyScroll(Boolean(image));

  useLightboxKeyboard({
    isOpen: Boolean(image),
    onClose,
    onNext,
    onPrevious,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useLightboxAnimation(containerRef, Boolean(image));

  const handleImageLoad = useLightboxImageTransition(imageRef);

  if (!image) {
    return null;
  }

  return (
    <LightboxPortal>
      <div ref={containerRef} className="lightbox-container">
        <LightboxBackdrop onClose={onClose}>
          <LightboxImage key={image.id} image={image} ref={imageRef} onLoad={handleImageLoad} />

          <div
            className="
          lightbox-content
                mt-10

                flex

                items-center

                justify-between

                gap-8
                "
          >
            <LightboxButton onClick={onPrevious} ariaLabel="Previous Image">
              ← Previous
            </LightboxButton>

            <LightboxCounter
              title={image.title}
              currentIndex={currentIndex}
              total={total}
            />

            <LightboxButton onClick={onNext} ariaLabel="Next Image">
              Next →
            </LightboxButton>
          </div>
        </LightboxBackdrop>
      </div>
    </LightboxPortal>
  );
}

export default Lightbox;
