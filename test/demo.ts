// Simple test to demonstrate activation-based memory
import { HelenKellerActivationNetwork } from '../src/index';

async function demonstrateActivationMemory() {
  console.log("\n🧪 Helen Keller Activation Network Demonstration\n");
  console.log("=" .repeat(50));

  const helen = new HelenKellerActivationNetwork('./test-network.json');
  await helen.initialize();

  console.log("\n📚 Phase 1: Teaching Basic Concepts");
  console.log("-".repeat(40));

  // Teach elemental concepts
  await helen.learn("Water is liquid, wet, and essential for life");
  await helen.learn("Ice is solid, cold, frozen water");
  await helen.learn("Steam is hot, gaseous water vapor");
  await helen.learn("Heat transforms ice to water to steam");

  console.log("\n🤔 Phase 2: Testing Activation Cascades");
  console.log("-".repeat(40));

  // Test 1: Direct association
  console.log("\nQuery: 'What is ice?'");
  const response1 = await helen.think("What is ice?");
  console.log("Response:", response1);

  // Test 2: Indirect association through cascades
  console.log("\nQuery: 'What happens when ice gets warm?'");
  const response2 = await helen.think("What happens when ice gets warm?");
  console.log("Response:", response2);

  // Test 3: Novel combination requiring pathway integration
  console.log("\nQuery: 'Can steam become ice?'");
  const response3 = await helen.think("Can steam become ice?");
  console.log("Response:", response3);

  console.log("\n💾 Saving network state...");
  helen.saveNetwork();

  console.log("\n✅ Demonstration complete!");
  console.log("\nKey insight: The responses emerged from activation");
  console.log("patterns, not from database lookups. The pathways");
  console.log("between concepts ARE the memories!\n");
}

demonstrateActivationMemory().catch(console.error);
