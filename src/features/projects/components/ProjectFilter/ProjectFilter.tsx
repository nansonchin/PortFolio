type ProjectFilterProps = {
  categories: string[];
  counts: Record<string, number>;
  activeCategory: string;
  onChange: (category: string) => void;
};

const pad = (value: number) => String(value).padStart(2, "0");

function ProjectFilter({ categories, counts, activeCategory, onChange }: ProjectFilterProps) {
  return (
    <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-3">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          aria-pressed={activeCategory === category}
          onClick={() => onChange(category)}
          className="bar-select label border border-line px-4 py-2"
        >
          {category}
          <span className="ml-2 opacity-60">{pad(counts[category] ?? 0)}</span>
        </button>
      ))}
    </div>
  );
}

export default ProjectFilter;