# PalmVoice Development with Kiro

## Project Overview
PalmVoice is a retro Palm Pilot-style productivity app that combines task management with Tamagotchi-style pet care. Built during the Kiroween Hackathon using Kiro's AI-powered development tools.

## Kiro Features Used

### 1. Spec-Driven Development ⭐

#### What I Did
Created **25+ specification documents** in `.kiro/specs/` to define system architecture before implementation.

#### Key Specs Created
- `pet-health-24hour-cycle.md` - Complex health decline system
- `multiple-pet-slots.md` - Multi-pet data architecture
- `theme-shop-modal.md` - Theme purchasing system
- `coin-economy-system.md` - Reward and spending mechanics
- `task-completion-coin-reward.md` - Task-to-coin conversion

#### Development Process
1. **Write spec first** - Define requirements in natural language
2. **Implement with Kiro** - Use spec as reference during coding
3. **Debug with spec** - Return to spec when bugs occur to verify implementation

#### Benefits
- **50% reduction in back-and-forth** - Clear requirements upfront
- **Easier debugging** - Specs serve as source of truth
- **Team-ready** - Anyone can understand system from specs
- **Prevented regressions** - Spec verification caught edge cases

#### Example: Pet Health System
The health system had a critical bug where health would revert after actions. The spec clearly stated:
> "Calculate health from MOST RECENT interaction (lastFed, lastPet, lastPlay), NOT createdAt"

This spec reference immediately identified the bug - we were using `createdAt` instead of most recent timestamp.

---

### 2. Steering Documents 🎯

#### What I Did
Created **10 foundational steering documents** in `.kiro/steering/` to guide AI code generation.

#### Steering Files Created
1. `product.md` - Product vision and target users
2. `tech.md` - Technology stack and constraints
3. `pet-health-system.md` - Critical health calculation rules
4. `coin-economy.md` - Earning and spending mechanics
5. `theme-system.md` - Theme purchase and application flow
6. `storage-patterns.md` - AsyncStorage key conventions
7. `ui-consistency.md` - Typography, colors, animations
8. `testing-approach.md` - Manual testing checklist
9. `app-integrations.md` - iOS app URL schemes
10. `error-handling.md` - Error handling standards

