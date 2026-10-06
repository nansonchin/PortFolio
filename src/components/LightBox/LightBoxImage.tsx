import { forwardRef } from "react";
import type { ProjectGalleryImageModel } from "../../models/ProjectGalleryImageModel";

export type LightboxImageProps = {
  image: ProjectGalleryImageModel;

  onLoad?: () => void;
};

const LightboxImage = forwardRef<HTMLImageElement, LightboxImageProps>(
  ({ image, onLoad }, ref) => {
    return (
      <img
        ref={ref}
        src={image.imageUrl}
        alt={image.title}
        onLoad={onLoad}
        className="
lightbox-image
w-full
max-h-[85vh]
object-contain
rounded-2xl
"
      />
    );
  },
);

LightboxImage.displayName = "LightboxImage";

export default LightboxImage;
