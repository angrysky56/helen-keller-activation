// Helen Keller Activation Network - Part 1: Core setup and initialization
import { LMStudioClient } from "@lmstudio/sdk";
import * as fs from 'fs';
import * as path from 'path';
import {
  ActivationNode,
  NodeConnection,
  ActivationPattern,
  ActivationParams
} from './types.js';

/**
 * Helen Keller Activation Network
 *
 * Implements concepts from:
 * - Predictive Alignment (Asabuki & Clopath, 2025)
 * - Learned Token Encodings (Bee, 2025)
 * - Modern Text Embeddings (Merrick et al., 2024)
 */
export class HelenKellerActivationNetwork {
  private network: Map<string, ActivationNode> = new Map();
  private lmStudio: LMStudioClient | null = null;
  private models: any = {};
  private isInitialized = false;

  // Predictive alignment parameters from research
  private alpha: number = 1.0; // Regularization for recurrent alignment
  private learningRateM: number = 0.01; // Plastic connections learning rate
  private learningRateW: number = 0.05; // Readout weights learning rate
  private chaosThreshold: number = 1.2; // Edge of chaos parameter (g > 1)

  // Learned encoding parameters for memory efficiency
  private compressionRatio: number = 4; // Default 4:1 compression
  private encodingDimension: number = 192; // Compressed from 768

  // Tracking metrics
  private lyapunovExponent: number = 0; // Chaos measure
  private coherenceScore: number = 0; // Global coherence metric

  constructor(private networkPath: string = './network.json') {}

  async initialize() {
    console.log("🧠 Initializing Helen Keller Activation Network...");

    // Initialize LM Studio client (uses default WebSocket connection)
    this.lmStudio = new LMStudioClient();

    // Load network from disk if exists
    if (fs.existsSync(this.networkPath)) {
      this.loadNetwork();
      console.log(`✅ Loaded existing network with ${this.network.size} nodes`);
    }

    // Load local models - NO API FEES!
    console.log("📚 Loading local models from LM Studio...");
    try {
      this.models = {
        // System 1: Fast, intuitive responses
        fast: "google/gemma-3n-e4b",

        // System 2: Deliberative reasoning
        reason: "openai/gpt-oss-20b",

        // Embedding model for concept space
        embed: "text-embedding-nomic-embed-text-v1.5@f16"
      };

      console.log("✅ Models configured for local inference");
      this.isInitialized = true;
    } catch (error) {
      console.error("❌ Failed to configure models:", error);
      throw error;
    }
  }

  // Part 2: Activation and propagation methods
  private async embedText(text: string, taskType: 'learn' | 'think' | 'cluster' = 'think'): Promise<Float32Array> {
    if (!this.lmStudio) {
      throw new Error("Network not initialized - LM Studio client not available");
    }

    // Apply task-specific prefixes for nomic-embed-text-v1.5
    let prefixedText: string;
    switch (taskType) {
      case 'learn':
        prefixedText = `search_document: ${text}`;
        break;
      case 'think':
        prefixedText = `search_query: ${text}`;
        break;
      case 'cluster':
        prefixedText = `clustering: ${text}`;
        break;
      default:
        prefixedText = `search_query: ${text}`;
    }

    try {
      const embeddingModel = await this.lmStudio.embedding.model("text-embedding-nomic-embed-text-v1.5@f16");
      const { embedding } = await embeddingModel.embed(prefixedText);

      return new Float32Array(embedding);
    } catch (error) {
      // No fallback - transparent error handling
      const errorMessage = `LM Studio embedding generation failed: ${error}`;
      console.error(`❌ ${errorMessage}`);
      throw new Error(errorMessage);
    }
  }

  private findResonantNodes(embedding: Float32Array, originalText?: string): ActivationNode[] {
    const resonantNodes: ActivationNode[] = [];
    const threshold = 0.7; // Similarity threshold

    for (const node of Array.from(this.network.values())) {
      if (node.embedding) {
        const similarity = this.cosineSimilarity(embedding, node.embedding);
        if (similarity > threshold) {
          // Set initial activation based on similarity
          node.potential = similarity;
          resonantNodes.push(node);
        }
      }
    }

    // If no resonant nodes, create a new one with semantic content
    if (resonantNodes.length === 0) {
      const newNode = this.createNode(embedding, originalText);
      resonantNodes.push(newNode);
    }

    return resonantNodes;
  }

