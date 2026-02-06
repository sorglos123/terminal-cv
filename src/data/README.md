# CV Data Customization Guide

This directory contains the customizable CV data for your terminal-based CV application. All personal information is separated from the production code to make it easy for you to personalize your CV.

## Quick Start

1. **Edit `cv-content.js`** with your CV information
2. **Edit `projects-content.js`** with your projects and publications
3. **Save the files**
4. **Refresh your browser** - your changes will be reflected immediately!

## File Structure

```
data/
├── cv-content.js       # Your CV content (edit this!)
├── projects-content.js # Your projects and publications (edit this!)
└── README.md           # This file
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

### `projects-content.js`

This file contains your projects, publications, blog posts, and other work you want to showcase. Each project is an object in an array with the following properties:

#### Project Properties:

1. **`filename`** (required) - The filename used in the terminal path
   - Example: `'my-project.md'` will be accessible at `/projects/my-project.md`
   - Use descriptive, lowercase filenames with hyphens

2. **`title`** (required) - The full title of your project or article
   - This is displayed when viewing the project

3. **`author`** (required) - Your name or the author's name
   - Typically your own name

4. **`publishedOn`** (required) - Where the project was published
   - Examples: "GitHub", "Veeam Community", "Personal Blog", "Medium"

5. **`url`** (required) - External URL to the project or article
   - Full URL including https://
   - Opens when user runs `open` or `xdg-open` command

6. **`description`** (optional) - Additional details about the project
   - Leave empty (`''`) if not needed
   - Provide context or key takeaways

#### Example Project Entry:

```javascript
{
    filename: 'kubernetes-automation.md',
    title: 'Automating Kubernetes Deployments with GitOps',
    author: 'Your Name',
    publishedOn: 'Dev.to',
    url: 'https://dev.to/yourname/kubernetes-automation',
    description: 'A comprehensive guide to implementing GitOps workflows'
}
```

#### Adding a New Project:

1. Copy an existing project object
2. Update all the properties with your project information
3. Add a comma after the previous project entry
4. Save the file - the project will automatically appear in `/projects/`

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

The application loads your CV data and projects from these configuration files:
- **cv-content.js** provides the core CV data (about, experience, education, skills, contact)
- **projects-content.js** provides your projects and publications

The data is used to:
- Populate the virtual file system (accessible via commands like `cat`, `ls`, `cd`)
- Display information through various terminal commands
- Generate derived content (like bio summaries and highlights)
- Create browsable project entries at `/projects/`

The production code in `src/js/data.js` handles all the logic for presenting your data in the terminal interface.

## Need Help?

- Check the main [README.md](../../README.md) for application features and commands
- Review the existing content as examples for formatting
- The application structure is designed to be intuitive - if you preserve the basic format, it will work!

## Version Control

If you're forking this project:
- Feel free to commit your customizations to your own repository
- Consider adding `data/cv-content.js` and `data/projects-content.js` to `.gitignore` if you want to keep your data private while sharing code improvements

## Questions?

If you encounter issues or have questions about customization, please check the main repository documentation or open an issue on GitHub.
