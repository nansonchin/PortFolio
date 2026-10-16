import { useState } from "react";
import type { ResponsiveImage } from "../../models/ResponsiveImage";
import { isUsableImage } from "../FeaturedProjects/workUtils";

type ProjectFrameProps = {
  image: ResponsiveImage;
  alt: string;
  loading?: "eager" | "lazy";
  parallax?: boolean;
  aspect?: string;
  className?: string;
};

const corner = "pointer-events-none absolute z-10 h-3 w-3 border-gold";

function ProjectFrame({
  image,
  alt,
  loading = "lazy",
  parallax = false,
  aspect = "aspect-[16/9]",
  className = "",
}: ProjectFrameProps) {
  const [failed, setFailed] = useState(false);
  const usable = isUsableImage(image.src) && !failed;

  return (
    <div data-frame className={`relative ${className}`}>
      <div className={`relative overflow-hidden border border-line bg-ink-2 ${aspect}`}>
        {usable ? (
          <img
            src={image.src}
            srcSet={image.srcSet}
            sizes={image.sizes}
            alt={alt}
            loading={loading}
            decoding="async"
            draggable={false}
            onError={() => setFailed(true)}
            className={`h-full w-full object-cover ${parallax ? "frame-parallax scale-[1.12]" : ""}`}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="label text-gold-dim">[ NO SIGNAL ]</span>
          </div>
        )}
      </div>

      <span className={`${corner} -left-px -top-px border-l border-t`} />
      <span className={`${corner} -right-px -top-px border-r border-t`} />
      <span className={`${corner} -bottom-px -left-px border-b border-l`} />
      <span className={`${corner} -bottom-px -right-px border-b border-r`} />
    </div>
  );
}

export default ProjectFrame;