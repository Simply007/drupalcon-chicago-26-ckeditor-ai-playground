# PROMPT: Create a Drupal CKEditor 5 Plugin Module

## Task Description

Create a new Drupal module that extends CKEditor 5 with a custom plugin. The module should follow Drupal coding standards and integrate properly with CKEditor 5's DLL architecture.

## Original Prompt Used

> I would like to register a new module for Drupal based on the https://www.drupal.org/docs/develop/creating-modules information. I would like the module to be a CKEditor plugin https://ckeditor.com/docs/ckeditor5/latest/framework/tutorials/creating-simple-plugin-timestamp.html
>
> Use the Context7 MCP to get more information about the CKEditor.
>
> I already have CKEditor 5 plugin pack installed.
> If you are not sure, ask me.

## Requirements Gathered

After clarification questions, the following was determined:

| Requirement | Value |
|-------------|-------|
| Plugin Function | Insert timestamp (current date/time at cursor) |
| Module Name | `ckeditor5_timestamp` |
| UI Type | Toolbar button |
| Configuration | None (static behavior) |

## Expected Outputs

### Files Created

1. **`ckeditor5_timestamp.info.yml`**
   - Module metadata for Drupal

2. **`ckeditor5_timestamp.ckeditor5.yml`**
   - CKEditor 5 plugin definition
   - Toolbar item configuration

3. **`ckeditor5_timestamp.libraries.yml`**
   - JavaScript library definition
   - Dependency on `core/ckeditor5`

4. **`js/build/timestamp.js`**
   - Bundled UMD JavaScript plugin
   - Exports to `CKEditor5.timestamp` namespace

5. **`js/ckeditor5_plugins/timestamp/src/index.js`**
   - Source ES module (for reference/development)

6. **`src/Plugin/CKEditor5Plugin/Timestamp.php`**
   - PHP plugin class

### Post-Installation Steps

```bash
# Enable the module
drush en ckeditor5_timestamp

# Clear cache
drush cr

# Configure text format
# Go to /admin/config/content/formats
# Edit a text format using CKEditor 5
# Add "Timestamp" button to toolbar
# Save
```

## Customization Points

To adapt this prompt for different plugins, modify:

### Plugin Behavior
```javascript
button.on('execute', () => {
  // Change this logic for different functionality
  const now = new Date();
  editor.model.change((writer) => {
    editor.model.insertContent(writer.createText(now.toString()));
  });
});
```

### Button Appearance
```javascript
button.set({
  label: 'Timestamp',      // Change label
  withText: true,          // true = text label, false = icon only
  tooltip: true,           // Show tooltip on hover
  // icon: svgIcon,        // Add custom SVG icon
});
```

### Module Naming
Replace all instances of:
- `ckeditor5_timestamp` (module name)
- `timestamp` (plugin namespace)
- `Timestamp` (class name)

## Usage Instructions

### For Claude Code Users

1. **Install Claude Code**: https://docs.anthropic.com/en/docs/claude-code

2. **Place files in your Drupal installation**:
   - Copy `SKILL.md` to your project or Claude Code memory
   - Adjust `PROMPT.md` with your specific requirements

3. **Run the prompt**:
   ```
   Please create a CKEditor 5 plugin for Drupal following the SKILL.md approach.

   My requirements:
   - Plugin function: [describe what it should do]
   - Module name: [your_module_name]
   - UI type: [toolbar button / context menu / etc.]
   ```

4. **Enable and configure**:
   ```bash
   drush en your_module_name
   drush cr
   ```
   Then configure the text format in Drupal admin.

## Troubleshooting

### Common Issues Encountered

1. **"Cannot use import statement outside a module"**
   - Solution: Use bundled UMD version, not ES modules
   - The `js/build/` directory must contain the bundled plugin

2. **Plugin not found after enabling**
   - Solution: Clear all caches with `drush cr`
   - Verify `.ckeditor5.yml` plugin reference matches JS export

3. **Toolbar button doesn't appear**
   - Solution: Configure the text format to include the button
   - Go to `/admin/config/content/formats` and edit the format

## Version Information

- **Drupal**: 11.3.3
- **CKEditor 5**: Bundled with Drupal core
- **PHP**: 8.x
- **Claude Code**: Latest

## References

- Drupal Module Creation: https://www.drupal.org/docs/develop/creating-modules
- CKEditor 5 Plugin Tutorial: https://ckeditor.com/docs/ckeditor5/latest/framework/tutorials/creating-simple-plugin-timestamp.html
- CKEditor DLL Architecture: https://ckeditor.com/blog/ckeditor-14-updates-to-move-faster/
- Import Maps Discussion: https://github.com/ckeditor/ckeditor5/issues/15739
