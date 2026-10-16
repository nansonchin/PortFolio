
import type { ArchitectureNode as ArchitectureNodeType } from "../../models/ProjectArchitectureModel";

type ArchitectureNodeProps = {
  node: ArchitectureNodeType;
  depth?: number;
  selectedNodeId: string | null;
  relatedNodeIds: Set<string>;
  onSelect: (nodeId: string) => void;
};

function ArchitectureNode({
  node,
  depth = 0,
  selectedNodeId,
  relatedNodeIds,
  onSelect,
}: ArchitectureNodeProps) {
  const children = node.children ?? [];
  const hasChildren = children.length > 0;
  const childDepth = depth + 1;

  const isSelected = selectedNodeId === node.id;
  const isRelated = relatedNodeIds.has(node.id);

  const nodeStyle = isSelected
    ? "border-gold bg-gold/15 shadow-[0_0_24px_rgba(201,169,110,0.18)]"
    : isRelated
      ? "border-gold/60 bg-gold/10"
      : "border-gold/25 bg-ink-2";

  return (
    <div className="flex w-max flex-col items-center">
      {/* Interactive node */}
      <button
        type="button"
        data-architecture-node
        data-architecture-depth={depth}
        aria-pressed={isSelected}
        onClick={() => onSelect(node.id)}
        className={`architecture-node group relative z-10 flex w-52 shrink-0 flex-col items-center rounded-none border px-5 py-5 text-center transition-[border-color,background-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink ${nodeStyle}`}
      >
        <div
          className={`mb-3 h-1 rounded-none transition-all duration-300 ${
            isSelected
              ? "w-12 bg-gold"
              : "w-8 bg-gold/70 group-hover:w-12 group-hover:bg-gold"
          }`}
        />

        <span className="text-sm font-semibold tracking-wide text-neutral-100">
          {node.title}
        </span>

        {node.description && (
          <span className="mt-2 text-xs leading-5 text-neutral-400">
            {node.description}
          </span>
        )}

        <span className="mt-3 text-[9px] uppercase tracking-[0.2em] text-gold/70">
          {isSelected ? "Selected" : "Explore module"}
        </span>
      </button>

      {/* Child branches */}
      {hasChildren && (
        <div className="flex flex-col items-center">
          {/* Vertical connector from current node */}
          <div
            data-architecture-line="vertical"
            data-architecture-depth={childDepth}
            aria-hidden="true"
            className={`h-10 w-px shrink-0 transition-colors duration-300 ${
              isRelated ? "bg-gold" : "bg-gold/50"
            }`}
          />

          <div className="flex w-max items-start justify-center">
            {children.map((child, index) => {
              const isFirst = index === 0;
              const isLast = index === children.length - 1;
              const hasMultipleChildren = children.length > 1;
              const isChildRelated = relatedNodeIds.has(child.id);

              const lineStyle = isChildRelated
                ? "bg-gold"
                : "bg-gold/50";

              return (
                <div
                  key={child.id}
                  className="relative flex w-max shrink-0 flex-col items-center px-5 pt-8"
                >
                  {/* Horizontal connector */}
                  {hasMultipleChildren && (
                    <div
                      data-architecture-line="horizontal"
                      data-architecture-depth={childDepth}
                      aria-hidden="true"
                      className={`absolute top-0 h-px transition-colors duration-300 ${lineStyle} ${
                        isFirst
                          ? "left-1/2 right-0"
                          : isLast
                            ? "left-0 right-1/2"
                            : "left-0 right-0"
                      }`}
                    />
                  )}

                  {/* Vertical connector into child */}
                  <div
                    data-architecture-line="vertical"
                    data-architecture-depth={childDepth}
                    aria-hidden="true"
                    className={`absolute left-1/2 top-0 h-8 w-px -translate-x-1/2 transition-colors duration-300 ${lineStyle}`}
                  />

                  <ArchitectureNode
                    node={child}
                    depth={childDepth}
                    selectedNodeId={selectedNodeId}
                    relatedNodeIds={relatedNodeIds}
                    onSelect={onSelect}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default ArchitectureNode;