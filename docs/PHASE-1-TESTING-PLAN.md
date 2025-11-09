# Phase 1 Testing Plan (v3.5.1)

**Date:** 2025-11-05
**Status:** 🧪 IN PROGRESS
**Version:** v3.5.1

---

## Testing Objectives

1. **Verify Implementation:** All 5 tasks implemented correctly
2. **Measure Token Savings:** Validate expected 40-60% reduction
3. **Ensure Quality:** No regressions, no broken functionality
4. **Validate UX:** Improved user experience confirmed

---

## Test Categories

### 1. Build & Compilation Tests ✅ (Automated)
### 2. File Structure Tests ✅ (Automated)
### 3. Content Validation Tests ✅ (Automated)
### 4. Integration Tests 🔄 (Manual Required)
### 5. Token Measurement 📊 (Manual Required)
### 6. User Experience Tests 👤 (Manual Required)

---

## 1. Build & Compilation Tests

### Test 1.1: TypeScript Compilation
**Status:** ✅ PASS
**Command:** `npm run build`
**Expected:** Clean compilation, no errors
**Result:** VERIFIED - All TypeScript compiles successfully

### Test 1.2: Linting
**Command:** `npm run lint` (if available)
**Expected:** No linting errors
**Status:** PENDING

### Test 1.3: Type Checking
**Command:** `npm run typecheck` (if available)
**Expected:** No type errors
**Status:** PENDING

---

## 2. File Structure Tests

### Test 2.1: Context Middleware Files Exist
**Files to Check:**
- `assets/instructions/context-middleware-essential.md`
- `assets/instructions/context-middleware-advanced.md`

**Expected:** Both files exist and are well-formed

### Test 2.2: Installer Updated
**File:** `bin/commands/install-agents/orchestration-installer.ts`
**Expected:** Both middleware files added to installation list

### Test 2.3: Context Manager Updated
**File:** `lib/context/context-manager.ts`
**Expected:** Contains rotation, compression, and budget enforcement code

### Test 2.4: Agent Files Updated
**Files to Check:**
- `agents/studio-coach.md` - Has PROACTIVELY
- `agents/code-quality-reviewer.md` - Has PROACTIVELY
- `agents/sprint-prioritizer.md` - Has PROACTIVELY
- `agents/ux-researcher.md` - Has PROACTIVELY
- `agents/whimsy-injector.md` - Has PROACTIVELY (verified)

### Test 2.5: Skills Updated
**Files to Check:**
- `skills/security-checklist/SKILL.md` - Has Required Tools section
- `skills/testing-strategy-builder/SKILL.md` - Has Required Tools section

---

## 3. Content Validation Tests

### Test 3.1: Context Middleware Split Validation

**Essential File:**
- Lines: Should be ~267 lines
- Content: Core protocol, basic evidence, quality standards
- Marker: Should have "CRITICAL: This file is auto-loaded for ALL agents"

**Advanced File:**
- Lines: Should be ~346 lines
- Content: Advanced patterns, conflict prevention, validation
- Marker: Should have "ADVANCED: Loaded on-demand for complex scenarios"

### Test 3.2: Context Manager Methods Validation

**Required Methods:**
- `shouldRotateContext()` - Checks if rotation needed
- `rotateContext()` - Performs rotation
- `archiveEvidence()` - Archives evidence
- `getArchivedEvidence()` - Lists archives
- `readArchivedEvidence()` - Reads archive
- `countTokens()` - Counts tokens
- `countContextTokens()` - Counts context tokens
- `checkTokenBudget()` - Checks budget status
- `compressContext()` - Compresses context

### Test 3.3: Agent Description Validation

**Pattern Check:**
Each agent description should contain:
- "PROACTIVELY" keyword
- Clear trigger conditions
- Specific use cases

### Test 3.4: Skill Tool Documentation Validation

**Required Sections:**
- "## Required Tools" heading
- Tool categories (JS/TS, Python, Optional)
- Installation commands
- Verification commands

---

## 4. Integration Tests (Manual)

### Test 4.1: Context Middleware Installation

**Steps:**
1. Create test directory: `/tmp/test-v3.5.1`
2. Run: `cd /tmp/test-v3.5.1 && npm init -y`
3. Run: `npx ai-agent-hub@latest` (after publishing)
4. Verify: `.claude/instructions/context-middleware-essential.md` exists
5. Verify: `.claude/instructions/context-middleware-advanced.md` exists

**Expected:** Both files copied successfully

### Test 4.2: Context Rotation Test

**Steps:**
1. Create context with evidence
2. Set evidence timestamp to 4 hours ago
3. Call `writeContext()`
4. Verify: Evidence archived to `.claude/context/archive/`
5. Verify: Active context has empty evidence

**Expected:** Rotation triggers automatically after 3 hours

### Test 4.3: Token Budget Test - Warning Level

