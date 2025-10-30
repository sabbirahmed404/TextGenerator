# Application Generator - Modular Structure

This application has been refactored into a modular structure for better maintainability and separation of concerns.

## Directory Structure

```
src/
├── components/
│   └── InternshipAppGenerator.jsx    # Main React component
├── data/
│   ├── profile.js                     # Sabbir's profile data
│   └── constants.js                   # Application constants (writing types, tones, role levels)
├── utils/
│   └── promptGenerator.js             # Prompt generation logic for different writing types
└── README.md                          # This file
```

## File Descriptions

### `components/InternshipAppGenerator.jsx`
Main React component that handles:
- UI rendering
- State management
- User interactions
- API calls to Claude

### `data/profile.js`
Contains Sabbir's profile information:
- Personal details (name, email, phone, location)
- Education
- Current role
- Skills and technical stack
- Projects and achievements
- Leadership experience
- Certifications

### `data/constants.js`
Application constants including:
- **WRITING_TYPES**: Different types of applications (cold email, cover letter, LinkedIn message, follow-up)
- **ROLE_LEVELS**: Target position levels (intern, junior, senior, etc.)
- **TONES**: Available tones for emails and LinkedIn messages

### `utils/promptGenerator.js`
Prompt generation utilities:
- `generateLinkedInPrompt()`: Creates prompts for LinkedIn messages with conversation context
- `generateColdEmailPrompt()`: Creates prompts for cold emails
- `generateCoverLetterPrompt()`: Creates prompts for cover letters
- `generateFollowUpPrompt()`: Creates prompts for follow-up emails
- `generateSystemPrompt()`: Main function that routes to appropriate prompt generator

## Key Features

### Modular Prompts
Each writing type has its own dedicated prompt generator function with specific instructions and formatting rules.

### Conversation Context (LinkedIn)
LinkedIn messages support conversation history, allowing contextual replies to ongoing conversations.

### Flexible Word Limits
Each writing type has predefined word limit options, with support for custom limits (1-1000 words).

### Tone Customization
Different tones available for:
- **Emails**: Professional, Warm, Concise, Enthusiastic, Humble
- **LinkedIn**: Casual Professional, Conversational, Direct, Warm, Respectful

## Usage

Import the component in your app:

```jsx
import InternshipAppGenerator from './components/InternshipAppGenerator';

function App() {
  return <InternshipAppGenerator />;
}
```

## Customization

### Updating Profile Data
Edit `src/data/profile.js` to update personal information, skills, projects, etc.

### Adding New Writing Types
1. Add the new type to `WRITING_TYPES` in `src/data/constants.js`
2. Create a new prompt generator function in `src/utils/promptGenerator.js`
3. Add the case to the switch statement in `generateSystemPrompt()`

### Modifying Prompts
Edit the respective prompt generator functions in `src/utils/promptGenerator.js`:
- `generateLinkedInPrompt()` for LinkedIn messages
- `generateColdEmailPrompt()` for cold emails
- `generateCoverLetterPrompt()` for cover letters
- `generateFollowUpPrompt()` for follow-up emails

## API Configuration

The application uses Google Gemini 2.0 Flash API. The API key is configured via environment variables.

**Setup**:
1. Create a `.env` file in the root directory
2. Add your Gemini API key: `VITE_GEMINI_API_KEY=your_key_here`
3. Get your API key from: https://aistudio.google.com/app/apikey

The API is called in the `generateContent()` function in `InternshipAppGenerator.jsx`.
