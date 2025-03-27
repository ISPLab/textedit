"use client";
interface ViewToggleButtonProps {
  isPreview: boolean;
  onToggle: () => void;
}

export function ViewToggleButton({ isPreview, onToggle }: ViewToggleButtonProps) {
  return (
    <button
      onClick={onToggle}
      className="px-4 py-2 rounded-full text-sm font-semibold
        bg-foreground text-background
        hover:bg-[#383838] dark:hover:bg-[#ccc]"
    >
      {isPreview ? 'Show Code' : 'Preview HTML'}
    </button>
  );
} 