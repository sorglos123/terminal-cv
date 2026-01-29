# CV Data Customization Guide

This directory contains the customizable CV data for your terminal-based CV application. All personal information is separated from the production code to make it easy for you to personalize your CV.

## Quick Start

1. **Edit `cv-content.js`** with your own information
2. **Save the file**
3. **Refresh your browser** - your changes will be reflected immediately!

## File Structure

```
data/
├── cv-content.js    # Your CV content (edit this!)
└── README.md        # This file
```

## Customization Instructions

### `cv-content.js`

This file contains all your CV data organized in a simple JavaScript object structure. Each section is clearly commented to help you understand what to customize.

#### Sections to Customize:

1. **`about`** - A brief professional summary (1-2 sentences)
   - Keep it concise and highlight your core expertise

2. **`experience`** - Your work history in reverse chronological order
   - Format: Date range, Position, Company, Location
   - Add bullet points for key achievements
   - Use consistent date format (MM/YYYY recommended)

3. **`education`** - Your educational background
   - Include degree, institution, dates, and notable achievements
   - Add thesis title if relevant

4. **`skills`** - Technical skills and certifications
   - Organize by category for better readability
   - List certifications at the end
   - Include tools, languages, and technologies

5. **`contact`** - Your contact information
   - Email, GitHub, LinkedIn, personal website, etc.
   - Keep it professional and current

### Tips for Best Results

- **Keep text concise**: Terminal displays work best with clear, concise content
- **Use consistent formatting**: Maintain the same date format and structure throughout
- **Test special characters**: Some characters may need escaping (like backticks)
- **Preserve the object structure**: Don't change the property names (about, experience, etc.)
- **Line length**: Keep lines under 80 characters when possible for better terminal display

### Example Customization

```javascript
const cvContent = {
    about: `Your name is a Software Engineer specializing in web development and cloud architecture.`,
    
    experience: `01/2023 – Present
Senior Developer
Your Company, City
- Led migration to microservices architecture
- Improved system performance by 40%
- Mentored team of 5 junior developers`,
    
    // ... continue with other sections
};
```

## How It Works

The application loads your CV data from this file and uses it to:
- Populate the virtual file system (accessible via commands like `cat`, `ls`, `cd`)
- Display information through various terminal commands
- Generate derived content (like bio summaries and highlights)

The production code in `src/js/data.js` imports this file and handles all the logic for presenting your data in the terminal interface.

## Need Help?

- Check the main [README.md](../README.md) for application features and commands
- Review the existing content as examples for formatting
- The application structure is designed to be intuitive - if you preserve the basic format, it will work!

## Version Control

If you're forking this project:
- Feel free to commit your customizations to your own repository
- Consider adding `data/cv-content.js` to `.gitignore` if you want to keep your CV data private while sharing code improvements

## Questions?

If you encounter issues or have questions about customization, please check the main repository documentation or open an issue on GitHub.
