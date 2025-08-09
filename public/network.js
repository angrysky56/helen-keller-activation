/**
 * Helen Keller Activation Network - Client-side interactions
 */

class NetworkVisualizer {
  constructor() {
    this.metrics = {
      coherence: 0,
      resonance: 0,
      stability: 0
    };
    this.activationPath = [];
  }

  /**
   * Update metrics display with animation
   */
  updateMetrics(newMetrics) {
    Object.keys(newMetrics).forEach(key => {
      if (this.metrics[key] !== undefined) {
        this.animateValue(key, this.metrics[key], newMetrics[key], 500);
        this.metrics[key] = newMetrics[key];
      }
    });
  }

  /**
   * Animate numeric value changes
   */
  animateValue(id, start, end, duration) {
    const element = document.getElementById(`metric-${id}`);
    if (!element) return;

    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
        clearInterval(timer);
        current = end;
      }
      element.textContent = current.toFixed(3);
    }, 16);
  }

  /**
   * Display activation path visualization
   */
  displayActivationPath(path) {
    const container = document.getElementById('activation-path');
    if (!container) return;

    container.innerHTML = '';
    path.forEach((node, index) => {
      const nodeElement = document.createElement('div');
      nodeElement.className = 'activation-node';
      nodeElement.textContent = node.semanticContent || `Node ${index}`;
      
      if (index < path.length - 1) {
        const arrow = document.createElement('span');
        arrow.textContent = ' → ';
        arrow.style.margin = '0 0.5rem';
        container.appendChild(nodeElement);
        container.appendChild(arrow);
      } else {
        container.appendChild(nodeElement);
      }
    });
  }

  /**
   * Show error message
   */
  showError(message) {
    const errorContainer = document.getElementById('error-container');
    if (!errorContainer) return;

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorContainer.appendChild(errorDiv);

    // Auto-remove after 5 seconds
    setTimeout(() => errorDiv.remove(), 5000);
  }

  /**
   * Show success message
   */
  showSuccess(message) {
    const successContainer = document.getElementById('success-container');
    if (!successContainer) return;

    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    successContainer.appendChild(successDiv);

    // Auto-remove after 3 seconds
    setTimeout(() => successDiv.remove(), 3000);
  }
}

// Initialize on page load
let networkViz;
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    networkViz = new NetworkVisualizer();
    
    // Export for React component access
    window.networkVisualizer = networkViz;
  });
}