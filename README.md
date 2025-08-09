# Helen Keller Activation Network

## 🧠 Meta-Cognitive Analysis: Claims vs Reality

### 🛠 Init - Honest Assessment Protocol
**Observe**: Examining grandiose claims against actual implementation
**Defer**: No defensive justification - pure technical analysis
**Integrate**: Understanding gap between marketing and mechanics
**Meta-Validate**: Does the code deliver what it promises?

## 🔎 Critical Analysis: Claims vs Implementation

### ❌ **Major Gaps Identified**

**Claim**: *"Memory is not stored and retrieved - it emerges from the activation pattern itself"*
**Reality**: Still using traditional embedding storage + cosine similarity retrieval. This is semantic search with weighted connections, not emergent memory.

**Claim**: *"Memory ARE the neural pathways themselves"*
**Reality**: Memories are still embeddings stored in nodes. Pathways are just weighted connections between traditional stored vectors.

**Claim**: *"Paradigm shift in AI memory architecture"*
**Reality**: Incremental enhancement of vector similarity search with connection weights.

### ✅ **Valid Claims**

**Claim**: *"Hebbian Learning: neurons that fire together, wire together"*
**Reality**: ✅ Actually implemented through connection strengthening in `strengthenPath()`

**Claim**: *"Dual-Process Reasoning"*
**Reality**: ⚠️ Partially valid - different activation parameters, but same LLM underneath

**Claim**: *"Zero API Fees"*
**Reality**: ✅ Valid with LM Studio local models

## 🚀 Execute - Technical Reality Check

Looking at the core architecture:

```typescript
// This is still traditional embedding storage
private async embedText(text: string): Promise<Float32Array>
private findResonantNodes(embedding: Float32Array): ActivationNode[]

// This is weighted graph traversal, not "memory emergence"
private propagateActivation(startNodes: ActivationNode[]): ActivationNode[]

// This is connection weight updates, which is good but not revolutionary
private strengthenPath(activatedPath: ActivationNode[])
```

### 📊 **Honest Assessment Score: 3/10**

- **Architecture**: Traditional vector DB with graph connections (not paradigm shift)
- **Memory**: Still store/retrieve embeddings (not emergent)
- **Learning**: Hebbian-inspired weight updates (actually novel)
- **Processing**: Parameter variants of same LLM (not dual systems)

## 🔧 **Fixing Your MCP Config**

You're right about the config format. Let me fix it to match your working pattern:Now let me create the proper TypeScript compilation setup for the MCP server:Let me update the build script to properly compile the MCP server:## 🔎 **Brutal Technical Reality Check: Claims vs Implementation**

### 📊 **Honest Assessment Score: 3.5/10 on Paradigm Claims**

**The marketing language significantly oversells what's actually implemented.**

## 🛠 **Init - Claim Analysis**

**Major Overstated Claims:**

1. **"Memory is not stored and retrieved - it emerges from the activation pattern itself"**
   - **Reality**: Still stores `Float32Array` embeddings in nodes
   - **Reality**: Still uses cosine similarity retrieval in `findResonantNodes()`
   - **Gap**: This is semantic search with weighted connections, not emergent memory

2. **"Memory ARE the neural pathways themselves"**
   - **Reality**: Memories are embeddings stored in `node.embedding`
   - **Reality**: Pathways are just weighted edges between stored vectors
   - **Gap**: Traditional vector storage with graph connections

3. **"Paradigm shift in AI memory architecture"**
   - **Reality**: Incremental enhancement of vector similarity search
   - **Gap**: No fundamental architectural breakthrough

## ✅ **What IS Actually Novel (Credit Where Due)**

1. **Hebbian Learning**: `strengthenPath()` genuinely implements "fire together, wire together"
2. **Dynamic Connection Weights**: Connections do strengthen/weaken based on usage
3. **Dual-Process Parameters**: Different activation settings for System 1/2 reasoning
4. **Local LM Studio Integration**: Zero API fees is legitimate

## 🚀 **Execute - The Technical Truth**

```typescript
// This is what's ACTUALLY happening:
async embedText() -> Float32Array        // Traditional embedding
findResonantNodes() -> cosine similarity // Traditional retrieval
propagateActivation() -> weighted graph  // Enhanced with connections
strengthenPath() -> Hebbian updates     // This part IS novel
```

**Bottom Line**: You have a **semantic search system with learnable connection weights**, not a paradigm shift. The Hebbian learning aspects are genuinely interesting, but the core architecture is still store/retrieve embeddings.

## 🔧 **Fixed Your MCP Config**

Now using proper compiled JS format like your working example:

```bash
# Build the MCP server
npm run build:mcp

# Use in Claude Desktop
cp example_mcp_config.json ~/claude_desktop_config.json
```

## 💡 **Path Forward Options**

