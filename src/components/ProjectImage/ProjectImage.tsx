import { useState, type ImgHTMLAttributes } from "react";
import ProjectImageSkeleton from "./ProjectImageSkeleton";
import ProjectImageFallback from "./ProjectImageFallback";

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
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoading(false);
    onLoad?.(event);
  };

  const handleError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoading(false);
    setHasError(true);
    onError?.(event);
  };
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
        className={`transition-opacity duration-500 ${isLoading? "opacity-0" : "opacity-100"} ${className}`}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </div>
  );
};

export default ProjectImage;
