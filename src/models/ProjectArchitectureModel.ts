
export type ArchitectureNode = {
  id: string;
  title: string;
  description?: string;
  details?: string;
  children?: ArchitectureNode[];
};

export type ProjectArchitectureModel = {
  title: string;
  description: string;
  root: ArchitectureNode;
};