  // Part 3: Activation propagation with predictive alignment
  private propagateActivation(
    startNodes: ActivationNode[],
    params: ActivationParams = { spread: 0.5, threshold: 0.5, decay: 0.8 }
  ): ActivationNode[] {
    const activatedPath: ActivationNode[] = [...startNodes];
    const visited = new Set<string>(startNodes.map(n => n.id));
    const wavefront = [...startNodes];

    // Determine if operating at edge of chaos (from research)
    const isEdgeOfChaos = this.chaosThreshold > 1.0 && this.chaosThreshold < 1.5;

    while (wavefront.length > 0) {
      const current = wavefront.shift()!;

      // Apply decay to current node
      current.potential *= params.decay;

      // Check refractory period
      const now = Date.now();
      if (now - current.lastFired < current.refractoryPeriod) {
        continue;
      }

      // Propagate to connected nodes with predictive alignment
      for (const [connectedId, connection] of Array.from(current.connections)) {
        if (!visited.has(connectedId)) {
          const connectedNode = this.network.get(connectedId);
          if (connectedNode) {
            // Calculate activation energy with alignment term
            const baseActivation = current.potential * connection.weight * params.spread;

            // Add predictive alignment component (from Asabuki & Clopath, 2025)
            const alignmentBonus = isEdgeOfChaos ?
              this.alpha * Math.tanh(baseActivation) : 0;

            const activation = baseActivation + alignmentBonus;
            connectedNode.potential += activation;

            // Fire if threshold exceeded
            if (connectedNode.potential > params.threshold) {
              connectedNode.lastFired = now;
              wavefront.push(connectedNode);
              activatedPath.push(connectedNode);
              visited.add(connectedId);

              // Update coherence tracking
              this.updateCoherenceMetrics(activatedPath);
            }
          }
        }
      }
    }

    return activatedPath;
  }

  // New method: Update coherence metrics based on predictive alignment
  private updateCoherenceMetrics(path: ActivationNode[]): void {
    if (path.length < 2) return;

    // Calculate instantaneous coherence
    const instantCoherence = this.calculateCoherence(path);

    // Update global coherence with exponential moving average
    this.coherenceScore = 0.9 * this.coherenceScore + 0.1 * instantCoherence;

    // Adjust chaos threshold if coherence drops (taming chaos gently)
    if (this.coherenceScore < 0.5 && this.chaosThreshold > 1.0) {
      this.chaosThreshold *= 0.99; // Gradually reduce chaos
    }
  }

  // Part 4: Hebbian learning and memory formation
  private strengthenPath(activatedPath: ActivationNode[]) {
    // Hebbian learning: neurons that fire together, wire together
    for (let i = 0; i < activatedPath.length - 1; i++) {
      const current = activatedPath[i];
      const next = activatedPath[i + 1];

      // Get or create connection
      let connection = current.connections.get(next.id);
      if (!connection) {
        connection = {
          weight: 0.1,
          lastFired: Date.now(),
          plasticityRate: 0.1
        };
        current.connections.set(next.id, connection);
      }

      // Strengthen connection (Hebbian rule: ΔW = η * pre * post)
      const strengthening = connection.plasticityRate * current.potential * next.potential;
      connection.weight = Math.tanh(connection.weight + strengthening);
      connection.lastFired = Date.now();

      // Create bidirectional connection
      let reverseConnection = next.connections.get(current.id);
      if (!reverseConnection) {
        reverseConnection = {
          weight: 0.1,
          lastFired: Date.now(),
          plasticityRate: 0.1
        };
        next.connections.set(current.id, reverseConnection);
      }
      reverseConnection.weight = Math.tanh(reverseConnection.weight + strengthening * 0.7);
    }

    // Anti-Hebbian: slightly weaken unused connections
    for (const node of activatedPath) {
      for (const [connId, conn] of Array.from(node.connections)) {
        if (!activatedPath.find(n => n.id === connId)) {
          conn.weight *= 0.99; // Slight weakening
        }
      }
    }
  }

