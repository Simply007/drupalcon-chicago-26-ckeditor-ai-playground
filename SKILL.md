# SKILL: Extending CKEditor 5 with Custom Plugins in Drupal

## Overview

This skill teaches Claude Code how to create a Drupal module that extends CKEditor 5 with a custom plugin. It covers the complete workflow from understanding requirements to implementing a working plugin.

## Prerequisites

- **Drupal**: 10.1+ or 11.x
- **CKEditor 5**: Integrated via Drupal core
- **Composer**: For dependency management
- **Drush**: For module management and cache clearing

## Exploration Strategy

### 1. Understand the Codebase

Before creating a new CKEditor plugin, explore existing implementations:

```
Search for patterns in:
- web/modules/contrib/*/  - Look for modules with .ckeditor5.yml files
- web/modules/custom/*/   - Check existing custom CKEditor integrations
```

**Key files to examine:**
- `*.info.yml` - Module metadata structure
- `*.ckeditor5.yml` - CKEditor 5 plugin definition format
- `*.libraries.yml` - JavaScript library configuration
- `js/ckeditor5_plugins/*/src/index.js` - Plugin JavaScript structure
- `src/Plugin/CKEditor5Plugin/*.php` - PHP plugin classes

### 2. Use MCP Tools

**Context7** - For CKEditor 5 documentation:
```
mcp__context7__resolve-library-id
  libraryName: "ckeditor5"
  query: "Creating a CKEditor 5 plugin for Drupal integration"

mcp__context7__query-docs
  libraryId: "/ckeditor/ckeditor5"
  query: "How to create a simple plugin with a button that inserts content"
```

**WebFetch** - For Drupal documentation:
```
url: https://www.drupal.org/docs/develop/creating-modules
prompt: "Extract module structure, .info.yml format, naming conventions"
```

### 3. Clarification Questions

Ask the user to specify:

1. **Plugin Function** - What should the plugin do?
   - Insert content (text, timestamp, snippet)
   - Apply formatting (custom styles)
   - Open dialog (for user input)
   - Custom block/widget

2. **Module Name** - Machine name (lowercase, underscores)
   - Example: `ckeditor5_timestamp`, `ckeditor5_snippet_inserter`

3. **UI Type** - How users interact:
   - Toolbar button
   - Context menu
   - Balloon toolbar
   - Keyboard shortcut

4. **Configuration** - Does it need admin settings?
   - Static behavior (no config)
   - Configurable per text format
   - Global settings

## Module Structure

```
web/modules/custom/{module_name}/
├── {module_name}.info.yml          # Module metadata
├── {module_name}.ckeditor5.yml     # CKEditor plugin definition
├── {module_name}.libraries.yml     # JS library definition
├── js/
│   ├── ckeditor5_plugins/
│   │   └── {plugin_name}/
│   │       └── src/
│   │           └── index.js        # Source (for development)
│   └── build/
│       └── {plugin_name}.js        # Bundled (for production) **REQUIRED**
└── src/
    └── Plugin/
        └── CKEditor5Plugin/
            └── {PluginName}.php    # PHP plugin class
```

## File Templates

### 1. {module_name}.info.yml

```yaml
name: 'CKEditor 5 {Plugin Name}'
type: module
description: 'Adds a CKEditor 5 plugin that {description}.'
package: CKEditor
core_version_requirement: '^10.1 || ^11'
```

### 2. {module_name}.ckeditor5.yml

```yaml
{module_name}_{plugin_id}:
  ckeditor5:
    plugins:
      - {namespace}.{PluginClass}
  drupal:
    label: {Plugin Label}
    library: {module_name}/{library_name}
    toolbar_items:
      {toolbar_id}:
        label: {Button Label}
    elements: false
```

### 3. {module_name}.libraries.yml

```yaml
{library_name}:
  js:
    js/build/{plugin_name}.js: { minified: true }
  dependencies:
    - core/ckeditor5
```

### 4. JavaScript Plugin (Source - index.js)

```javascript
import { Plugin } from 'ckeditor5/src/core';
import { ButtonView } from 'ckeditor5/src/ui';

class {PluginClass} extends Plugin {
  init() {
    const editor = this.editor;

    editor.ui.componentFactory.add('{toolbar_id}', (locale) => {
      const button = new ButtonView(locale);

      button.set({
        label: '{Button Label}',
        withText: true,
        tooltip: true,
      });

      button.on('execute', () => {
        // Plugin logic here
        editor.model.change((writer) => {
          editor.model.insertContent(writer.createText('content'));
        });
        editor.editing.view.focus();
      });

      return button;
    });
  }

  static get pluginName() {
    return '{PluginClass}';
  }
}

export default {
  {PluginClass},
};
```

