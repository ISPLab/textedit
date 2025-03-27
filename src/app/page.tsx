"use client";
import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [fileContent, setFileContent] = useState("");
  const [isPreview, setIsPreview] = useState(true);
  const editorRef = useRef<HTMLDivElement>(null);

  const handleFileLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setFileContent(content);
    };
    reader.readAsText(file);
  };

  // Синхронизируем содержимое редактора с состоянием
  useEffect(() => {
    if (editorRef.current && isPreview) {
      const selection = window.getSelection();
      const range = selection?.getRangeAt(0);
      const offset = range?.startOffset || 0;
      
      editorRef.current.innerHTML = fileContent;
      
      if (range && selection) {
        try {
          // Пытаемся восстановить позицию каретки
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
  }, [fileContent, isPreview]);

  const handleContentChange = (event: React.FormEvent<HTMLDivElement>) => {
    if (!editorRef.current) return;
    setFileContent(editorRef.current.innerHTML);
  };

  return (
    <div className="min-h-screen p-8">
      <main className="max-w-4xl mx-auto space-y-4">
        <div className="flex gap-4 items-center">
          <input
            type="file"
            accept=".html,.htm"
            onChange={handleFileLoad}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-foreground file:text-background
              hover:file:bg-[#383838]
              dark:hover:file:bg-[#ccc]"
          />
          <button
            onClick={() => setIsPreview(!isPreview)}
            className="px-4 py-2 rounded-full text-sm font-semibold
              bg-foreground text-background
              hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            {isPreview ? 'Show Code' : 'Preview HTML'}
          </button>
        </div>
        
        {isPreview ? (
          <div 
            ref={editorRef}
            contentEditable
            onInput={handleContentChange}
            suppressContentEditableWarning
            className="w-full h-[80vh] p-4 overflow-auto border rounded-lg
              bg-white dark:bg-gray-800
              border-gray-200 dark:border-gray-700
              focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <textarea
            value={fileContent}
            onChange={(e) => setFileContent(e.target.value)}
            className="w-full h-[80vh] p-4 font-mono text-sm
              border rounded-lg
              bg-white dark:bg-gray-800
              border-gray-200 dark:border-gray-700
              focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="File content will appear here..."
          />
        )}
      </main>
    </div>
  );
}
