#!/bin/bash

# Pre-Push Hook: Storage Key Convention Check
# Ensures AsyncStorage keys follow naming conventions

echo "💾 Checking AsyncStorage key conventions..."

# Find all storage.ts usage
STORAGE_FILES=$(git diff origin/main --name-only | grep -E "\.(ts|tsx)$")

if [ -z "$STORAGE_FILES" ]; then
  echo "✅ No storage changes to check"
  exit 0
fi

ISSUES_FOUND=0

for file in $STORAGE_FILES; do
  if [ -f "$file" ]; then
    # Check for AsyncStorage.setItem usage
    STORAGE_CALLS=$(grep -n "AsyncStorage.setItem\|AsyncStorage.getItem" "$file" || true)
    
    if [ ! -z "$STORAGE_CALLS" ]; then
      echo "📄 Checking: $file"
      
      # Check for keys without @ prefix (global keys should have @)
      BAD_KEYS=$(echo "$STORAGE_CALLS" | grep -v "@palmvoice\|@coins\|@items\|@theme\|@pets\|@tasks\|@unlocked" || true)
      
      if [ ! -z "$BAD_KEYS" ]; then
        echo "⚠️  Potential naming convention issue:"
        echo "$BAD_KEYS"
        echo ""
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
      fi
    fi
  fi
done

if [ "$ISSUES_FOUND" -gt 0 ]; then
  echo "⚠️  Storage key issues detected"
  echo "Convention: Global keys start with @"
  echo "Examples: @coins, @itemInventory, @unlockedThemes"
  echo "Pet-specific: @palmvoice_pet_[type]"
  echo ""
  echo "Refer to: .kiro/steering/storage-patterns.md"
  echo ""
  echo "Continue push anyway? (y/n)"
  read -r response
  if [ "$response" != "y" ]; then
    exit 1
  fi
fi

echo "✅ Storage check completed"
exit 0