#### Steering Strategy
Used different inclusion modes strategically:
- **Always included:** Core rules (product, tech, health system, coin economy)
- **File-matched:** Context-specific (theme-system.md only loads for PetsScreen.tsx)
- **Manual:** Reference docs (testing-approach.md loaded with #testing)

#### Impact
- **Eliminated repetition** - No need to explain "4.8 hour health decline" in every conversation
- **Consistent code generation** - All pet types follow same health rules automatically
- **Faster iterations** - AI remembers project conventions

#### Example: Health System Steering
Before steering: Spent 20 minutes each conversation explaining health calculation logic.

After steering: AI automatically knew:
- Health declines every 4.8 hours
- Calculate from most recent interaction timestamp
- originalCreatedAt for streak, createdAt for fallback
- Potion adds +2 hearts, actions add +1

**Result:** Health-related features implemented 3x faster.

---

### 3. Vibe Coding 💬

#### What I Did
Used conversational approach with Kiro for rapid prototyping and UI refinement.

#### Best Use Cases for Vibe Coding
- **UI polish** - "Make the coin popup more animated and cute"
- **Bug fixes** - "Health reverts to 3 after feeding, why?"
- **Quick features** - "Add a delete pet option with confirmation"
- **Style adjustments** - "Make theme names wrap without overflow"

#### Most Impressive Code Generation
**Multi-Pet Slot System Refactor**

**Context:** Initially had single pet system. Needed to support multiple pets (Cat, Puppy, Panda, Koala) with independent health tracking.

**Single conversation with Kiro:**
```
Me: "I need to support multiple pet types. Each pet should have its own 
health, name, and streak. When I switch pets, the previous pet's data 
should be preserved. Use separate storage keys per pet type."

Kiro: [Generated complete refactor]
- Created @palmvoice_pet_cat, @palmvoice_pet_puppy keys
- Refactored loadPet() and savePet() to be type-specific
- Updated all health calculations to work per-pet
- Added pet switching logic
- Preserved global items (coins, potions) across pets
```

**Impact:** What would have taken 4-5 hours manually was done in 45 minutes with minimal edits.

---

### 4. Comparison: Specs vs Vibe Coding 📊

#### When to Use Each

**Spec-Driven Development:**
- ✅ Complex systems (health calculation, coin economy)
- ✅ Multi-step workflows (purchase flow, revival system)
- ✅ Data architecture (storage keys, state management)
- ✅ When multiple developers need to understand
- ✅ When edge cases matter

**Vibe Coding:**
- ✅ UI/UX refinements (animations, colors, spacing)
- ✅ Quick bug fixes (obvious issues)
- ✅ Exploratory coding (trying different approaches)
- ✅ Rapid prototyping (getting something working fast)

#### Combined Approach (Best Results)
1. **Spec the architecture** - Write detailed spec for system design
2. **Vibe the implementation** - Use conversational coding to build it
3. **Reference spec when debugging** - Return to spec to verify correctness

**Example: Shop System**
- **Spec:** Defined theme pricing, purchase flow, storage keys
- **Vibe:** Implemented modal UI, animations, error handling
- **Spec again:** Verified coin deduction logic against spec during bug fix

---

### 5. MCP (Model Context Protocol) 🔌

#### Attempted Setup
Researched MCP for direct file access during development. Discovered the npm package `@kiroai/mcp-server` is not yet published.

#### What MCP Would Enable
- Direct read/write of spec docs from Kiro chat
- Auto-sync steering files during conversation
- Live project file access for agents
- Reduced copy-paste between IDE and chat

#### Current Workaround
- Manual file management in `.kiro/` directories
- Still effective, just less automated

#### Future Plans
Once MCP is available:
- Set up MCP server for spec doc management
- Enable agents to read project structure directly
- Auto-generate steering docs from codebase analysis

---
### 6. Agent-Guided Implementation

Created agent file: `app-integrations-builder.md` with complete specifications for iOS app integrations.

Used agent as implementation guide in Cursor to build:
- Calendar integration (creates actual events with expo-calendar)
- Reminders integration (creates iOS reminders)
- Gmail/Outlook/WhatsApp pre-fill functionality
- Generic app openers for Zoom, Teams, etc.

**Result:** All 14 app integrations working in 1 hour by following agent specifications.

## Key Learnings

### What Worked Best
1. **Specs prevent regressions** - Referencing specs during bugs immediately identifies issues
2. **Steering reduces repetition** - Write rules once, apply everywhere
3. **Vibe coding for speed** - UI iterations 5x faster with conversational approach
4. **Combined approach wins** - Spec + Vibe together > either alone

### What I'd Do Differently
1. **Write steering docs earlier** - Would have saved repetition in first week
2. **More granular specs** - Break large systems into smaller spec files
3. **Use conditional steering** - File-matched inclusion for domain-specific rules
4. **Document as I go** - This process doc should have been built incrementally

### Surprises
1. **AI understands natural language specs** - No need for formal notation
2. **Steering actually works** - AI consistently follows rules across conversations
3. **Vibe coding handles complexity** - Even complex refactors work conversationally
4. **Specs are living docs** - Updated specs as requirements changed

---

## Project Statistics

### Kiro Usage
- **Spec docs created:** 25+
- **Steering docs created:** 10
- **Lines of code generated:** ~8,000+
- **Development time saved:** Estimated 40+ hours
- **Major refactors with Kiro:** 3 (multi-pet, health system, shop integration)

### Development Timeline
- **Week 1:** Core pet health system (spec-driven)
- **Week 2:** Task management and coin economy (spec + vibe)
- **Week 3:** Shop system and themes (vibe-heavy)
- **Week 4:** Polish, bug fixes, integrations (vibe + spec reference)

---

## Conclusion

Kiro transformed this project from a solo coding marathon into a collaborative development experience. The combination of spec-driven architecture, steering-guided code generation, and conversational vibe coding created a development workflow that was both fast and maintainable.

**Most valuable feature:** Spec-driven development. Having clear specifications made every conversation with Kiro more productive and every bug easier to fix.

**Biggest time-saver:** Steering docs. After the initial setup investment, steering eliminated 80% of repetitive explanations.

**Most impressive moment:** When Kiro refactored the entire pet system to support multiple pets in a single conversation, maintaining data integrity and adding new features simultaneously.

**Would I use Kiro again?** Absolutely. The spec + steering + vibe combination is now my preferred development workflow.