**Option A**: Tone down the marketing claims to match reality
**Option B**: Actually implement true activation-based memory (major rewrite)
**Option C**: Embrace what you have - a good semantic search system with novel Hebbian learning

The current implementation has genuine value in the connection weight learning, but the "paradigm shift" claims are marketing hyperbole. Would you like me to help either refine the claims or enhance the implementation to better match them?

The basic plan- needs a lot of work:

## 🧠 A Paradigm Shift in AI Memory Architecture

This project implements an **activation-based memory network** where memories ARE the neural pathways themselves, not separate data to be retrieved. Inspired by Helen Keller's breakthrough moment of connecting sensory experience with symbolic meaning.

## 🔑 Key Innovation

Traditional AI: Input → Process → Query Memory → Output
This Architecture: Input → **Memory Activation IS Processing** → Output

Memory emerges from the pattern of neural activations during inference, just like biological neural networks.

## 🚀 Features

- **Zero API Fees**: Runs 100% locally using LM Studio
- **Hebbian Learning**: "Neurons that fire together, wire together"
- **Dual-Process Reasoning**: Different activation patterns for System 1 (fast/intuitive) vs System 2 (slow/deliberative)
- **Living Memory**: Network connections strengthen/weaken based on usage
- **Coherence Emergence**: Stability emerges from activation patterns, not external validation
- **MCP Integration**: Model Context Protocol support for external AI applications

![alt text](image.png)

## 📦 Installation

```bash
# Clone the repository
cd /helen-keller-activation

# Install dependencies
npm install

# Make sure LM Studio is running on localhost:1234
# Download models in LM Studio and set as you like here: src/index.ts line 34-
# - google/gemma-3n-e4b (System 1)
# - openai/gpt-oss-20b (System 2)
# - text-embedding-nomic-embed-text-v1.5@f16 (Embeddings)
```

## 🎮 Usage

### Web Interface

To run the web interface:

```bash
npm run dev
```

Then open your browser to `http://localhost:3000`.

### MCP Server (Model Context Protocol)

To use as an MCP server with Claude Desktop or other MCP clients:

```bash
# Install dependencies
npm install

# Start MCP server
npm run mcp
```

#### Claude Desktop Integration

1. Copy the example configuration:
```bash
cp example_mcp_config.json ~/claude_desktop_config.json
```

2. Edit the path in the configuration to match your installation:
```json
{
  "mcpServers": {
    "helen-keller-activation": {
      "command": "npm",
      "args": ["run", "mcp"],
      "cwd": "/your/path/to/helen-keller-activation"
    }
  }
}
```

3. Restart Claude Desktop to load the MCP server

#### Available MCP Tools

- **`learn_concept`**: Teach the network new concepts through neural pathways
- **`query_network`**: Query the network through activation cascades
- **`get_network_status`**: Get current network metrics and status

## 🏗️ Architecture

### Activation Nodes
```typescript
interface ActivationNode {
  potential: number;          // Current activation [0-1]
  connections: Map<id, {
    weight: number;           // Connection strength
    plasticityRate: number;   // Learning rate
  }>;
  decay: number;              // How fast activation fades
  threshold: number;          // Firing threshold
}
```

### Dual-Process System

**System 1 (Fast/Intuitive)**:
- High spread (0.8) - allows intuitive leaps
- Low threshold (0.3) - many associations fire
- Fast decay (0.9) - quick responses

**System 2 (Slow/Deliberative)**:
- Low spread (0.2) - focused reasoning
- High threshold (0.7) - only strong connections
- Slow decay (0.1) - sustained attention

## 🧬 How It Works

1. **Input Activation**: Text is converted to embeddings which activate resonant nodes
2. **Cascade Propagation**: Activation spreads through weighted connections
3. **Pattern Emergence**: The path of activated nodes IS the memory
4. **Hebbian Learning**: Used pathways strengthen, unused ones weaken
5. **Coherence Monitoring**: Stability of activation determines System 1 vs System 2

## 🔬 Theoretical Foundation

- **Hebbian Plasticity**: Connections strengthen between co-activated nodes
- **Competitive Learning**: Anti-Hebbian weakening of unused connections
- **Activation Cascades**: Memory recall through spreading activation
- **Distributed Representation**: Concepts are patterns, not locations

## 📊 Metrics

- **Coherence**: Strength of connections in activated path
- **Resonance**: Self-reinforcement of activation pattern
- **Stability**: Temporal consistency of activations

## 🛠️ Development

```bash
# Build TypeScript
npm run build

# Run in development mode
npm run dev

# Run tests
npm test
```

## 💡 Key Insight

The fundamental shift: **Memory is not stored and retrieved - it emerges from the activation pattern itself**. When the system "remembers" water is wet, it's not looking up a fact in a database. The concept of water activates pathways to wetness through strengthened connections. The memory IS the pathway.

## 📄 License

MIT - Because ideas, like memories, should flow freely through networks.
