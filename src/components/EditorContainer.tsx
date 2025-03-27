"use client";
import { useEffect, useRef } from 'react';

interface EditorContainerProps {
  isPreview: boolean;
  content: string;
  onContentChange: (content: string) => void;
}

export function EditorContainer({ isPreview, content, onContentChange }: EditorContainerProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && isPreview) {
      const selection = window.getSelection();
      let offset = 0;

      // Only try to get range if there is a selection and it has ranges
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        offset = range.startOffset;
      }
      
      editorRef.current.innerHTML = content;
      
      // Only try to restore caret if there was a valid selection
      if (selection && selection.rangeCount > 0) {
        try {
          const newRange = document.createRange();
          const textNode = editorRef.current.firstChild || editorRef.current;
          const maxOffset = (textNode.textContent || '').length;
          
          newRange.setStart(textNode, Math.min(offset, maxOffset));
          newRange.setEnd(textNode, Math.min(offset, maxOffset));
          
          selection.removeAllRanges();
          selection.addRange(newRange);
        } catch (e) {
          console.error('Failed to restore caret position:', e);
        }
      }
    }
  }, [content, isPreview]);


  const handleContentChange = () => {
    if (!editorRef.current) return;
    onContentChange(editorRef.current.innerHTML);
  };

  const sharedClassNames = `
    w-full h-[80vh] p-4 border rounded-lg
    bg-white dark:bg-gray-800
    border-gray-200 dark:border-gray-700
    focus:outline-none focus:ring-2 focus:ring-blue-500
  `;

  if (isPreview) {
    return (
      <div 
        ref={editorRef}
        contentEditable
        onInput={handleContentChange}
        suppressContentEditableWarning
        className={`${sharedClassNames} overflow-auto`}
      />
    );
  }

  return (
    <textarea
      value={content}
      onChange={(e) => onContentChange(e.target.value)}
      className={`${sharedClassNames} font-mono text-sm`}
      placeholder="File content will appear here..."
    />
  );
} 