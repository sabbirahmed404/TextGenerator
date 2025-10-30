# Sabbir's Application Generator

A React-based application generator that creates professional cold emails, cover letters, LinkedIn messages, and follow-up emails using AI (Claude API).

## Features

- 🎯 **Multiple Writing Types**: Cold emails, cover letters, LinkedIn messages, follow-up emails
- 💬 **Conversation Context**: LinkedIn messages support conversation history for contextual replies
- 🎨 **Customizable Tones**: Different tones for emails and LinkedIn messages
- 📏 **Flexible Word Limits**: Predefined options or custom limits (1-1000 words)
- 🎓 **Role-Based Presentation**: Automatically adjusts tone based on target position level
- ⚡ **Modern UI**: Built with React, Tailwind CSS, and Lucide icons

## Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn** or **pnpm**
- **Google Gemini API Key** (Get it from [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey))

## Installation

### 1. Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

Or if you prefer yarn:
```bash
yarn install
```

Or if you prefer pnpm:
```bash
pnpm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Then edit the `.env` file and add your Google Gemini API key:

```env
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

**Important**: Never commit your `.env` file to version control. It's already included in `.gitignore`.

## Running the Project

### Development Mode

Start the development server:

```bash
npm run dev
```

This will start the Vite dev server. Open your browser and navigate to:
```
http://localhost:5173
```

The app will automatically reload when you make changes to the code.

### Build for Production

Create an optimized production build:

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## Project Structure

```
Text Generator/
├── src/
│   ├── components/
│   │   └── InternshipAppGenerator.jsx    # Main React component
│   ├── data/
│   │   ├── profile.js                     # Profile data
│   │   └── constants.js                   # App constants
│   ├── utils/
│   │   └── promptGenerator.js             # Prompt generation logic
│   ├── App.jsx                            # Root component
│   ├── main.jsx                           # Entry point
│   ├── index.css                          # Global styles
│   └── README.md                          # Technical documentation
├── index.html                             # HTML template
├── package.json                           # Dependencies
├── vite.config.js                         # Vite configuration
├── tailwind.config.js                     # Tailwind CSS config
├── postcss.config.js                      # PostCSS config
├── .env.example                           # Environment variables template
├── .gitignore                             # Git ignore rules
└── README.md                              # This file
```

## Usage

1. **Select Writing Type**: Choose between cold email, cover letter, LinkedIn message, or follow-up email
2. **Choose Tone**: Select the appropriate tone for your message
3. **Fill in Details**:
   - For emails: Company name, role, job requirements (optional)
   - For LinkedIn: Person/company info, conversation context (optional)
4. **Set Word Limit**: Choose from predefined options or set a custom limit
5. **Generate**: Click the generate button (or press Ctrl/Cmd + Enter)
6. **Copy**: Use the copy button to copy the generated content

## Customization

### Update Profile Data

Edit `src/data/profile.js` to update:
- Personal information
- Skills and technical stack
- Projects and achievements
- Leadership experience
- Certifications

### Modify Prompts

Edit the prompt generator functions in `src/utils/promptGenerator.js`:
- `generateLinkedInPrompt()` - LinkedIn messages
- `generateColdEmailPrompt()` - Cold emails
- `generateCoverLetterPrompt()` - Cover letters
- `generateFollowUpPrompt()` - Follow-up emails

### Add New Writing Types

1. Add to `WRITING_TYPES` in `src/data/constants.js`
2. Create a prompt generator in `src/utils/promptGenerator.js`
3. Add case to `generateSystemPrompt()` switch statement

## Troubleshooting

### API Key Error
If you see "API key not found" error:
- Make sure you created a `.env` file
- Verify the API key is correctly set: `VITE_GEMINI_API_KEY=AIza...`
- Restart the dev server after adding the API key

### Port Already in Use
If port 5173 is already in use:
- Stop other Vite dev servers
- Or specify a different port: `npm run dev -- --port 3000`

### Tailwind CSS Not Working
If styles aren't loading:
- Make sure all dependencies are installed: `npm install`
- Check that `index.css` is imported in `main.jsx`
- Restart the dev server

### Build Errors
If you encounter build errors:
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`
- Try a fresh install

## Technologies Used

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Google Gemini 2.0 Flash** - AI text generation

## License

This is a personal project. Feel free to use it as a template for your own applications.

## Support

For issues or questions, please check:
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Google Gemini API Documentation](https://ai.google.dev/docs)
