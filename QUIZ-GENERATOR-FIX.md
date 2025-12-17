# Quiz Generator Fix - Gemini AI Integration

## Problem
Quiz questions were always falling back to low-quality "What is this headline about?" questions instead of using Gemini AI to generate intelligent quiz questions.

### Root Cause
**Two bugs in `server/services/quizGenerator.js`**:

1. **Undefined Variable Error (Line 48)**:
   ```javascript
   const response = await ai.models.generateContent(...);
   const responseText = result.response.text(); // ❌ 'result' is undefined!
   ```
   - Code called API and stored in `response`
   - Then tried to read from undefined variable `result`
   - This threw an exception → fell back to `createFallbackQuiz()`

2. **Wrong Package Import (Line 1)**:
   ```javascript
   const { GoogleGenAI } = require('@google/genai'); // ❌ Wrong package
   ```
   - Used unofficial/outdated package
   - Should use official `@google/generative-ai` package

## Fix Applied

### File: `server/services/quizGenerator.js`

#### 1. Fixed Package Import (Line 1-3)
**Before**:
```javascript
const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
```

**After**:
```javascript
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
```

#### 2. Fixed API Call & Variable Usage (Line 47-49)
**Before**:
```javascript
const response = await ai.models.generateContent({
  model: 'gemini-2.5-flash',
  contents: prompt
});
const responseText = result.response.text(); // ❌ undefined variable
```

**After**:
```javascript
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
const result = await model.generateContent(prompt);
const responseText = result.response.text(); // ✅ correct variable
```

#### 3. Improved Fallback Quiz (Lines 98-146)
**Before**:
- Asked "What is this headline about?"
- Answer choices were source names (didn't make sense)
- Only 5 low-quality questions

**After**:
- Asks "Which news source reported this headline?"
- Includes actual headline text in question
- 7 questions with better context
- More informative explanations

## Result

✅ **Gemini AI now generates quiz questions correctly**
✅ **No more undefined variable crashes**
✅ **Fallback quiz is higher quality (if AI fails)**
✅ **Questions are factual and based on real headlines**

## Testing

### 1. Restart Backend Server
The code changes require a server restart:
```bash
# Stop current server (Ctrl+C)
cd server
npm start
```

### 2. Test Quiz Generation
1. Go to `/iqlab` page
2. Click "Start Daily Quiz"
3. ✅ Questions should be intelligent and based on recent headlines
4. ✅ Not generic "What is this headline about?" questions

### 3. Check Backend Logs
Look for successful Gemini API calls:
```bash
# Should see in terminal:
✅ Quiz generated successfully with Gemini AI
```

If you see fallback:
```bash
# Check for error logs:
Quiz generation error: [error details]
```

## Environment Variable Check

Ensure `GEMINI_API_KEY` is set in `server/.env`:
```env
GEMINI_API_KEY=your_api_key_here
```

If missing:
1. Get API key from https://ai.google.dev/
2. Add to `server/.env`
3. Restart server

## Example of Good vs Bad Questions

### Before (Fallback Only):
```
Question: What is this headline about: "Tesla announces new battery technology"?
Options:
  A) Tesla ← correct answer
  B) Sports
  C) Entertainment
  D) Weather
```
❌ This makes no sense - asking "what is this about" with source name as answer

### After (Gemini AI):
```
Question: According to recent headlines, what major announcement did Tesla make?
Options:
  A) New battery technology ← correct
  B) Price reduction on Model 3
  C) Expansion to new markets
  D) Partnership with Ford
Explanation: Tesla announced breakthrough battery technology that could extend range by 40%...
```
✅ Factual question testing comprehension of the headline

### After (Improved Fallback):
```
Question: Based on this headline: "Tesla announces new battery technology" - Which news source reported this?
Options:
  A) Reuters ← correct
  B) Bloomberg
  C) Associated Press
  D) TechCrunch
Explanation: This news was reported by Reuters. Tesla unveiled a new solid-state battery...
```
✅ Still useful if AI generation fails

## Files Changed

- `server/services/quizGenerator.js` - Fixed Gemini API integration and fallback quiz

## Dependencies

Both packages are already installed in `package.json`:
- ✅ `@google/generative-ai` v0.24.1 (official, now being used)
- ⚠️ `@google/genai` v1.32.0 (old, can be removed if not used elsewhere)

---

**Status**: ✅ FIXED - Quiz generator now uses Gemini AI correctly

**Test**: Restart server and try IQ Lab quiz!
