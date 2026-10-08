import { useState, type ImgHTMLAttributes } from "react";
import ProjectImageSkeleton from "./ProjectImageSkeleton";
import ProjectImageFallback from "./ProjectImageFallback";
import { useImageLoader } from "../../hooks/useImageLoader";

export type ProjectImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
};

const ProjectImage = ({
  src,
  alt,
  className = "",
  onLoad,
  onError,
  ...props
}: ProjectImageProps) => {
  
  const {isLoading, isLoaded, hasError, handleLoad,handleError} = useImageLoader({onLoad,onError})

  return (
    <div className="relative overflow-hidden">
      {isLoading && <ProjectImageSkeleton />}
      {hasError && <ProjectImageFallback />}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        draggable={false}
        className={`transition-opacity duration-500 ${isLoaded? "opacity-0" : "opacity-100"} ${className}`}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </div>
  );
};

export default ProjectImage;
