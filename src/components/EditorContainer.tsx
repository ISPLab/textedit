"use client";
import { useEffect, useRef, useState } from 'react';

interface EditorContainerProps {
  isPreview: boolean;
  content: string;
  onContentChange: (content: string) => void;
}

const CursorPositionDisplay = ({ position }: { position: number }) => {
  return (
    <div className="fixed bottom-4 right-4 flex gap-2 items-center bg-gray-100 p-2 rounded shadow-md z-50">
      <span className="text-sm text-gray-600">
        Cursor: {position}
      </span>
      <button
        onClick={() => setCursorPosition(10)}
        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
      >
        Set to 10
      </button>
    </div>
  );
};

export function EditorContainer({ isPreview, content, onContentChange }: EditorContainerProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [caretPosition, setCaretPosition] = useState(0);

  useEffect(() => {
    if (editorRef.current && isPreview) {
      const selection = window.getSelection();
      let offset = 0;

      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        offset = range.startOffset;
      }
      
      editorRef.current.innerHTML = content;
      
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

  const setCursorPosition = (position: number) => {
    if (!textareaRef.current) return;
    textareaRef.current.focus();
    textareaRef.current.setSelectionRange(position, position);
    setCaretPosition(position);
  };

  const handleSelectionChange = () => {
    if (!textareaRef.current) return;
    setCaretPosition(textareaRef.current.selectionStart);
  };

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
      <div>
        <div 
          ref={editorRef}
          contentEditable
          onInput={handleContentChange}
          suppressContentEditableWarning
          className={`${sharedClassNames} overflow-auto`}
        />
        <CursorPositionDisplay position={caretPosition} />
      </div>
    );
  }

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        onSelect={handleSelectionChange}
        className={`${sharedClassNames} font-mono text-sm`}
        placeholder="File content will appear here..."
      />
      <CursorPositionDisplay position={caretPosition} />
    </div>
  );
} 