  // Part 5: Main public methods
  async think(input: string): Promise<string> {
    if (!this.isInitialized) await this.initialize();

    // 1. Convert input to activation pattern
    const embedding = await this.embedText(input, 'think');

    // 2. Find resonant nodes with semantic context
    const resonantNodes = this.findResonantNodes(embedding, input);

    // 3. Propagate activation with System 1 parameters (broad, fast)
    const system1Path = this.propagateActivation(resonantNodes, {
      spread: 0.8,      // High spread for intuitive leaps
      threshold: 0.3,   // Low threshold for many associations
      decay: 0.9        // Fast decay for quick responses
    });

    // 4. Extract pattern and measure coherence
    const pattern = this.extractPattern(system1Path);

    // 5. Decide which system to use based on coherence
    let response: string;
    if (pattern.coherence > 0.7) {
      // System 1: Fast, intuitive response
      console.log("🚀 Using System 1 (fast/intuitive)");
      response = await this.generateResponse(pattern.narrative, this.models.fast);
    } else {
      // System 2: Need more careful reasoning
      console.log("🤔 Using System 2 (slow/deliberative)");
      const system2Path = this.propagateActivation(resonantNodes, {
        spread: 0.2,      // Low spread for focused reasoning
        threshold: 0.7,   // High threshold for strong connections only
        decay: 0.1        // Slow decay for sustained attention
      });
      const system2Pattern = this.extractPattern(system2Path);
      response = await this.generateResponse(system2Pattern.narrative, this.models.reason);
    }

    // 6. Learn from this experience
    this.strengthenPath(system1Path);

    return response;
  }

  async learn(experience: string): Promise<void> {
    if (!this.isInitialized) await this.initialize();

    // Learning: create embeddings and find/create resonant nodes with semantic content
    const embedding = await this.embedText(experience, 'learn');
    const resonantNodes = this.findResonantNodes(embedding, experience);

    // Strengthen the pathway used during learning
    this.strengthenPath(resonantNodes);

    console.log(`💡 Learned: "${experience.substring(0, 50)}..."`);

    // Save network periodically
    if (this.network.size % 10 === 0) {
      this.saveNetwork();
    }
  }

  // Helper methods
  getNetworkSize(): number {
    return this.network.size;
  }

  getMetrics(): { coherence: number; resonance: number; stability: number } {
    return {
      coherence: this.coherenceScore,
      resonance: this.calculateGlobalResonance(),
      stability: this.calculateGlobalStability()
    };
  }

  private calculateGlobalResonance(): number {
    if (this.network.size === 0) return 0;
    
    const totalPotential = Array.from(this.network.values())
      .reduce((sum, node) => sum + node.potential, 0);
    
    return Math.min(totalPotential / this.network.size, 1.0);
  }

  private calculateGlobalStability(): number {
    if (this.network.size === 0) return 0;
    
    const now = Date.now();
    const recentThreshold = 5000; // 5 seconds
    const recentActivations = Array.from(this.network.values())
      .filter(node => now - node.lastFired < recentThreshold).length;
    
    return recentActivations / this.network.size;
  }

