"use client";
import { useEffect, useRef, useState } from 'react';

interface ContextMenuProps {
  x: number;
  y: number;
  onBold: () => void;
  onClose: () => void;
}

const ContextMenu = ({ x, y, onBold, onClose }: ContextMenuProps) => {
  return (
    <div 
      className="fixed bg-white dark:bg-gray-700 shadow-lg rounded-lg py-2 min-w-[120px] z-50"
      style={{ left: x, top: y }}
    >
      <button
        className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600"
        onClick={() => {
          onBold();
          onClose();
        }}
      >
        Bold
      </button>
    </div>
  );
};

interface EditorContainerProps {
  isPreview: boolean;
  content: string;
  onContentChange: (content: string) => void;
}

export function EditorContainer({ isPreview, content, onContentChange }: EditorContainerProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [isSaved, setIsSaved] = useState(true);

  useEffect(() => {
    if (editorRef.current && isPreview) {
      const selection = window.getSelection();
      console.log("useEffect",selection);
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
          console.log("try restore caret position");
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenu && !(event.target as Element)?.closest('.context-menu')) {
        setContextMenu(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [contextMenu]);

  useEffect(() => {
    setIsSaved(false);
  }, [content]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      setContextMenu({ x: e.clientX, y: e.clientY });
    }
  };

  const handleBold = () => {
    document.execCommand('bold', false);
  };

  const handleContentChange = () => {
    if (!editorRef.current) return;
    console.log("handleContentChange", editorRef.current.innerHTML);
    onContentChange(editorRef.current.innerHTML);
    setIsSaved(true);
  };

  const sharedClassNames = `
    w-full h-[80vh] p-4 border rounded-lg
    bg-white dark:bg-gray-800
    border-gray-200 dark:border-gray-700
    focus:outline-none focus:ring-2 focus:ring-blue-500
  `;

  if (isPreview) {
    return (
      <>
        <div 
          ref={editorRef}
          contentEditable        
          suppressContentEditableWarning
          onContextMenu={handleContextMenu}
          className={`${sharedClassNames} overflow-auto`}
        />
        {contextMenu && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            onBold={handleBold}
            onClose={() => setContextMenu(null)}
          />
        )}
        <div className="flex justify-end mt-4">
          <button
            onClick={handleContentChange}
            disabled={isSaved}
            className={`
              px-4 py-2 rounded-md transition-colors
              ${isSaved 
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
                : 'bg-white-500 text-white hover:bg-white-600 dark:bg-white-600 dark:hover:bg-white-700'
              }
            `}
          >
            {isSaved ? 'Saved' : 'Save'}
          </button>
        </div>
      </>
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