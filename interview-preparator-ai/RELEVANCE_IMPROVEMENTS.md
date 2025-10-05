# Relevance Scoring Improvements - Implementation Summary

## Overview
Enhanced relevance scoring to reduce false negatives, ensure per-question transcript isolation, and provide question-specific missing keyword analysis.

## Changes Made

### A) Relevance Scoring Improvements (`features/analysis/relevance.ts`)

#### 1. **Synonym Matching** (`lib/keywords.ts`)
- Added `SYNONYMS` map for each domain (frontend_react, backend_node, data_sql)
- Synonyms now count as the root term (e.g., "TSX" matches "JSX", "useState" matches "state")
- Examples:
  - `jsx`: ['tsx', 'render tree', 'elements']
  - `state`: ['usestate', 'stateful', 'state management']
  - `async`: ['asynchronous', 'await', 'promise', 'promises']

#### 2. **Stemming/Lemmatization**
- Added `stem()` function to remove common suffixes
- Removes plural 's', 'ing', 'ed'
- Example: "rendering" → "render", "indexed" → "index"

#### 3. **Lowered Thresholds**
- **On-topic**: 65 (was 70)
- **Partially on-topic**: 40-64 (was 40-69)
- **Off-topic**: <40 (unchanged)

#### 4. **Minimum Length Guard**
- Answers < 12 words → automatically classified as "partially_on_topic"
- Reason: "Answer is too short to judge properly. Provide more details."

#### 5. **Capped Blacklist Penalty**
- Off-topic markers now capped at -10 points (was -15 per marker, uncapped)
- Prevents true positives from being overwhelmed by single markers

#### 6. **Question-Specific Keywords**
- New `getRequiredKeywords(question, roleSkill)` function
- Combines question-extracted keywords + top 10 role keywords
- Missing keywords now reflect THIS question, not global domain

### B) Per-Question Transcript Handling (`state/store.ts`)

#### Already Implemented Correctly ✅
The store already creates distinct transcript objects:
```typescript
const questionResult: QuestionResult = {
  id: session.question.id,
  question: session.question.q,
  transcript,  // ← Captured from parameter
  durationMs: duration * 1000,
  metrics: { ...computedMetrics }
};
```

#### Verified in Tests
- Each question gets its own transcript
- No shared references
- Deep clones of metrics objects

### C) UI Updates (`components/RelevanceCard.tsx`)

#### Added Caption for Missing Keywords
- Added caption: "Missing terms for this question"
- Clarifies that missing keywords are specific to the selected question
- Positioned above the missing keywords list

### D) Report Page (`pages/Report.tsx`)

#### Already Using Correct Source ✅
```typescript
currentQuestion.transcript  // ← From results.questions[currentIndex]
```

## Tests

### New Test Cases Added (`__tests__/relevance.test.ts`)

1. **Synonym matching works correctly**
   - TSX, useState, useEffect recognized as JSX, state, effect
   
2. **Short answers marked as partial**
   - <12 words → 45 score, "too short" reason
   
3. **Off-topic paragraphs correctly identified**
   - Unrelated content → <40 score, off_topic verdict

4. **Stemming works**
   - "rendering", "rendered" match "render"
   - "components" matches "component"

5. **SQL synonyms**
   - "indexes", "aggregation", "transactions" matched correctly

### Store Tests (`__tests__/store.test.ts`)

1. **Distinct transcripts for multiple questions**
   - Verified each question has its own transcript
   - No shared references

2. **Deep clones of metrics**
   - Metrics objects are separate
   - starScores are separate objects

3. **Skipped questions handled correctly**
   - Empty transcript for skipped questions
   - Status marked as 'skipped'

## Results

### Before
- **False Negatives**: Correct answers marked off-topic due to strict keyword matching
- **Transcript Duplication**: Risk of shared references
- **Global Missing Keywords**: Showed domain-wide missing terms, not question-specific

### After
- **Improved Accuracy**: Synonyms and stemming reduce false negatives
- **Lowered Thresholds**: 65+ for on_topic (was 70)
- **Capped Penalties**: -10 max for off-topic markers (prevents overwhelming)
- **Isolated Transcripts**: Each question has distinct transcript
- **Question-Specific Missing**: Shows only keywords relevant to THIS question
- **Short Answer Guard**: Prevents premature judgment on brief responses

## Files Modified

1. `client/src/lib/keywords.ts`
   - Added SYNONYMS map
   - Added stem() function
   - Added getSynonyms() function
   - Added getRequiredKeywords() function

2. `client/src/features/analysis/relevance.ts`
   - Enhanced calculateKeywordCoverage() with synonym/stemming
   - Added minimum length guard (12 words)
   - Lowered verdict thresholds (65/40)
   - Capped off-topic penalty at -10
   - Use getRequiredKeywords() for question-specific analysis

3. `client/src/components/RelevanceCard.tsx`
   - Added caption "Missing terms for this question"

4. `client/src/features/analysis/__tests__/relevance.test.ts`
   - Added 5 new test cases for improved scoring

5. `client/src/features/state/__tests__/store.test.ts`
   - New file with 3 test cases for transcript handling

## Acceptance Criteria Met

✅ Relevance no longer marks clearly correct answers as off-topic
✅ Each question in report shows its own transcript (no duplication)  
✅ "Missing" lists are question-specific and make sense for the selected prompt
✅ Synonym matching working (TSX → JSX, useState → state)
✅ Stemming working (rendering → render, indexes → index)
✅ Short answers handled gracefully with clear reason
✅ Blacklist penalty capped to avoid overwhelming true positives
✅ All tests passing
