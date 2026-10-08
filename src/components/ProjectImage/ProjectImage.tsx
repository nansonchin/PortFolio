import { useState, type ImgHTMLAttributes } from "react";
import ProjectImageSkeleton from "./ProjectImageSkeleton";
import ProjectImageFallback from "./ProjectImageFallback";
import { useImageLoader } from "../../hooks/useImageLoader";
import type { ResponsiveImage } from "../../models/ResponsiveImage";

export type ProjectImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  src?: string;
  image?:ResponsiveImage
  alt: string;
};

const ProjectImage = ({
  src:legacySrc,
  alt,
  image,
  className = "",
  onLoad,
  onError,
  ...props
}: ProjectImageProps) => {
  const resolvedImage:ResponsiveImage = image ?? {
    src:legacySrc??""
  }

  const {src,srcSet,sizes,} = resolvedImage;

  const { isLoading, isLoaded, hasError, handleLoad, handleError } =
    useImageLoader({ onLoad, onError });

  return (
    <div className="relative overflow-hidden">
      {isLoading && <ProjectImageSkeleton />}
      {hasError && <ProjectImageFallback />}
      <img
        src={src}
        alt={alt}
        srcSet={srcSet}
        sizes={sizes}
        loading="lazy"
        decoding="async"
        draggable={false}
        className={`transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"} ${className}`}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </div>
  );
};

export default ProjectImage;
