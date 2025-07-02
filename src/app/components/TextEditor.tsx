'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { useEffect } from 'react';

interface TiptapEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const TiptapEditor = ({ value, onChange }: TiptapEditorProps) => {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: value || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Optional: Sync external value to editor if props change
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <div>
      <div className="toolbar">
        <button
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={editor?.isActive('bold') ? 'activeBtn' : ''}
        >
          B
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={editor?.isActive('italic') ? 'activeBtn' : ''}
        >
          I
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          className={editor?.isActive('underline') ? 'activeBtn' : ''}
        >
          U
        </button>
        <button onClick={() => editor?.chain().focus().toggleBulletList().run()}>
          • List
        </button>
        <button onClick={() => editor?.chain().focus().toggleOrderedList().run()}>
          1. List
        </button>
      </div>

      <div className="tiptapEditorWrapper">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default TiptapEditor;
