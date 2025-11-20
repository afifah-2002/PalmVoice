# State Persistence Rules

## Critical Requirements
1. **Theme NEVER resets** - Must persist across all navigation
2. **Mode NEVER resets** - Must persist across all navigation
3. **HOME button double-tap** - Does nothing special, just navigates
4. **Navigation** - Always preserves theme and mode state

## Implementation Rules
- Use Context API for global state (theme, mode)
- Use AsyncStorage for persistence across app restarts
- Never pass theme/mode as props - always read from context
- Load state on app mount, before any screen renders

## Testing Checklist
- [ ] Change theme on launcher → navigate to tasks → theme persists
- [ ] Change mode on launcher → navigate to tasks → mode persists
- [ ] Double-tap HOME button → no state reset
- [ ] Close app → reopen → theme and mode restored
- [ ] Navigate: Launcher → Tasks → Pet → Launcher → all states persist

## Anti-Patterns to Avoid
- ❌ Hardcoding theme in screen components
- ❌ Resetting state in useEffect on mount
- ❌ Passing theme as navigation params
- ❌ Using local state for theme/mode
- ❌ Reinitializing theme on screen focus