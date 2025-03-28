import { useState } from 'react';
import { EditorContainer } from './components/EditorContainer';
import { FileUploader } from './components/FileUploader';
import { ViewToggleButton } from './components/ViewToggleButton';

export function App() {
  const [fileContent, setFileContent] = useState("");
  const [isPreview, setIsPreview] = useState(true);

  return (
    <div className="min-h-screen p-8 bg-background text-foreground">
      <main className="max-w-4xl mx-auto space-y-4">
        <div className="flex gap-4 items-center">
          <FileUploader onFileLoad={setFileContent} />
          <ViewToggleButton isPreview={isPreview} onToggle={() => setIsPreview(!isPreview)} />
        </div>
        
        <EditorContainer 
          isPreview={isPreview}
          content={fileContent}
          onContentChange={setFileContent}
        />
      </main>
    </div>
  );
} 