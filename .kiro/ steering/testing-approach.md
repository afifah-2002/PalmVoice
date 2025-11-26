---
inclusion: manual
---

# Testing and Quality Assurance

## Manual Testing Checklist

### Pet Health System
- [ ] Health declines correctly over time (4.8 hours)
- [ ] Actions increase health by correct amount
- [ ] Daily action limits work (once per day)
- [ ] Pet dies at 0 hearts
- [ ] Revival restores to 5 hearts
- [ ] Streak continues after revival
- [ ] Multiple pets maintain separate health

### Coin Economy
- [ ] +1 coin per task completion
- [ ] +5 coins for 3 tasks bonus
- [ ] Coins persist across app restarts
- [ ] Shop purchases deduct coins
- [ ] Insufficient coin errors work
- [ ] Coin display updates everywhere

### Storage Persistence
- [ ] Pets save/load correctly
- [ ] Coins persist
- [ ] Themes persist
- [ ] Items persist
- [ ] Tasks persist
- [ ] Completed tasks persist

### Edge Cases
- [ ] App works after fresh install
- [ ] Multiple pet creation/deletion
- [ ] Rapid task completion
- [ ] Theme switching mid-interaction
- [ ] Pet switching mid-action
- [ ] Shop purchases with exact coin amount

## Common Bugs to Watch For

### Health Calculation
- Health reverting after action (clock not resetting)
- Using createdAt instead of most recent interaction
- originalCreatedAt changing on revival

### Storage Issues
- Items showing different counts per pet
- Stale state after switching pets
- Undefined values causing crashes

### UI Issues
- Text overflow outside containers
- Dropdown cutoff with long names
- Modal overlap issues
- Animation conflicts

## Performance Considerations
- GIF files should be < 2MB
- AsyncStorage reads should be batched
- Health calculation every minute, not every second
- Avoid re-renders on unchanged props