import type { ArchitectureNode as ArchitecctureNodeType } from "../../models/ProjectArchitectureModel";

type ArchitectureNodeProps = {
  node: ArchitecctureNodeType;
};

function ArchitectureNode({ node }: ArchitectureNodeProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="architecture-node rounded-xl border border-white/10 bg-white/5 px-6 py-4 text-center backdrop-blur">
        <h3 className="text-white font-semibold">{node.title}</h3>
        {node.description && (
          <p className="mt-2 text-sm text-neutral-400">{node.description}</p>
        )}
      </div>
      {
        node.children && node.children.length > 0 && (
            <div className="mt-8 flex gap-8">
                {
                    node.children.map(
                        child=> <ArchitectureNode key={child.id} node={child}/>
                    )
                }
            </div>
        )
      }
    </div>
  );
}

export default ArchitectureNode