import type { ProjectDetailModel } from "../../models/ProjectDetailModel";
import type { ProjectGalleryImageModel } from "../../models/ProjectGalleryImageModel";
import { useLightbox } from "../../hooks/useLightbox";
import Lightbox from "../LightBox/Lightbox";
import ProjectFrame from "./ProjectFrame";
import SectionLabel from "../SectionLabel/SectionLabel";

type ProjectGalleryProps = {
  index: string;
  project: ProjectDetailModel;
};

const pad = (value: number) => String(value).padStart(2, "0");
const toFrameUrl = (url: string) => url.replace(/\.webp$/i, "-frame.webp");

function ProjectGallery({ index, project }: ProjectGalleryProps) {
  const { selectedItem, currentIndex, total, open, close, next, previous } =
    useLightbox<ProjectGalleryImageModel>();

  return (
    <section className="border-t border-line px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div data-reveal className="mb-12 md:mb-20">
          <SectionLabel index={index} text="GALLERY" className="mb-8" />
          <h2 className="heading-lg text-paper">Project showcase</h2>
        </div>

        <div className="space-y-20 md:space-y-28">
          {project.gallery.map((image, i) => {
            const even = i % 2 === 0;

            return (
              <article
                key={image.id}
                data-reveal
                className="grid items-end gap-6 lg:grid-cols-12 lg:gap-10"
              >
                <button
                  type="button"
                  data-cursor="view"
                  onClick={() => open(project.gallery, i)}
                  aria-label={`Open ${image.title}`}
                  className={`block text-left lg:col-span-8 ${even ? "" : "lg:order-2"}`}
                >
                  <ProjectFrame
                    image={{ src: toFrameUrl(image.imageUrl) }}
                    alt={image.title}
                    parallax
                  />
                </button>

                <div className={`lg:col-span-4 ${even ? "" : "lg:order-1"}`}>
                  <p className="label text-gold">[ FIG.{pad(i + 1)} ]</p>
                  <h3 className="mt-3 font-display text-3xl uppercase text-paper md:text-4xl">
                    {image.title}
                  </h3>
                  <p className="text-body mt-4">{image.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <Lightbox
        image={selectedItem}
        currentIndex={currentIndex}
        total={total}
        onNext={next}
        onPrevious={previous}
        onClose={close}
      />
    </section>
  );
}

export default ProjectGallery;
