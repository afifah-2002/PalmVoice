#!/bin/bash

# Pre-Commit Hook: Spec Documentation Check
# Ensures new features have corresponding spec documentation

echo "Checking for spec documentation..."

# Get list of modified files
MODIFIED_FILES=$(git diff --cached --name-only --diff-filter=ACM)

# Check if new screens were added
NEW_SCREENS=$(echo "$MODIFIED_FILES" | grep "src/screens/.*Screen.tsx" | grep -v "^D")

if [ ! -z "$NEW_SCREENS" ]; then
  echo "📄 New screen files detected:"
  echo "$NEW_SCREENS"
  
  # Check if corresponding specs exist
  MISSING_SPECS=0
  
  for screen in $NEW_SCREENS; do
    SCREEN_NAME=$(basename "$screen" .tsx | sed 's/Screen$//')
    SPEC_PATTERN=$(echo "$SCREEN_NAME" | sed 's/\([A-Z]\)/-\L\1/g' | sed 's/^-//')
    
    # Look for related spec files
    SPEC_COUNT=$(find .kiro/specs -name "*$SPEC_PATTERN*.md" 2>/dev/null | wc -l)
    
    if [ "$SPEC_COUNT" -eq 0 ]; then
      echo "Missing spec for: $SCREEN_NAME"
      MISSING_SPECS=$((MISSING_SPECS + 1))
    fi
  done
  
  if [ "$MISSING_SPECS" -gt 0 ]; then
    echo ""
    echo " Commit blocked: Missing spec documentation"
    echo "Please create spec docs in .kiro/specs/ for new features"
    echo ""
    echo "Bypass with: git commit --no-verify"
    exit 1
  fi
fi

# Check if pet health logic modified
HEALTH_MODIFIED=$(echo "$MODIFIED_FILES" | grep -E "(PetsScreen|storage\.ts|health)")

if [ ! -z "$HEALTH_MODIFIED" ]; then
  echo "Pet health system modified"
  echo "Remember: Health calculated from MOST RECENT interaction timestamp"
  echo "Never use createdAt for health calculation"
  echo ""
fi

echo "Pre-commit checks passed"
exit 0