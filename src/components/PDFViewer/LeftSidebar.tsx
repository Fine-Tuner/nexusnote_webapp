import { cn } from "@/lib/utils";
import { IHighlight } from "react-pdf-highlighter";

interface LeftSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  highlights: IHighlight[];
  onHighlightClick: (highlight: IHighlight) => void;
  onDeleteHighlight: (id: string) => void;
}

const LeftSidebar = ({ isOpen, onToggle, highlights, onHighlightClick, onDeleteHighlight }: LeftSidebarProps) => {
  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onDeleteHighlight(id);
  };

  return (
    <div
      className={cn(
        "h-screen border-r border-gray-200 transition-[width] duration-300 ease-in-out overflow-hidden bg-blue-900",
        isOpen ? "w-[300px]" : "w-[50px]"
      )}
    >
      <button
        className="w-[50px] h-[50px] flex items-center justify-center cursor-pointer text-xl text-gray-500 bg-transparent border-none border-b border-gray-200"
        onClick={onToggle}
      >
        {isOpen ? "←" : "→"}
      </button>
      <div className="w-[300px] h-full p-5">
        <div className="mb-3 text-sm font-semibold text-gray-900">Highlights</div>
        <div className="mt-5">
          {highlights.map((highlight) => (
            <div key={highlight.id} className="relative group">
              <div
                className="p-3 transition-colors border-b border-gray-100 cursor-pointer hover:bg-gray-50"
                onClick={() => onHighlightClick(highlight)}
              >
                <div className="mb-1 text-sm leading-relaxed text-gray-700 line-clamp-2">{highlight.content.text}</div>
                {highlight.comment && (
                  <div className="text-xs text-gray-500">
                    {highlight.comment.emoji} {highlight.comment.text}
                  </div>
                )}
                <button
                  className="absolute flex items-center justify-center w-6 h-6 text-sm text-gray-600 transition-all bg-gray-100 border-none rounded-full opacity-0 cursor-pointer right-3 top-3 group-hover:opacity-100 hover:bg-gray-200 hover:text-gray-800"
                  onClick={(e) => handleDelete(e, highlight.id)}
                  title="Delete highlight"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