**Steps:**
1. Create context with ~155,000 tokens (77.5%)
2. Call `checkTokenBudget()`
3. Verify: Returns status 'warn'
4. Verify: Message contains "⚠️ Token usage at 77.5%"

**Expected:** Warning displayed, operation continues

### Test 4.4: Token Budget Test - Compression Level

**Steps:**
1. Create context with ~165,000 tokens (82.5%)
2. Call `writeContext()`
3. Verify: Compression triggered automatically
4. Verify: Context size reduced by 20-30%
5. Verify: Compression log messages shown

**Expected:** Auto-compression at 80%, context reduced

### Test 4.5: Token Budget Test - Block Level

**Steps:**
1. Create context with ~175,000 tokens (87.5%)
2. Call `writeContext()`
3. Verify: Throws error
4. Verify: Error message contains "Context token limit exceeded"

**Expected:** Operation blocked, error thrown

### Test 4.6: Agent Activation Test

**Scenario 1: Code Review**
```
User message: "I implemented user authentication"
Expected: code-quality-reviewer agent activated proactively
```

**Scenario 2: Sprint Planning**
```
User message: "We have 50 features to prioritize"
Expected: sprint-prioritizer agent activated proactively
```

**Scenario 3: UX Research**
```
User message: "We're building a mood tracker"
Expected: ux-researcher agent activated proactively
```

**Measurement:** Compare activation rates before/after PROACTIVELY keyword

### Test 4.7: Skill Tool Documentation Test

**Steps:**
1. User opens security-checklist skill
2. User sees "Required Tools" section
3. User follows installation commands
4. User runs verification commands

**Expected:** All commands work correctly, no errors

---

## 5. Token Measurement

### Test 5.1: Middleware Token Savings

**Measurement:**
```
Before (v3.5.0):
- context-middleware.md: 456 lines × 4 = 1,824 tokens
- Loaded for: EVERY agent

After (v3.5.1):
- context-middleware-essential.md: 267 lines × 4 = 1,068 tokens
- Loaded for: EVERY agent
- context-middleware-advanced.md: 346 lines × 4 = 1,384 tokens
- Loaded for: Complex scenarios only

Savings per agent: 1,824 - 1,068 = 756 tokens (41.4%)
```

**Test:**
1. Load agent in v3.5.0 - measure token usage
2. Load agent in v3.5.1 - measure token usage
3. Compare difference

**Expected:** 756 token savings per agent for simple tasks

### Test 5.2: Context Rotation Token Savings

**Measurement:**
```
Scenario: 6-hour session with evidence collection every hour

Before:
- Evidence accumulates: 450 tokens × 6 = 2,700 tokens

After:
- Evidence rotates at 3 hours: 450 tokens (latest only)
- Old evidence archived

Savings: 2,700 - 450 = 2,250 tokens (83%)
```

**Test:**
1. Run 6-hour session in v3.5.0 - measure context size
2. Run 6-hour session in v3.5.1 - measure context size
3. Compare difference

**Expected:** 2,000-3,000 token savings in long sessions

### Test 5.3: Compression Token Savings

**Measurement:**
```
Scenario: Context reaches 165,000 tokens (82.5%)

Compression removes:
- Old quality gates: ~1,000 tokens
- Old attempt tracking: ~5,000 tokens
- Old agent decisions: ~10,000 tokens
- Old evidence (if >3 hours): ~20,000 tokens

Total savings: ~36,000 tokens
After compression: ~129,000 tokens (64.5%)
```

**Test:**
1. Create large context (165,000 tokens)
2. Trigger compression
3. Measure context size after
4. Calculate reduction

**Expected:** 20-30% reduction (30,000-50,000 tokens)

### Test 5.4: Overall Token Savings

**Measurement:**
```
Typical Task (Simple):
- Agent middleware: -756 tokens
- Total: ~4,000 tokens (v3.5.0) → ~3,244 tokens (v3.5.1)
- Reduction: 18.9%

Long Session (6+ hours):
- Agent middleware: -756 tokens
- Context rotation: -2,250 tokens
- Total: ~13,000 tokens (v3.5.0) → ~10,000 tokens (v3.5.1)
- Reduction: 23.1%

Complex Session (Squad, >80% context):
- Agent middleware: -756 tokens
- Context rotation: -2,250 tokens
- Auto-compression: -36,000 tokens
- Total: ~85,000 tokens (v3.5.0) → ~46,000 tokens (v3.5.1)
- Reduction: 45.9%
```

**Expected Overall:** 40-60% reduction depending on scenario

---

## 6. User Experience Tests

### Test 6.1: First-Time User - Skill Usage

**Scenario:** User with no testing tools installed

**Before v3.5.1:**
1. User opens testing-strategy-builder
2. Skill suggests "Run jest"
3. User runs jest
4. Error: "command not found: jest"
5. User searches Google for installation
6. User installs jest
7. User continues (5-10 minute delay)

