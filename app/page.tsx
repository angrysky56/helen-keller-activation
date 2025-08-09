'use client';

import React, { useState, useEffect } from 'react';
import Script from 'next/script';

// TypeScript augmentation for window.networkVisualizer
declare global {
  interface Window {
    networkVisualizer?: {
      showSuccess: (msg: string) => void;
      showError: (msg: string) => void;
      updateMetrics: (metrics: { coherence: number; resonance: number; stability: number }) => void;
    };
  }
}

export default function Page() {
  const [learnText, setLearnText] = useState('');
  const [thinkText, setThinkText] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState({
    coherence: 0,
    resonance: 0,
    stability: 0
  });

  // CSS is now imported globally in layout.tsx

  const handleLearn = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/network', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: 'learn', argument: learnText }),
      });

      const data = await response.json();

      if (data.success) {
        setOutput(data.message);
        // Update visualizer if available
        if (window.networkVisualizer) {
          window.networkVisualizer.showSuccess(data.message);
        }
      } else {
        setOutput(`Error: ${data.error}`);
        if (window.networkVisualizer) {
          window.networkVisualizer.showError(data.error);
        }
      }
    } catch (error) {
      const errorMsg =
        error && typeof error === 'object' && 'message' in error
          ? `Network error: ${(error as { message: string }).message}`
          : 'Network error: Unknown error';
      setOutput(errorMsg);
      if (window.networkVisualizer) {
        window.networkVisualizer.showError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleThink = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/network', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: 'think', argument: thinkText }),
      });

      const data = await response.json();

      if (data.success) {
        setOutput(data.response);
        // Update metrics visualization
        if (data.metrics) {
          setMetrics(data.metrics);
          if (window.networkVisualizer) {
            window.networkVisualizer.updateMetrics(data.metrics);
          }
        }
      } else {
        setOutput(`Error: ${data.error}`);
        if (window.networkVisualizer) {
          window.networkVisualizer.showError(data.error);
        }
      }
    } catch (error) {
      const errorMsg =
        error && typeof error === 'object' && 'message' in error
          ? `Network error: ${(error as { message: string }).message}`
          : 'Network error: Unknown error';
      setOutput(errorMsg);
      if (window.networkVisualizer) {
        window.networkVisualizer.showError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script src="/network.js" strategy="afterInteractive" />

      <div className="network-container">
        <div className="network-header">
          <h1>Helen Keller Activation Network</h1>
          <p>A paradigm shift in AI memory architecture</p>
        </div>

        <div className="network-card">
          <h2>Learn</h2>
          <p>Teach the network new concepts through activation pathways</p>
          <textarea
            className="network-textarea"
            placeholder="Enter text for the network to learn..."
            value={learnText}
            onChange={(e) => setLearnText(e.target.value)}
            rows={4}
          />
          <button
            className={`network-button primary${loading || !learnText ? ' disabled' : ''}`}
            onClick={handleLearn}
            disabled={loading || !learnText}
          >
            {loading ? <span className="loading-spinner" /> : 'Learn'}
          </button>
        </div>

        <div className="network-card">
          <h2>Think</h2>
          <p>Query the network through activation cascades</p>
          <input
            className="network-input"
            type="text"
            placeholder="Ask the network a question..."
            value={thinkText}
            onChange={(e) => setThinkText(e.target.value)}
          />
          <button
            className={`network-button secondary${loading || !thinkText ? ' disabled' : ''}`}
            onClick={handleThink}
            disabled={loading || !thinkText}
          >
            {loading ? <span className="loading-spinner" /> : 'Think'}
          </button>
        </div>

        <div className="activation-visualizer">
          <div className="metric-card">
            <div className="metric-value" id="metric-coherence">
              {metrics.coherence.toFixed(3)}
            </div>
            <div className="metric-label">Coherence</div>
          </div>
          <div className="metric-card">
            <div className="metric-value" id="metric-resonance">
              {metrics.resonance.toFixed(3)}
            </div>
            <div className="metric-label">Resonance</div>
          </div>
          <div className="metric-card">
            <div className="metric-value" id="metric-stability">
              {metrics.stability.toFixed(3)}
            </div>
            <div className="metric-label">Stability</div>
          </div>
        </div>

        {output && (
          <div className="network-card">
            <h2>Output</h2>
            <div className="output-content">
              {output}
            </div>
            <div id="activation-path" className="activation-path"></div>
          </div>
        )}

        <div id="error-container"></div>
        <div id="success-container"></div>
      </div>
    </>
  );
}