/**
 * Post-Save Hook: Health Calculation Validator
 * Runs after saving PetsScreen.tsx to validate health logic
 */

const fs = require('fs');
const path = require('path');

const PETS_SCREEN_PATH = path.join(__dirname, '../../src/screens/PetsScreen.tsx');

console.log('🏥 Validating pet health calculation logic...');

try {
  const content = fs.readFileSync(PETS_SCREEN_PATH, 'utf-8');
  
  let hasIssues = false;
  const issues = [];
  
  // Check 1: Using createdAt in health calculation
  if (content.match(/health.*createdAt/i) && !content.includes('originalCreatedAt')) {
    issues.push('⚠️  WARNING: Found "createdAt" in health calculation');
    issues.push('   Health should use most recent interaction timestamp, not createdAt');
    hasIssues = true;
  }
  
  // Check 2: Looking for Math.max with interaction timestamps
  const hasMaxCheck = content.includes('Math.max') && 
                      (content.includes('lastFed') || 
                       content.includes('lastPet') || 
                       content.includes('lastPlay'));
  
  if (!hasMaxCheck && content.includes('calculateHealth')) {
    issues.push('⚠️  WARNING: Health calculation may not use most recent timestamp');
    issues.push('   Should use Math.max(lastFed, lastPet, lastPlay, lastPotion, lastRevival)');
    hasIssues = true;
  }
  
  // Check 3: 4.8 hour constant
  if (!content.includes('4.8') && content.includes('calculateHealth')) {
    issues.push('⚠️  WARNING: Missing 4.8 hour interval constant');
    issues.push('   Health should decline 1 heart per 4.8 hours');
    hasIssues = true;
  }
  
  // Check 4: originalCreatedAt preservation
  if (content.includes('revival') && content.includes('createdAt') && 
      !content.includes('originalCreatedAt')) {
    issues.push('⚠️  WARNING: Revival may reset originalCreatedAt');
    issues.push('   originalCreatedAt should never change, even on revival');
    hasIssues = true;
  }
  
  if (hasIssues) {
    console.log('\n❌ Health validation issues found:\n');
    issues.forEach(issue => console.log(issue));
    console.log('\nRefer to: .kiro/steering/pet-health-system.md');
    console.log('');
  } else {
    console.log('✅ Health calculation logic looks good');
  }
  
} catch (error) {
  console.log('⚠️  Could not validate (file may not exist yet)');
}