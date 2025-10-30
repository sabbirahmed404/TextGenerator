# Migration to Google Gemini API

This document outlines the changes made to migrate from Anthropic Claude to Google Gemini 2.0 Flash.

## Changes Made

### 1. Environment Variables
- **Old**: `VITE_ANTHROPIC_API_KEY`
- **New**: `VITE_GEMINI_API_KEY`

### 2. API Endpoint
- **Old**: `https://api.anthropic.com/v1/messages`
- **New**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent`

### 3. Request Format

**Old (Anthropic Claude)**:
```javascript
{
  model: 'claude-sonnet-4-20250514',
  max_tokens: 2000,
  messages: [{
    role: 'user',
    content: systemPrompt
  }]
}
```

**New (Google Gemini)**:
```javascript
{
  contents: [{
    parts: [{
      text: systemPrompt
    }]
  }],
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 2000,
  }
}
```

### 4. Response Parsing

**Old (Anthropic)**:
```javascript
const content = data.content
  .filter(item => item.type === 'text')
  .map(item => item.text)
  .join('\n\n');
```

**New (Gemini)**:
```javascript
const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
```

### 5. Headers

**Old**:
```javascript
headers: {
  'Content-Type': 'application/json',
  'x-api-key': apiKey,
  'anthropic-version': '2023-06-01'
}
```

**New**:
```javascript
headers: {
  'Content-Type': 'application/json',
}
// API key is passed as URL parameter
```

## Files Modified

1. ✅ `.env.example` - Updated environment variable name and documentation
2. ✅ `.env` - Created with your Gemini API key
3. ✅ `src/components/InternshipAppGenerator.jsx` - Updated API integration
4. ✅ `README.md` - Updated all references to API provider
5. ✅ `QUICKSTART.md` - Updated quick start instructions
6. ✅ `src/README.md` - Updated technical documentation

## Model Information

- **Model**: `gemini-2.0-flash-exp`
- **Provider**: Google AI
- **Temperature**: 0.7 (for creative but controlled output)
- **Max Tokens**: 2000

## API Key

Your API key has been configured in `.env`:
```
VITE_GEMINI_API_KEY=AIzaSyBJ4AQwUYbIvMyHlJDqrZdk2w15bh9XXbo
```

⚠️ **Security Note**: The `.env` file is gitignored to prevent accidental commits of your API key.

## Testing

To test the migration:
1. Run `npm install` (if not already done)
2. Run `npm run dev`
3. Try generating different types of content
4. Verify the output quality matches expectations

## Rollback

If you need to rollback to Anthropic Claude:
1. Revert changes in `src/components/InternshipAppGenerator.jsx`
2. Update environment variable back to `VITE_ANTHROPIC_API_KEY`
3. Update documentation files

## Benefits of Gemini

- ✅ Competitive pricing
- ✅ Fast response times with Flash model
- ✅ Good quality output
- ✅ Simple API integration
- ✅ No version headers required