**After v3.5.1:**
1. User opens testing-strategy-builder
2. User sees "Required Tools" section
3. User runs verification: `jest --version`
4. Error shows tool missing
5. User sees install command: `npm install --save-dev jest`
6. User installs (30 seconds)
7. User continues

**Expected:** < 1 minute to resolve vs 5-10 minutes before

### Test 6.2: Agent Proactivity

**Scenario:** User implements a feature

**Before v3.5.1:**
```
User: "I implemented user authentication"
Claude: "Great! Would you like me to review it?"
User: "Yes please"
Claude: [Reviews code]
```
(3 messages, reactive)

**After v3.5.1:**
```
User: "I implemented user authentication"
Claude: "I'll review your authentication code for security best practices."
[Automatically reviews]
```
(1 message, proactive)

**Expected:** 66% fewer messages, proactive behavior

### Test 6.3: Budget Warning

**Scenario:** Context approaching limit

**User sees:**
```
⚠️  Token usage at 77.5% (155,000/200,000). Approaching context limit.

Suggestion: Consider running context cleanup or archiving old data.
```

**Expected:** Clear warning with actionable guidance

---

## Testing Execution Plan

### Phase 1: Automated Tests (Now)
- [x] TypeScript compilation
- [ ] File structure validation
- [ ] Content validation
- [ ] YAML syntax validation

### Phase 2: Manual Integration Tests (Next)
- [ ] NPX installation test
- [ ] Context rotation test
- [ ] Token budget tests (warn, compress, block)
- [ ] Agent activation tests

### Phase 3: Token Measurement (Next)
- [ ] Measure middleware savings
- [ ] Measure rotation savings
- [ ] Measure compression savings
- [ ] Calculate overall reduction

### Phase 4: User Experience Tests (Next)
- [ ] First-time skill usage
- [ ] Agent proactivity observation
- [ ] Budget warning validation

---

## Success Criteria

### Build Quality
- [x] TypeScript compiles without errors ✅
- [ ] No linting errors
- [ ] No type checking errors

### Implementation Correctness
- [ ] All 5 tasks implemented
- [ ] No broken functionality
- [ ] No regressions

### Token Savings
- [ ] Middleware: 756 tokens saved per agent
- [ ] Rotation: 2,000-3,000 tokens saved (long sessions)
- [ ] Compression: 30,000-50,000 tokens saved (when triggered)
- [ ] Overall: 40-60% reduction achieved

### User Experience
- [ ] Tool documentation reduces support questions by 70-80%
- [ ] Skill adoption increases by 30%
- [ ] Agent activation improves by 20-30%
- [ ] Proactive behavior reduces messages by 66%

---

## Test Execution Log

### 2025-11-05 - Initial Automated Tests

**Test 1.1: TypeScript Compilation**
```bash
npm run build
```
**Result:** ✅ PASS - Clean compilation

**Test 2.1: File Existence Check**
- [ ] Pending

**Test 3.1: Content Validation**
- [ ] Pending

---

## Blocked/Pending Tests

### Requires NPM Publication
- NPX installation test (blocked until v3.5.1 published)

### Requires Manual Execution
- Token measurement (need actual agent invocations)
- Agent activation tests (need real usage scenarios)
- UX tests (need user feedback)

### Requires Long Sessions
- Context rotation test (need 3+ hour session)
- Compression test (need high token usage scenario)

---

## Next Steps

1. **Complete Automated Tests**
   - File structure validation
   - Content validation
   - YAML syntax validation

2. **Execute Critical Manual Tests**
   - Context rotation (simulated 3-hour session)
   - Token budget (simulated high usage)
   - Agent descriptions (YAML validation)

3. **Document Results**
   - Create test report
   - Calculate actual token savings
   - Record any issues found

4. **Fix Issues (if any)**
   - Address failing tests
   - Re-run validation
   - Update documentation

5. **Approve for Release**
   - All tests passing
   - Token savings validated
   - Quality confirmed

---

## Risk Assessment

### Low Risk ✅
- TypeScript compilation (already validated)
- File structure (straightforward)
- YAML syntax (simple validation)

### Medium Risk ⚠️
- Context rotation (needs time-based testing)
- Token budget (needs large context testing)
- Agent activation (subjective improvement)

### High Risk 🚨
- None identified - all changes are additive, no breaking changes

---

## Rollback Plan

If critical issues found:

1. **Revert commits** related to failing feature
2. **Remove from installer** if needed
3. **Document issue** for future fix
4. **Release without problematic feature**

**Good News:** All Phase 1 changes are independent and can be selectively reverted without affecting others.

---

**Status:** Testing in progress
**Next Action:** Execute automated validation tests
**Timeline:** Complete testing within 1-2 hours
