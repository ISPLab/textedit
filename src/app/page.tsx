"use client";
import { useState } from "react";

export default function Home() {
  const [fileContent, setFileContent] = useState("");

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

  return (
    <div className="min-h-screen p-8">
      <main className="max-w-4xl mx-auto space-y-4">
        <div>
          <input
            type="file"
            onChange={handleFileLoad}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-foreground file:text-background
              hover:file:bg-[#383838]
              dark:hover:file:bg-[#ccc]"
          />
        </div>
        
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
      </main>
    </div>
  );
}
