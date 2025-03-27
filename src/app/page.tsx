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
      if (editorRef.current) {
        editorRef.current.innerHTML = content;
      }
    };
    reader.readAsText(file);
  };

  const saveSelection = () => {
    const selection = window.getSelection();
    if (!selection?.rangeCount) return null;
    
    const range = selection.getRangeAt(0);
    const preSelectionRange = range.cloneRange();
    if (!editorRef.current) return null;
    
    preSelectionRange.selectNodeContents(editorRef.current);
    preSelectionRange.setEnd(range.startContainer, range.startOffset);
    const start = preSelectionRange.toString().length;

    return {
      start,
      end: start + range.toString().length
    };
  };

  const restoreSelection = (savedSel: { start: number; end: number } | null) => {

    if (!savedSel || !editorRef.current) return;

    const charIndex = (node: Node, index: number): { node: Node; offset: number } => {
      let currentIndex = 0;

      if (node.nodeType === Node.TEXT_NODE) {
        const length = node.textContent?.length || 0;
        if (currentIndex + length >= index) {
          return { node, offset: index - currentIndex };
        }
        currentIndex += length;
      } else {
        for (const child of Array.from(node.childNodes)) {
          const result = charIndex(child, index - currentIndex);
          if (result) {
            return result;
          }
          currentIndex += child.textContent?.length || 0;
        }
      }

      return { node, offset: 0 };
    };

    const range = document.createRange();
    const { node: startNode, offset: startOffset } = charIndex(editorRef.current, savedSel.start);
    range.setStart(startNode, startOffset);

    if (savedSel.end !== savedSel.start) {
      const { node: endNode, offset: endOffset } = charIndex(editorRef.current, savedSel.end);
      range.setEnd(endNode, endOffset);
    }

    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  };

  const handleContentChange = () => {
    if (!editorRef.current) return;
    
    // Сохраняем текущую позицию каретки относительно родительского элемента
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);
    
    if (!range) return;

    // Находим смещение относительно редактируемого div
    const preSelectionRange = range.cloneRange();
    preSelectionRange.selectNodeContents(editorRef.current);
    preSelectionRange.setEnd(range.startContainer, range.startOffset);
    const position = preSelectionRange.toString().length;

    // Обновляем контент
    const newContent = editorRef.current.innerHTML;
    setFileContent(newContent);
    
    // Восстанавливаем позицию каретки
    requestAnimationFrame(() => {
      const editor = editorRef.current;
      if (!editor) return;

      // Находим новый текстовый узел и смещение
      let currentPosition = 0;
      let targetNode: Node | null = null;
      let targetOffset = 0;

      const findPosition = (node: Node) => {
        if (currentPosition > position) return true;

        if (node.nodeType === Node.TEXT_NODE) {
          const length = node.textContent?.length || 0;
          if (currentPosition + length >= position) {
            targetNode = node;
            targetOffset = position - currentPosition;
            return true;
          }
          currentPosition += length;
        } else {
          for (const child of Array.from(node.childNodes)) {
            if (findPosition(child)) return true;
          }
        }
        return false;
      };

      findPosition(editor);

      if (targetNode) {
        const newRange = document.createRange();
        newRange.setStart(targetNode, targetOffset);
        newRange.setEnd(targetNode, targetOffset);
        
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(newRange);
      }
    });
  };

  useEffect(() => {
    if (isPreview && editorRef.current) {
      const savedSelection = saveSelection();
      editorRef.current.innerHTML = fileContent;
      requestAnimationFrame(() => {
        restoreSelection(savedSelection);
      });
    }
  }, [isPreview, fileContent]);

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
