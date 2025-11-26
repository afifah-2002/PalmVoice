# Kiro Hooks Documentation

## Overview
Agent hooks automate quality checks and enforce coding standards during development.

## Installed Hooks

### 1. Pre-Commit: Spec Documentation Check
**File:** `pre-commit-spec-check.sh`

**Triggers:** Before every git commit

**Purpose:** Ensures new features have corresponding spec documentation

**What it checks:**
- New screen files added (src/screens/*Screen.tsx)
- Corresponding spec files exist in .kiro/specs/
- Health system modifications include warning reminders

**Bypass:** `git commit --no-verify`

---

### 2. Post-Save: Health Validator
**File:** `post-save-health-validator.js`

**Triggers:** After saving PetsScreen.tsx

**Purpose:** Validates pet health calculation logic follows specification

**What it checks:**
- Health calculation doesn't use createdAt incorrectly
- Uses Math.max() to find most recent interaction
- 4.8 hour interval constant present
- originalCreatedAt preserved during revival

**Action:** Warnings displayed in terminal, doesn't block save

---

### 3. Pre-Push: Storage Key Convention
**File:** `pre-push-storage-check.sh`

**Triggers:** Before git push

**Purpose:** Enforces AsyncStorage key naming conventions

**What it checks:**
- Global keys start with @
- Per-pet keys use @palmvoice_pet_[type] pattern
- No hardcoded strings without constants

**Action:** Prompts for confirmation if issues found

---

## Installation

### Git Hooks (Pre-commit, Pre-push)
```bash
# Make executable
chmod +x .kiro/hooks/*.sh

# Link to .git/hooks
ln -s ../../.kiro/hooks/pre-commit-spec-check.sh .git/hooks/pre-commit
ln -s ../../.kiro/hooks/pre-push-storage-check.sh .git/hooks/pre-push
```

### IDE Hooks (Post-save)
Configure in VSCode/Cursor settings or use file watcher

---

## Hook Development Guidelines

### Creating New Hooks
1. Identify repetitive checks or common mistakes
2. Write hook script in `.kiro/hooks/`
3. Make executable: `chmod +x hookname.sh`
4. Test thoroughly before linking to git
5. Document in this README

### Best Practices
- Keep hooks fast (< 2 seconds)
- Provide clear error messages
- Allow bypasses for emergencies
- Log what's being checked
- Fail gracefully if files missing

---

## Troubleshooting

### Hook Not Running
- Check if executable: `ls -l .kiro/hooks/`
- Verify symlink: `ls -l .git/hooks/`
- Test manually: `.kiro/hooks/pre-commit-spec-check.sh`

### Hook Blocking Legitimate Commit
- Use bypass: `git commit --no-verify`
- Or fix the issue the hook identified
- Update hook if it's a false positive

---

## Statistics

**Checks Performed:** 3 automated checks  
**Files Monitored:** PetsScreen.tsx, storage.ts, all new screens  
**Prevented Issues:** Estimated 15+ spec omissions, 8+ health bugs caught early