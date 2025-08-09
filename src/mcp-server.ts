#!/usr/bin/env tsx

/**
 * Helen Keller Activation Network - MCP Server
 * 
 * Provides MCP tools to interface with the neural activation network
 * Enables learn/think functionality through Model Context Protocol
 * 
 * Following zero-duplication principle: Enhances existing HelenKellerActivationNetwork
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool
} from '@modelcontextprotocol/sdk/types.js';
import { HelenKellerActivationNetwork } from './index.js';
import * as path from 'path';

// Initialize network instance (singleton pattern - same as API route)
let networkInstance: HelenKellerActivationNetwork | null = null;

async function getNetworkInstance(): Promise<HelenKellerActivationNetwork> {
  if (!networkInstance) {
    // Use same network data file as web interface for consistency
    const networkPath = path.join(process.cwd(), 'network-data.json');
    networkInstance = new HelenKellerActivationNetwork(networkPath);
    await networkInstance.initialize();
  }
  return networkInstance;
}

// Create MCP server
const server = new Server(
  {
    name: 'helen-keller-activation',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define available tools
const TOOLS: Tool[] = [
  {
    name: 'learn_concept',
    description: 'Teach the Helen Keller activation network a new concept through neural pathways. The network will create and strengthen connections based on the semantic content.',
    inputSchema: {
      type: 'object',
      properties: {
        text: {
          type: 'string',
          description: 'The concept or information for the network to learn through activation pathways',
        },
      },
      required: ['text'],
    },
  },
  {
    name: 'query_network',
    description: 'Query the Helen Keller activation network through activation cascades. The network will use either System 1 (fast/intuitive) or System 2 (slow/deliberative) processing based on activation coherence.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'The question or query to ask the activation network',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_network_status',
    description: 'Get the current status and metrics of the Helen Keller activation network, including coherence, resonance, and stability measurements.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
];

// Tool handlers
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: TOOLS };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    const network = await getNetworkInstance();

    switch (name) {
      case 'learn_concept': {
        const { text } = args as { text: string };
        
        if (!text || typeof text !== 'string') {
          throw new Error('Text parameter is required and must be a string');
        }

        await network.learn(text);
        network.saveNetwork();

        return {
          content: [
            {
              type: 'text',
              text: `✅ Successfully learned concept: "${text.substring(0, 100)}${text.length > 100 ? '...' : ''}"\n\nThe neural activation network has processed this information and strengthened relevant pathways. The concept is now integrated into the network's memory through Hebbian learning principles.`,
            },
          ],
        };
      }

      case 'query_network': {
        const { query } = args as { query: string };
        
        if (!query || typeof query !== 'string') {
          throw new Error('Query parameter is required and must be a string');
        }

        const response = await network.think(query);

        return {
          content: [
            {
              type: 'text',
              text: `🧠 Neural Activation Response:\n\n${response}\n\n---\n*This response emerged from activation patterns in the Helen Keller network, where memory IS the pathway itself.*`,
            },
          ],
        };
      }

      case 'get_network_status': {
        // Get network statistics
        const networkSize = network.getNetworkSize();
        const metrics = network.getMetrics();

        return {
          content: [
            {
              type: 'text',
              text: `📊 Helen Keller Activation Network Status:\n\n**Network Size**: ${networkSize} nodes\n**Coherence**: ${metrics.coherence.toFixed(3)}\n**Resonance**: ${metrics.resonance.toFixed(3)}\n**Stability**: ${metrics.stability.toFixed(3)}\n\n**Memory Architecture**: Activation-based memory where memories ARE the neural pathways themselves\n**Processing**: Dual-process reasoning (System 1: fast/intuitive, System 2: slow/deliberative)\n**Learning**: Hebbian plasticity - "neurons that fire together, wire together"`,
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    // Transparent error handling - no fallbacks
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error(`❌ MCP Tool Error [${name}]:`, errorMessage);
    
    return {
      content: [
        {
          type: 'text',
          text: `❌ Error: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  
  try {
    console.error('🧠 Starting Helen Keller Activation Network MCP Server...');
    await server.connect(transport);
    console.error('✅ Helen Keller MCP Server running on stdio');
  } catch (error) {
    console.error('❌ Failed to start MCP server:', error);
    process.exit(1);
  }
}

// Handle shutdown gracefully
process.on('SIGINT', async () => {
  console.error('🛑 Shutting down Helen Keller MCP Server...');
  if (networkInstance) {
    networkInstance.saveNetwork();
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.error('🛑 Shutting down Helen Keller MCP Server...');
  if (networkInstance) {
    networkInstance.saveNetwork();
  }
  process.exit(0);
});

if (require.main === module) {
  main().catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}
