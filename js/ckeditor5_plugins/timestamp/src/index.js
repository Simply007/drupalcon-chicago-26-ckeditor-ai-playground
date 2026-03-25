import { Plugin } from 'ckeditor5/src/core';
import { ButtonView } from 'ckeditor5/src/ui';

class Timestamp extends Plugin {
  init() {
    const editor = this.editor;

    // Register the 'timestamp' button in the editor's UI component factory.
    editor.ui.componentFactory.add('timestamp', (locale) => {
      const button = new ButtonView(locale);

      button.set({
        label: 'Timestamp',
        withText: true,
        tooltip: true,
      });

      // Execute the timestamp insertion when the button is clicked.
      button.on('execute', () => {
        const now = new Date();

        // Insert the timestamp at the current cursor position.
        editor.model.change((writer) => {
          editor.model.insertContent(writer.createText(now.toString()));
        });

        // Return focus to the editor.
        editor.editing.view.focus();
      });

      return button;
    });
  }

  static get pluginName() {
    return 'Timestamp';
  }
}

export default {
  Timestamp,
};
