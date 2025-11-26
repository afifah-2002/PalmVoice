# Delete Pet Option Specification

## Overview
Users can permanently delete a pet, removing all associated data from storage.

## Access Point
- Pet dropdown in Pet screen
- Long-press on pet option
- OR: Settings icon next to pet name in dropdown

## Delete Flow

### Step 1: User Initiates Delete
- User long-presses pet in dropdown
- OR taps delete icon (🗑️) next to pet name
- Delete option appears for owned pets only (not locked pets)

### Step 2: Confirmation Popup
**Display:**
- Title: "DELETE [PET NAME]?"
- Warning message: "This will permanently delete [pet name] and all progress. This cannot be undone."
- Show pet sprite
- Show what will be lost:
  - Name
  - X day streak
  - Health progress

**Buttons:**
- "CANCEL" (gray, left side)
- "DELETE" (red, right side)

### Step 3: Deletion Process
If user confirms:
1. Remove pet data from storage (@palmvoice_pet_[type])
2. Remove pet type from @unlockedPets (if not cat)
3. If deleted pet was active: Switch to Cat (default)
4. Close dropdown and modals
5. Show confirmation: "[Pet name] has been deleted"

## What Gets Deleted

### Pet-Specific Data
- Pet name
- Health value
- Created date (streak resets)
- Last fed timestamp
- Last pet timestamp  
- Last play timestamp
- Entire storage key removed

### What DOESN'T Get Deleted
- Coins balance (shared across all pets)
- Items inventory (revival tokens, potions)
- Purchased themes
- Other pets' data
- Task list
- Completed tasks

## Edge Cases

### Cannot Delete Cat
- Cat is default/free pet
- Delete option hidden for cat
- If cat is only pet: Cannot delete

### Cannot Delete Last Pet
- Must have at least 1 pet active
- If trying to delete last pet: Show error
- "You must have at least one pet"

### Deleted Pet Was Active
- Automatically switch to next available pet
- Priority: Cat > Puppy > Panda > Penguin
- Active pet updated in storage

## Re-Purchasing Deleted Pet

### Pet Still Unlocked
- Deleting pet doesn't lock it
- Pet remains in @unlockedPets
- Can select from dropdown to create new pet
- Treated as brand new pet (new name, fresh streak)

### Example
```
User deletes "Buddy the Puppy" (7 day streak)
Puppy still shows in dropdown (unlocked)
User selects Puppy again
Name modal opens: "NAME YOUR PET"
User names it "Max"
New puppy starts with 5 hearts, 1 day streak
Old "Buddy" data completely gone
```

## Visual Feedback
- Delete icon: 🗑️ (trash can, red color)
- Hover/press state: Darker red
- Confirmation popup: Red theme with warning colors
- Success message: Brief toast notification