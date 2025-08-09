export interface NodeConnection {
  weight: number;
  lastFired: number;
  plasticityRate: number;
}

export interface ActivationNode {
  id: string;
  potential: number;
  connections: Map<string, NodeConnection>;
  decay: number;
  threshold: number;
  refractoryPeriod: number;
  lastFired: number;
  embedding?: Float32Array;
  semanticContent?: string;
}

export interface ActivationParams {
  spread: number;
  threshold: number;
  decay: number;
}

export interface ActivationPattern {
  nodes: ActivationNode[];
  coherence: number;
  resonance: number;
  stability: number;
  narrative: string;
}
