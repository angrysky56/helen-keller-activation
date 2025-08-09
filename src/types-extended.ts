import {
  ActivationNode,
  NodeConnection,
  ActivationPattern,
  ActivationParams
} from './types.js';

/**
 * Extended type definitions for research-based improvements
 */
export interface PredictiveAlignmentConfig {
  alpha: number; // Regularization parameter for recurrent alignment
  learningRateM: number; // Learning rate for plastic connections
  learningRateW: number; // Learning rate for readout weights
  chaosThreshold: number; // Edge of chaos parameter
}

export interface LearnedEncoding {
  compressionRatio: number; // From the corrected paper: 2:1, 4:1, 8:1, 16:1
  dimensionOriginal: number;
  dimensionCompressed: number;
  encoder: Float32Array[];
  taskOptimized: boolean;
}

// Predictive alignment state tracking
interface AlignmentState {
  regularizedPrediction: Float32Array;
  feedbackSignal: Float32Array;
  alignmentError: number;
  coherenceMetric: number;
}

// Enhanced activation parameters from research
interface EnhancedActivationParams extends ActivationParams {
  edgeOfChaos: boolean; // Operating at the edge of chaos
  entropyBalance: number; // Balance between diversity and dimensionality
}