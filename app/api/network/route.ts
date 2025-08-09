import { NextRequest, NextResponse } from 'next/server';
import { HelenKellerActivationNetwork } from '@/src/index';

// Initialize network instance (singleton pattern)
let networkInstance: HelenKellerActivationNetwork | null = null;

async function getNetworkInstance(): Promise<HelenKellerActivationNetwork> {
  if (!networkInstance) {
    networkInstance = new HelenKellerActivationNetwork('./network-data.json');
    await networkInstance.initialize();
  }
  return networkInstance;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { command, argument } = body;

    if (!command || !argument) {
      return NextResponse.json(
        { error: 'Missing command or argument' },
        { status: 400 }
      );
    }

    const network = await getNetworkInstance();

    switch (command) {
      case 'learn':
        await network.learn(argument);
        network.saveNetwork();
        return NextResponse.json({
          message: `Learned: "${argument.substring(0, 50)}..."`,
          success: true
        });

      case 'think':
        const response = await network.think(argument);
        return NextResponse.json({
          response,
          success: true
        });

      default:
        return NextResponse.json(
          { error: `Unknown command: ${command}` },
          { status: 400 }
        );
    }
  } catch (error) {
    // Transparent error handling - no fallbacks
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('API Error:', errorMessage);

    return NextResponse.json(
      {
        error: errorMessage,
        success: false,
        stack: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const network = await getNetworkInstance();
    return NextResponse.json({
      status: 'Network initialized',
      success: true
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Network initialization failed';
    return NextResponse.json(
      { error: errorMessage, success: false },
      { status: 500 }
    );
  }
}