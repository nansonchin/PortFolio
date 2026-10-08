type ProjectFilterProps = {
  categories: string[];
  activeCategory: string;
  onChange: (category: string) => void;
};


function ProjectFilter({
  categories,
  activeCategory,
  onChange,
}: ProjectFilterProps) {


  return (
    <div
      className="
      flex
      flex-wrap
      gap-4
      "
    >

      {
        categories.map((category)=>(
          <button
            key={category}
            onClick={()=>onChange(category)}
            className={`
              px-6
              py-3
              rounded-full
              text-sm
              uppercase
              tracking-[0.2em]
              transition-all
              duration-300

              ${
                activeCategory === category
                ?
                `
                bg-yellow-400
                text-black
                `
                :
                `
                bg-white/10
                text-neutral-400
                hover:bg-white/20
                hover:text-white
                `
              }

            `}
          >

            {category}

          </button>
        ))
      }

    </div>
  );
}


export default ProjectFilter;