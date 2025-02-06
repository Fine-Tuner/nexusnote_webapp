import { useCallback, useEffect, useRef, useState } from "react";

import UpdateElectron from "@/components/update";
import logoVite from "./assets/logo-vite.svg";
import logoElectron from "./assets/logo-electron.svg";
import "./App.css";
import { Button } from "./components/ui/button";
import "react-pdf-highlighter/dist/style.css";
import type { IHighlight, NewHighlight } from "react-pdf-highlighter";
import { AreaHighlight, Highlight, PdfHighlighter, PdfLoader, Popup, Tip } from "react-pdf-highlighter";
import HighlightPopup from "./components/PDFViewer/HighLightPopup";
import LeftSidebar from "./components/PDFViewer/LeftSidebar";
import RightSidebar from "./components/PDFViewer/RightSidebar";

import { GlobalWorkerOptions } from "pdfjs-dist";

GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.js", import.meta.url).toString();

function App() {
  const [highlights, setHighlights] = useState<IHighlight[]>([]);
  const [selectedContent, setSelectedContent] = useState("");
  const [selectedComment, setSelectedComment] = useState<{ text: string; emoji: string } | null>(null);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const scrollViewerTo = useRef((highlight: IHighlight) => {});
  // URL 해시 관련 함수들
  const parseIdFromHash = () => document.location.hash.slice("#highlight-".length);
  const resetHash = () => {
    document.location.hash = "";
  };

  // 하이라이트로 스크롤
  const scrollToHighlightFromHash = useCallback(() => {
    const highlightId = parseIdFromHash();
    const highlight = highlights.find((h) => h.id === highlightId);
    if (highlight) {
      scrollViewerTo.current(highlight);
    }
  }, [highlights]);

  // 해시 변경 이벤트 리스너
  useEffect(() => {
    window.addEventListener("hashchange", scrollToHighlightFromHash, false);
    return () => {
      window.removeEventListener("hashchange", scrollToHighlightFromHash, false);
    };
  }, [scrollToHighlightFromHash]);

  // 하이라이트 추가
  const addHighlight = (highlight: NewHighlight) => {
    setHighlights((prev) => [{ ...highlight, id: String(Math.random()).slice(2) }, ...prev]);
  };

  const handleHighlightClick = (highlight: IHighlight) => {
    setSelectedContent(highlight.content.text || "");
    setSelectedComment(highlight.comment);
    scrollViewerTo.current(highlight);
  };

  const handleDeleteHighlight = (id: string) => {
    setHighlights((prev) => prev.filter((h) => h.id !== id));
    // 삭제된 하이라이트가 현재 선택된 것이라면 선택 상태도 초기화
    if (highlights.find((h) => h.id === id)?.content.text === selectedContent) {
      setSelectedContent("");
      setSelectedComment(null);
    }
  };
  return (
    <div>
      <div className="flex w-screen h-screen overflow-hidden">
        <LeftSidebar
          isOpen={isLeftSidebarOpen}
          onToggle={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
          highlights={highlights}
          onHighlightClick={handleHighlightClick}
          onDeleteHighlight={handleDeleteHighlight}
        />
        <div className="relative flex-1 overflow-hidden">
          <div className="absolute inset-0 overflow-auto bg-gray-50">
            <PdfLoader url="/pdf/sample.pdf" beforeLoad={<div>Loading...</div>}>
              {(pdfDocument) => (
                <PdfHighlighter
                  pdfDocument={pdfDocument}
                  enableAreaSelection={(event) => event.altKey}
                  onScrollChange={resetHash}
                  scrollRef={(scrollTo) => {
                    scrollViewerTo.current = scrollTo;
                    scrollToHighlightFromHash();
                  }}
                  onSelectionFinished={(position, content, hideTipAndSelection, transformSelection) => {
                    setSelectedContent(content.text || "");
                    return (
                      <Tip
                        onOpen={transformSelection}
                        onConfirm={(comment) => {
                          addHighlight({ content, position, comment });
                          hideTipAndSelection();
                        }}
                      />
                    );
                  }}
                  highlightTransform={(highlight, _, setTip, hideTip, __, ___, isScrolledTo) => {
                    const isTextHighlight = !!(highlight.content && highlight.content.image);

                    const component = isTextHighlight ? (
                      <Highlight
                        isScrolledTo={isScrolledTo}
                        position={highlight.position}
                        comment={highlight.comment}
                        onClick={() => {
                          setSelectedContent(highlight.content.text || "");
                          setSelectedComment(highlight.comment);
                        }}
                      />
                    ) : (
                      <AreaHighlight isScrolledTo={isScrolledTo} highlight={highlight} onChange={() => {}} />
                    );

                    return (
                      <Popup
                        popupContent={
                          <HighlightPopup
                            comment={highlight.comment}
                            onDelete={() => handleDeleteHighlight(highlight.id)}
                            onConfirm={() => {}}
                          />
                        }
                        onMouseOver={(popupContent) => setTip(highlight, () => popupContent)}
                        onMouseOut={hideTip}
                      >
                        {component}
                      </Popup>
                    );
                  }}
                  highlights={highlights}
                />
              )}
            </PdfLoader>
          </div>
        </div>
        <RightSidebar selectedContent={selectedContent} selectedComment={selectedComment} />
      </div>
      <UpdateElectron />
    </div>
  );
}

export default App;
