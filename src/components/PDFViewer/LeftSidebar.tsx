import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Pencil, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { IHighlight } from "react-pdf-highlighter";

interface LeftSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  highlights: IHighlight[];
  onHighlightClick: (highlight: IHighlight) => void;
  onDeleteHighlight: (id: string) => void;
}

const LeftSidebar = ({ isOpen, onToggle, highlights, onHighlightClick, onDeleteHighlight }: LeftSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onDeleteHighlight(id);
  };

  const filteredHighlights = highlights.filter(
    (highlight) =>
      highlight.content.text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      highlight.comment?.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={cn(
        "h-screen border-r transition-[width] duration-300 ease-in-out overflow-hidden bg-background",
        isOpen ? "w-[300px]" : "w-[50px]"
      )}
    >
      <Button variant="ghost" size="icon" className="w-[50px] h-[50px]" onClick={onToggle}>
        {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </Button>

      {isOpen && (
        <div className="w-[300px] h-[calc(100vh-50px)]">
          <div className="p-4">
            <div className="relative mb-4">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <ScrollArea className="h-[calc(100vh-130px)]">
              <div className="space-y-3">
                {filteredHighlights.map((highlight) => (
                  <Card
                    key={highlight.id}
                    className="transition-colors cursor-pointer hover:bg-accent/50"
                    onClick={() => onHighlightClick(highlight)}
                  >
                    <CardContent className="p-3 space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="text-sm font-medium">페이지 1의 주요 내용</h3>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-6 h-6"
                            onClick={(e) => handleDelete(e, highlight.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="w-6 h-6">
                            <Pencil className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{highlight.content.text}</p>
                      {highlight.comment && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <span>{highlight.comment.emoji}</span>
                          <span>{highlight.comment.text}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeftSidebar;
