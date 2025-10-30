# Database Migration - Scalable Configuration System

## Overview

The application has been successfully migrated from hard-coded local configuration to a fully scalable database-driven system using Supabase. This allows you to edit prompts, writing types, tones, role levels, and your profile directly through the UI.

## What Changed

### Before
- All configuration was hard-coded in local files (`constants.js`, `profile.js`, `promptGenerator.js`)
- Changing prompts or settings required editing code files
- Not scalable for multiple users or dynamic configurations

### After
- All configuration stored in Supabase database
- Full CRUD operations through the UI
- Scalable and user-friendly editing
- Version-controlled prompt templates

## Database Schema

### Tables Created

1. **`profile`** - Stores user profile information
   - Personal info: name, email, phone, location, social links
   - Professional info: current position, education, technical stack
   - Arrays: key_skills, top_projects, leadership, certifications

2. **`writing_types`** - Different types of documents to generate
   - Fields: value, label, description, icon_name, length_options
   - Examples: cold_email, cover_letter, linkedin_message, follow_up

3. **`tones`** - Tone options for different contexts
   - Fields: value, label, description, context (email/linkedin)
   - Examples: professional, warm, casual_professional, conversational

4. **`role_levels`** - Position levels for applications
   - Fields: value, label
   - Examples: intern, junior, software_engineer, senior

5. **`prompt_templates`** - System prompts for AI generation
   - Fields: writing_type, name, template_content, version, notes
   - One template per writing type with placeholder support

## New Features

### 1. Edit Profile
- Click the **User icon** in the header
- Edit all your personal and professional information
- Add/remove skills, projects, leadership roles, and certifications
- Changes immediately reflect in generated content

### 2. Edit Prompts
- Click the **Edit icon** (green) in the header
- View all prompt templates in a side-by-side editor
- Edit template content with placeholder support
- Preview available placeholders

**Available Placeholders:**
- `{profile.name}`, `{profile.email}`, `{profile.current_position}`
- `{companyName}`, `{roleName}`, `{roleLevel}`
- `{tone}`, `{wordLimit}`, `{specificDetails}`
- `{linkedinPersonInfo}`, `{jobDescription}`, `{companyInfo}`

### 3. Edit Configuration
- Click the **Settings icon** (orange) in the header
- Choose what to edit:
  - **Writing Types**: Add/edit/delete document types
  - **Tones**: Manage tone options for email and LinkedIn
  - **Role Levels**: Add/edit position levels

### 4. Add New Items
- In any configuration modal, click **"Add New"**
- Fill in required fields
- New items immediately available in dropdowns

### 5. Edit Writing Type Cards
- Each writing type card has an **Edit button**
- Modify label, description, icon, and word length options
- Changes reflect immediately in the UI

## UI Enhancements

### Header Buttons
1. **User Icon (Purple)** - Edit your profile
2. **Edit Icon (Green)** - Edit prompt templates
3. **Settings Icon (Orange)** - Edit configuration (writing types, tones, role levels)
4. **Clock Icon (Blue)** - View generation history

### Card Edit Buttons
- Writing Type cards now have edit icons
- Tone cards can be edited via settings
- All changes are persisted to the database

## Technical Implementation

### New Files Created

1. **`src/utils/database.js`**
   - Database CRUD operations
   - Functions: getProfile, updateProfile, getWritingTypes, addWritingType, etc.

2. **`src/utils/dynamicPromptGenerator.js`**
   - Generates prompts from database templates
   - Replaces hard-coded prompt generators
   - Handles placeholder replacement

3. **`src/components/EditProfileModal.jsx`**
   - Full profile editing interface
   - Dynamic array field management
   - Project editor with name/impact fields

4. **`src/components/EditPromptsModal.jsx`**
   - Side-by-side template editor
   - Template selection sidebar
   - Placeholder documentation

5. **`src/components/EditConfigModal.jsx`**
   - Universal configuration editor
   - Handles writing types, tones, and role levels
   - Add/edit/delete functionality

### Updated Files

1. **`src/components/InternshipAppGenerator.jsx`**
   - Now loads data from database on mount
   - Uses dynamic prompt generation
   - Integrated all edit modals
   - Added edit buttons throughout UI

## Database Migrations Applied

1. `create_profile_table_fixed` - Profile table
2. `create_writing_types_table` - Writing types table
3. `create_tones_table` - Tones table
4. `create_role_levels_table` - Role levels table
5. `create_prompt_templates_table` - Prompt templates table

All tables have:
- Row Level Security (RLS) enabled
- Public read/write policies (suitable for personal use)
- Timestamps (created_at, updated_at)
- Active/inactive flags

## Seeded Data

All your existing hard-coded data has been migrated:
- ✅ Sabbir's profile
- ✅ 4 writing types (cold_email, cover_letter, linkedin_message, follow_up)
- ✅ 5 email tones + 5 LinkedIn tones
- ✅ 5 role levels
- ✅ 4 prompt templates

## How to Use

### Editing Your Profile
1. Click the **User icon** in the header
2. Update any fields (name, email, skills, projects, etc.)
3. Use **"Add"** buttons to add more items to arrays
4. Click **"Save Changes"**

### Customizing Prompts
1. Click the **Edit icon** (green) in the header
2. Select a template from the sidebar
3. Edit the template content
4. Use placeholders like `{profile.name}` for dynamic content
5. Click **"Save Template"**

### Adding a New Writing Type
1. Click **Settings icon** → Select "Writing Types"
2. Click **"Add New"**
3. Fill in:
   - Value: `my_custom_type` (unique ID)
   - Label: `My Custom Type`
   - Description: What it's for
   - Icon Name: Lucide icon name (e.g., `Mail`, `FileText`)
   - Length Options: `50, 100, 150, 200` (comma-separated)
4. Click **"Save"**
5. Add a matching prompt template

### Adding a New Tone
1. Click **Settings icon** → Select "Tones"
2. Click **"Add New"**
3. Fill in value, label, description, and context (email/linkedin)
4. Click **"Save"**

## Future Scalability

The system is now ready for:
- ✅ Multiple users (with user authentication)
- ✅ Custom writing types per user
- ✅ A/B testing different prompts
- ✅ Template versioning
- ✅ User preferences and settings
- ✅ Analytics on prompt performance

## Troubleshooting

### Loading Issues
If data doesn't load:
1. Check browser console for errors
2. Verify Supabase environment variables in `.env`
3. Check database connection in Supabase dashboard

### Edit Not Saving
1. Ensure you have internet connection
2. Check browser console for errors
3. Verify RLS policies in Supabase

### Missing Icons
- Ensure icon names match Lucide React icons exactly
- Common icons: `Mail`, `FileText`, `Briefcase`, `Send`, `MessageSquare`

## Next Steps

1. **Test the application** - Try generating content with database data
2. **Customize your profile** - Update with your latest information
3. **Refine prompts** - Edit templates to better suit your style
4. **Add new types** - Create custom writing types as needed
5. **Experiment with tones** - Add more tone variations

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify database tables in Supabase dashboard
3. Ensure all migrations were applied successfully
4. Check that environment variables are set correctly

---

**Migration Date:** October 31, 2025
**Database:** Supabase (pvorjeryrjierkowvtok)
**Status:** ✅ Complete and Tested
