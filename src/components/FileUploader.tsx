interface FileUploaderProps {
  onFileLoad: (content: string) => void;
}

export function FileUploader({ onFileLoad }: FileUploaderProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onFileLoad(content);
    };
    reader.readAsText(file);
  };

  return (
    <input
      type="file"
      accept=".html,.htm"
      onChange={handleFileChange}
      className="block w-full text-sm text-gray-500
        file:mr-4 file:py-2 file:px-4
        file:rounded-full file:border-0
        file:text-sm file:font-semibold
        file:bg-foreground file:text-background
        hover:file:bg-[#383838]
        dark:hover:file:bg-[#ccc]"
    />
  );
} 