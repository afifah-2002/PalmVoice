# Pet Streak System Specification

## Overview
Tracks how many days pet has been alive since creation. Streak persists through revivals.

## Streak Calculation

### Start Point
- Begins when pet is created and named
- Starts at 1 day (includes creation day)
- Tracked via createdAt timestamp

### Daily Count
- Formula: Days since createdAt to now
- Includes partial days
- Updates automatically

### Persistence
- Stored in AsyncStorage via createdAt field
- Loads on app open
- Continues counting even if app closed

## Streak Display

### Location
- Bottom bar center position
- Shows flame icon + "X DAYS" or "X DAY"
- Format examples: "1 DAY", "7 DAYS", "15 DAYS"

### On Home Screen
- Also displays in Pet Status card
- Below coins display
- Same format and styling

## Streak on Revival

### Behavior
- Pet dies at 0 hearts
- User revives with coins
- createdAt timestamp preserved
- Streak continues from original creation date
- Does NOT reset on revival

## Tappable Action
- Tap streak display: Opens share options
- Shows current streak count
- Option to share streak image