import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ScrollArea } from "@/components/ui/Scroll-area";
import { ArrowRight } from "lucide-react";

interface RightSidebarProps {
  selectedContent: string;
  selectedComment: { text: string; emoji: string } | null;
}

const RightSidebar = ({ selectedContent, selectedComment }: RightSidebarProps) => {
  return (
    <div className="w-[400px] h-screen border-l bg-background bg-gray-800">
      <ScrollArea className="h-full">
        <div className="p-6 space-y-6">
          {(selectedContent || selectedComment) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">선택된 내용</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedContent && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">내용</h4>
                    <p className="text-sm text-muted-foreground bg-accent/50 p-3 rounded-md">{selectedContent}</p>
                  </div>
                )}
                {selectedComment && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">코멘트</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedComment.emoji} {selectedComment.text}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* <Card>
            <CardHeader>
              <CardTitle className="text-lg">관련 노드</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                <button className="flex items-center justify-between w-full p-4 text-sm hover:bg-accent/50 transition-colors">
                  <span className="font-medium">자원 할당</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button className="flex items-center justify-between w-full p-4 text-sm hover:bg-accent/50 transition-colors">
                  <span className="font-medium">시장 경제</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">현재 문서에서 발견됨</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                <button className="block w-full text-left p-4 hover:bg-accent/50 transition-colors">
                  <div className="text-sm font-medium mb-1">섹션 1.3</div>
                  <div className="text-xs text-muted-foreground">자원은 희소할 때 고려됩니다...</div>
                </button>
                <button className="block w-full text-left p-4 hover:bg-accent/50 transition-colors">
                  <div className="text-sm font-medium mb-1">섹션 2.1</div>
                  <div className="text-xs text-muted-foreground">희소성의 경제적 문제는...</div>
                </button>
              </div>
            </CardContent>
          </Card> */}
        </div>
      </ScrollArea>
    </div>
  );
};

export default RightSidebar;
