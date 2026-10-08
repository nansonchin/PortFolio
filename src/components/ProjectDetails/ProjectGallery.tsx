import { useLayoutEffect, useRef } from "react";
import type { ProjectDetailModel } from "../../models/ProjectDetailModel";
import { projectGalleryAnimation } from "../../animations/projectGalleryAnimation";
import { useLightbox } from "../../hooks/useLightbox";
import type { ProjectGalleryImageModel } from "../../models/ProjectGalleryImageModel";
import Lightbox from "../LightBox/Lightbox";
import ProjectImage from "../ProjectImage";

type ProjectGalleryProps = {
  project: ProjectDetailModel;
};

function ProjectGallery({ project }: ProjectGalleryProps) {
  const sectionRef = useRef<HTMLElement | null>(null);

  const { selectedItem,currentIndex,total, open,close,next,previous} =  useLightbox<ProjectGalleryImageModel>()

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const ctx = projectGalleryAnimation({
      container: section,
    });

    return () => ctx.revert();
  }, []);
  return (
    <section ref={sectionRef} className="bg-black px-8 md:px-16 py-32">
      <div className="max-w-7xl mx-auto">
        <div className="gallery-header">
          <p className="uppercase tracking-[0.5em] text-yellow-400 text-sm">
            Gallery
          </p>
          <h2 className="mt-8 text-5xl md:text-7xl font-bold text-white">
            Project Showcase
          </h2>
        </div>
        <div className="mt-24 space-y-24">
          {project.gallery.map((image,index) => (
            <article
              key={image.id}
              className="gallery-item grid lg:grid-cols-2 gap-12 items-center"
            >
              <div className="overflow-hidden rounded-3xl border border-white/10">
                <ProjectImage
                  src={image.imageUrl}
                  alt={image.title}
                  className="gallery-image cursor-pointer w-full h-auto object-cover"
                  loading="lazy"
                  onClick={()=>open(
                    project.gallery,
                    index
                  )}
                />
              </div>
              <div>
                <h3 className="text-4xl font-semibold text-white">
                  {image.title}
                </h3>
                <p className="mt-6 text-neutral-400 leading-relaxed text-lg">
                  {image.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
      <Lightbox image={selectedItem} currentIndex={currentIndex} total={total} onNext={next} onPrevious={previous} onClose={close}/>
    </section>
  );
}

export default ProjectGallery;
