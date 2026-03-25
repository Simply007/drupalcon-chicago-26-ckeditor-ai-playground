# DrupalCon Chicago 2026

## How I Vibe-Coded My First Custom Module Extending CKEditor Plugin Pack Without Writing a Single Line of Code

### Lightning Talk by Ondrej Chrastina

---

## The Story

I'm Ondrej Chrastina, and I was at DrupalCon handling the CKEditor booth, speaking at the AI Summit, and giving a Lightning Talk about new features in the official CKEditor contrib modules.

During my time at the conference, I had countless conversations with people who wanted to:
- Customize CKEditor just a little bit
- Extend it with their own functionality
- Add something specific to their workflow
- But they weren't sure how to start

So I sat down with **Wojtek Kukowski**, the main maintainer of the CKEditor Drupal integration, and asked him: *"What's actually necessary to make this happen?"*

He briefed me on the requirements, and I thought: *"Let me try to translate this into a prompt for Claude Code and see what happens."*

---

## The Experiment

### Setup
- **Drupal**: 11.3.3
- **Tool**: Claude Code (https://docs.anthropic.com/en/docs/claude-code)
- **Goal**: Create a CKEditor 5 plugin module from scratch

### The Prompt (Almost Too Simple)

> I would like to register a new module for Drupal based on the https://www.drupal.org/docs/develop/creating-modules information. I would like the module to be a CKEditor plugin https://ckeditor.com/docs/ckeditor5/latest/framework/tutorials/creating-simple-plugin-timestamp.html
>
> If you are not sure, ask me.

### What Happened

1. **Claude explored the codebase** - Found existing CKEditor modules (Linkit, AI CKEditor) and learned from their patterns

2. **Claude asked clarifying questions**:
   - What should the plugin do? (Insert timestamp)
   - What should the module be called? (ckeditor5_timestamp)
   - Toolbar button or context menu? (Toolbar button)

3. **Claude created all the files**:
   - `ckeditor5_timestamp.info.yml`
   - `ckeditor5_timestamp.ckeditor5.yml`
   - `ckeditor5_timestamp.libraries.yml`
   - `js/ckeditor5_plugins/timestamp/src/index.js`
   - `src/Plugin/CKEditor5Plugin/Timestamp.php`

4. **Time**: A couple of minutes

---

## The Gotcha (There's Always One)

### The Error
```
Uncaught SyntaxError: Cannot use import statement outside a module
Failed to load timestamp - Timestamp
```

### The Problem
Drupal's CKEditor 5 uses a **DLL (Dynamic Link Library) pattern**. Raw ES modules don't work - plugins must be bundled in UMD format that exports to the `CKEditor5.[pluginname]` namespace.

### Why This Matters
- Until **import maps** are supported in Drupal, you need minified/bundled JavaScript
- See: https://ckeditor.com/blog/ckeditor-14-updates-to-move-faster/#developer-experience-improvements
- Discussion: https://github.com/ckeditor/ckeditor5/issues/15739

### The Fix
Claude created a properly bundled version in `js/build/timestamp.js` and updated the library configuration.

**Total additional time**: About 2 minutes

---

## The Result

### What You Get

Two files that can help you extend CKEditor:

1. **SKILL.md** - A comprehensive guide teaching Claude Code how to:
   - Explore existing CKEditor implementations
   - Ask the right clarifying questions
   - Create all necessary files
   - Handle the DLL bundling requirement
   - Troubleshoot common issues

2. **PROMPT.md** - A template you can customize:
   - Replace the plugin requirements with yours
   - Specify your module name
   - Define the UI type you need

### How to Use It

1. **Install Claude Code**: https://docs.anthropic.com/en/docs/claude-code

2. **Put the files in your Drupal project**

3. **Adjust PROMPT.md** with your requirements:
   ```
   - Plugin function: [what should it do?]
   - Module name: [your_module_name]
   - UI type: [toolbar button / context menu / etc.]
   ```

4. **Ask Claude to run it**:
   > Please create a CKEditor 5 plugin for Drupal following the SKILL.md approach using the requirements in PROMPT.md

5. **Enable and configure**:
   ```bash
   drush en your_module_name
   drush cr
   ```

---

## Call to Action

### Try It Yourself!

My plugin was straightforward - a simple timestamp inserter. I'm very curious how it works for you with more complex requirements!

### Share Your Experience

- Did it work on the first try?
- What gotchas did you encounter?
- How complex was your plugin?

### Find Me

- At the CKEditor booth
- On the conference Slack
- [Your contact info here]

---

## Resources

### Links
- **Claude Code**: https://docs.anthropic.com/en/docs/claude-code
- **Drupal Module Creation**: https://www.drupal.org/docs/develop/creating-modules
- **CKEditor 5 Plugin Tutorial**: https://ckeditor.com/docs/ckeditor5/latest/framework/tutorials/creating-simple-plugin-timestamp.html
- **CKEditor DLL Architecture**: https://ckeditor.com/blog/ckeditor-14-updates-to-move-faster/

### MCP Tools Used
- **Context7**: For CKEditor documentation lookup
- **WebFetch**: For Drupal documentation
- **Explore Agent**: For codebase analysis

### The Module
Available at: `web/modules/custom/ckeditor5_timestamp/`

Including:
- `assets/SKILL.md` - The skill file
- `assets/PROMPT.md` - The prompt template
- `assets/OUTLINE.md` - This talk outline

---

## Q&A

*Let me know what you did and how it went!*