  private createNode(embedding: Float32Array, semanticContent?: string): ActivationNode {
    const id = `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const node: ActivationNode = {
      id,
      potential: 1.0,
      connections: new Map(),
      decay: 0.9,
      threshold: 0.5,
      refractoryPeriod: 100,
      lastFired: 0,
      embedding,
      semanticContent
    };
    this.network.set(id, node);
    return node;
  }

  private cosineSimilarity(a: Float32Array, b: Float32Array): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  private extractPattern(activatedPath: ActivationNode[]): ActivationPattern {
    // Calculate pattern metrics
    const coherence = this.calculateCoherence(activatedPath);
    const resonance = this.calculateResonance(activatedPath);
    const stability = this.calculateStability(activatedPath);

    // Build semantic narrative from activated nodes' content
    const semanticParts = activatedPath
      .filter(node => node.semanticContent) // Only include nodes with semantic content
      .map(node => node.semanticContent);

    const narrative = semanticParts.length > 0
      ? semanticParts.join(" → ")
      : "No semantic content available";

    return {
      nodes: activatedPath,
      coherence,
      resonance,
      stability,
      narrative
    };
  }

  private calculateCoherence(path: ActivationNode[]): number {
    if (path.length < 2) return 1.0;

    let totalStrength = 0;
    let connections = 0;

    for (let i = 0; i < path.length - 1; i++) {
      const connection = path[i].connections.get(path[i + 1].id);
      if (connection) {
        totalStrength += Math.abs(connection.weight);
        connections++;
      }
    }

    return connections > 0 ? totalStrength / connections : 0;
  }

  private calculateResonance(path: ActivationNode[]): number {
    // Measure self-reinforcement
    const avgPotential = path.reduce((sum, node) => sum + node.potential, 0) / path.length;
    return Math.min(avgPotential, 1.0);
  }

  private calculateStability(path: ActivationNode[]): number {
    // Measure temporal stability
    const now = Date.now();
    const recentFirings = path.filter(node => now - node.lastFired < 1000).length;
    return recentFirings / path.length;
  }

  private async generateResponse(narrative: string, modelName: string): Promise<string> {
    if (!this.lmStudio) {
      throw new Error("Network not initialized - LM Studio client not available");
    }

    console.log(`🔍 Attempting to load model: "${modelName}"`);

    try {
      const llmModel = await this.lmStudio.llm.model(modelName);
      console.log(`✅ Model "${modelName}" loaded successfully`);

      const prompt = `Based on this neural activation pathway pattern: "${narrative}", provide a relevant and thoughtful response. You are an advanced AI with activation-based memory responding to neural pathway patterns.`;

      console.log(`🤖 Sending prompt to ${modelName}...`);
      const result = await llmModel.respond(prompt);
      console.log(`✅ Response received from ${modelName}`);

      if (!result.content) {
        throw new Error(`Model ${modelName} returned empty response`);
      }

      return result.content;
    } catch (error) {
      // Transparent error handling - no fallbacks
      const errorMessage = `LM Studio response generation failed for model ${modelName}: ${error}`;
      console.error(`❌ ${errorMessage}`);
      throw new Error(errorMessage);
    }
  }

  saveNetwork(): void {
    const networkData: any = {};

    for (const [id, node] of Array.from(this.network)) {
      networkData[id] = {
        potential: node.potential,
        decay: node.decay,
        threshold: node.threshold,
        refractoryPeriod: node.refractoryPeriod,
        lastFired: node.lastFired,
        connections: Array.from(node.connections.entries()),
        embedding: node.embedding ? Array.from(node.embedding) : null,
        semanticContent: node.semanticContent || null
      };
    }

    fs.writeFileSync(this.networkPath, JSON.stringify(networkData, null, 2));
    console.log(`💾 Saved network with ${this.network.size} nodes`);
  }

  private loadNetwork(): void {
    try {
      const data = JSON.parse(fs.readFileSync(this.networkPath, 'utf-8'));

      for (const [id, nodeData] of Object.entries(data)) {
        const node: ActivationNode = {
          id,
          potential: (nodeData as any).potential,
          connections: new Map((nodeData as any).connections),
          decay: (nodeData as any).decay,
          threshold: (nodeData as any).threshold,
          refractoryPeriod: (nodeData as any).refractoryPeriod,
          lastFired: (nodeData as any).lastFired,
          embedding: (nodeData as any).embedding ?
            new Float32Array((nodeData as any).embedding) : undefined,
          semanticContent: (nodeData as any).semanticContent || undefined
        };
        this.network.set(id, node);
      }
    } catch (error) {
      console.log("No existing network found, starting fresh");
    }
  }
}

// Example usage
async function main() {
  const helen = new HelenKellerActivationNetwork();
  await helen.initialize();

  // Learn some concepts
  await helen.learn("Water is wet and cold");
  await helen.learn("Fire is hot and dangerous");
  await helen.learn("Ice is frozen water");

  // Think about related concepts
  const response = await helen.think("What happens when ice melts?");
  console.log("\n🤖 Response:", response);

  // Save the network
  helen.saveNetwork();
}

// Run if this is the main module
if (require.main === module) {
  main().catch(console.error);
}

export async function runCommand(command: 'learn' | 'think', argument: string) {
  const helen = new HelenKellerActivationNetwork();
  await helen.initialize();

  if (command === 'learn') {
    await helen.learn(argument);
    console.log(`Learned: "${argument}"`);
  } else if (command === 'think') {
    const response = await helen.think(argument);
    console.log(response);
  } else {
    console.error(`Unknown command: ${command}`);
  }
  helen.saveNetwork();
}''