### 5. JavaScript Plugin (Bundled - REQUIRED for Drupal)

**CRITICAL**: Drupal's CKEditor 5 uses a DLL (Dynamic Link Library) pattern. Raw ES modules will fail with:
```
Uncaught SyntaxError: Cannot use import statement outside a module
```

The bundled version must:
- Use UMD (Universal Module Definition) format
- Export to `CKEditor5.{namespace}` global
- Reference `CKEditor5.dll` for core imports

```javascript
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.CKEditor5=t():(e.CKEditor5=e.CKEditor5||{},e.CKEditor5.{namespace}=t())}(self,(function(){return function(){var e={"ckeditor5/src/core.js":function(e,t,n){e.exports=n("dll-reference CKEditor5.dll")("./src/core.js")},"ckeditor5/src/ui.js":function(e,t,n){e.exports=n("dll-reference CKEditor5.dll")("./src/ui.js")},"dll-reference CKEditor5.dll":function(e){"use strict";e.exports=CKEditor5.dll}},t={};function n(r){var o=t[r];if(void 0!==o)return o.exports;var i=t[r]={exports:{}};return e[r](i,i.exports,n),i.exports}n.d=function(e,t){for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)};var r={};return function(){"use strict";n.d(r,{default:function(){return s}});var e=n("ckeditor5/src/core.js"),t=n("ckeditor5/src/ui.js");class o extends e.Plugin{init(){const e=this.editor;e.ui.componentFactory.add("{toolbar_id}",n=>{const r=new t.ButtonView(n);return r.set({label:"{Button Label}",withText:!0,tooltip:!0}),r.on("execute",()=>{/* plugin logic */e.editing.view.focus()}),r})}static get pluginName(){return"{PluginClass}"}}const s={{PluginClass}:o}}(),r=r.default}()}));
```

### 6. PHP Plugin Class

```php
<?php

declare(strict_types=1);

namespace Drupal\{module_name}\Plugin\CKEditor5Plugin;

use Drupal\ckeditor5\Plugin\CKEditor5PluginDefault;

/**
 * CKEditor 5 {Plugin Name} plugin.
 */
class {PluginClass} extends CKEditor5PluginDefault {

}
```

## Common Plugin Types

### Insert Content
- Timestamp, date picker
- Snippets, templates
- Special characters, emoji
- Media embeds

### Formatting
- Custom styles
- Highlight colors
- Block formatting

### Interactive
- Dialog with form inputs
- External content fetcher
- AI assistance

## Troubleshooting

### "Cannot use import statement outside a module"
**Cause**: Using ES module source instead of bundled UMD
**Solution**: Create bundled version in `js/build/` directory, update libraries.yml to point to it

### "plugincollection-plugin-not-found"
**Cause**: Plugin namespace mismatch
**Solution**: Ensure `.ckeditor5.yml` plugin reference matches the export in JavaScript

### Plugin not appearing in toolbar
**Cause**: Module not enabled or cache not cleared
**Solution**:
```bash
drush en {module_name}
drush cr
```

### Button appears but doesn't work
**Cause**: JavaScript error in plugin logic
**Solution**: Check browser console, verify model.change() usage

## Resources

### Drupal
- [Creating Modules](https://www.drupal.org/docs/develop/creating-modules)
- [CKEditor 5 Module Development](https://www.drupal.org/docs/core-modules-and-themes/core-modules/ckeditor-5-module)

### CKEditor 5
- [Creating Simple Plugin Tutorial](https://ckeditor.com/docs/ckeditor5/latest/framework/tutorials/creating-simple-plugin-timestamp.html)
- [Plugin Development Guide](https://ckeditor.com/docs/ckeditor5/latest/framework/architecture/plugins.html)
- [DLL Build Updates](https://ckeditor.com/blog/ckeditor-14-updates-to-move-faster/#developer-experience-improvements)
- [Import Maps Discussion](https://github.com/ckeditor/ckeditor5/issues/15739)

### MCP Tools Used
- **Context7**: `mcp__context7__resolve-library-id`, `mcp__context7__query-docs`
- **WebFetch**: For fetching documentation pages
- **Explore Agent**: For codebase exploration

## Version Compatibility

| Drupal Version | CKEditor 5 | Notes |
|----------------|------------|-------|
| 10.1+ | Bundled | DLL pattern required |
| 11.x | Bundled | DLL pattern required |
| Future | TBD | Import maps may simplify |
