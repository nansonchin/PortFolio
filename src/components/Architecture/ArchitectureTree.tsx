
import { useMemo, useState } from "react";
import type {
  ArchitectureNode as ArchitectureNodeType,
  ProjectArchitectureModel,
} from "../../models/ProjectArchitectureModel";
import ArchitectureNode from "./ArchitectureNode";

type ArchitectureTreeProps = {
  architecture: ProjectArchitectureModel;
};

function findNode(
  node: ArchitectureNodeType,
  targetId: string,
): ArchitectureNodeType | null {
  if (node.id === targetId) {
    return node;
  }

  for (const child of node.children ?? []) {
    const found = findNode(child, targetId);

    if (found) {
      return found;
    }
  }

  return null;
}

function findPath(
  node: ArchitectureNodeType,
  targetId: string,
): string[] | null {
  if (node.id === targetId) {
    return [node.id];
  }

  for (const child of node.children ?? []) {
    const childPath = findPath(child, targetId);

    if (childPath) {
      return [node.id, ...childPath];
    }
  }

  return null;
}

function collectSubtreeIds(
  node: ArchitectureNodeType,
  ids: Set<string>,
) {
  ids.add(node.id);

  for (const child of node.children ?? []) {
    collectSubtreeIds(child, ids);
  }
}

function ArchitectureTree({ architecture }: ArchitectureTreeProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const selectedNode = useMemo(() => {
    if (!selectedNodeId) {
      return null;
    }

    return findNode(architecture.root, selectedNodeId);
  }, [architecture.root, selectedNodeId]);

  const relatedNodeIds = useMemo(() => {
    const ids = new Set<string>();

    if (!selectedNodeId) {
      return ids;
    }

    // Highlight the path from the root to the selected node.
    const path = findPath(architecture.root, selectedNodeId);

    path?.forEach((id) => ids.add(id));

    // Also highlight all descendants of the selected node.
    const selected = findNode(architecture.root, selectedNodeId);

    if (selected) {
      collectSubtreeIds(selected, ids);
    }

    return ids;
  }, [architecture.root, selectedNodeId]);

  function handleSelect(nodeId: string) {
    setSelectedNodeId((currentId) =>
      currentId === nodeId ? null : nodeId,
    );
  }

  const detailText =
    selectedNode?.details ??
    selectedNode?.description ??
    "No additional details are available for this module yet.";

  return (
    <div className="w-full min-w-0">
      {/* Horizontally scrollable architecture tree */}
      <div className="w-full min-w-0 overflow-x-auto overflow-y-hidden pb-8">
        <div className="flex w-max min-w-full justify-start px-6">
          <ArchitectureNode
            node={architecture.root}
            selectedNodeId={selectedNodeId}
            relatedNodeIds={relatedNodeIds}
            onSelect={handleSelect}
          />
        </div>
      </div>

      {/* Selected node details */}
      <div
        aria-live="polite"
        className="mx-6 mt-4 min-h-36 rounded-xl border border-[#D4AF37]/20 bg-[#11100D] p-5 md:p-6"
      >
        {selectedNode ? (
          <div key={selectedNode.id}>
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">
                Selected Module
              </p>

              <span className="rounded-full border border-[#D4AF37]/20 px-2 py-1 text-[9px] uppercase tracking-wider text-neutral-400">
                {selectedNodeId}
              </span>
            </div>

            <h3 className="mt-3 text-xl font-semibold text-white">
              {selectedNode.title}
            </h3>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-neutral-400">
              {detailText}
            </p>

            <button
              type="button"
              onClick={() => setSelectedNodeId(null)}
              className="mt-5 text-xs uppercase tracking-[0.18em] text-[#D4AF37] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
            >
              Clear selection
            </button>
          </div>
        ) : (
          <div className="flex min-h-24 flex-col justify-center">
            <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]">
              Explore the architecture
            </p>

            <p className="mt-3 text-sm leading-6 text-neutral-400">
              Select any node to explore its responsibilities and highlight
              its related architecture branches.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ArchitectureTree;