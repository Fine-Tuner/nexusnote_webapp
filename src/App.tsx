import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useRef, useState } from "react";
import type { IHighlight, NewHighlight } from "react-pdf-highlighter";
import { AreaHighlight, Highlight, PdfHighlighter, PdfLoader, Popup, Tip } from "react-pdf-highlighter";
import "react-pdf-highlighter/dist/style.css";
import "./App.css";

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    width: "100vw",
    overflow: "hidden",
  },
  getLeftSidebarStyle: (isOpen: boolean) => ({
    width: isOpen ? "300px" : "50px",
    height: "100vh",
    borderRight: "1px solid #ddd",
    transition: "width 0.3s ease",
    overflow: "hidden",
  }),
  leftSidebarContent: {
    width: "300px",
    height: "100%",
    padding: "20px",
  },
  toggleButton: {
    width: "50px",
    height: "50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "20px",
    color: "#666",
    backgroundColor: "transparent",
    border: "none",
    borderBottom: "1px solid #ddd",
  },
  highlightList: {
    marginTop: "20px",
  },
  highlightItem: {
    padding: "12px",
    borderBottom: "1px solid #f0f0f0",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
    position: "relative" as const,
    "&:hover": {
      backgroundColor: "#f8f9fa",
    },
  },
  deleteButton: {
    position: "absolute" as const,
    right: "12px",
    top: "12px",
    width: "24px",
    height: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    borderRadius: "12px",
    backgroundColor: "#f0f0f0",
    color: "#666",
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    opacity: 0,
    "&:hover": {
      backgroundColor: "#e0e0e0",
      color: "#333",
    },
  },
  highlightItemContainer: {
    position: "relative" as const,
    "&:hover button": {
      opacity: 1,
    },
  },
  highlightText: {
    fontSize: "14px",
    lineHeight: "1.5",
    color: "#333",
    marginBottom: "4px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical" as const,
  },
  highlightComment: {
    fontSize: "13px",
    color: "#666",
  },
  pdfContainer: {
    flex: "1",
    overflow: "hidden",
    position: "relative" as const,
  },
  pdfViewer: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "auto",
    backgroundColor: "#f8f9fa",
  },
  sidebar: {
    width: "400px",
    height: "100vh",
    backgroundColor: "white",
    borderLeft: "1px solid #ddd",
    overflow: "auto",
  },
  sidebarContent: {
    padding: "20px",
  },
  contents: {
    marginBottom: "24px",
  },
  contentTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: "12px",
  },
  selectedText: {
    fontSize: "14px",
    lineHeight: "1.5",
    color: "#333",
    backgroundColor: "#f8f9fa",
    padding: "12px",
    borderRadius: "6px",
    marginBottom: "12px",
  },
  commentText: {
    fontSize: "14px",
    lineHeight: "1.5",
    color: "#333",
  },
  suggestedSection: {
    marginBottom: "24px",
  },
  suggestedItem: {
    padding: "12px",
    borderBottom: "1px solid #f0f0f0",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
    "&:hover": {
      backgroundColor: "#f8f9fa",
    },
  },
  suggestedTitle: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#333",
    marginBottom: "4px",
  },
  suggestedDescription: {
    fontSize: "13px",
    color: "#666",
    lineHeight: "1.4",
  },
};

// 하이라이트 팝업 컴포넌트
const HighlightPopup = ({ comment, onDelete }: { comment: { text: string; emoji: string }; onDelete: () => void }) =>
  comment.text ? (
    <div className="Highlight__popup">
      {comment.emoji} {comment.text}
      <button
        className="popup-delete-button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        title="Delete highlight"
      >
        ×
      </button>
    </div>
  ) : null;

// 사이드바 컴포넌트
const Sidebar = ({
  selectedContent,
  selectedComment,
}: {
  selectedContent: string;
  selectedComment: { text: string; emoji: string } | null;
}) => {
  return (
    <div style={styles.sidebar}>
      <div style={styles.sidebarContent}>
        <div style={styles.contents}>
          <div style={styles.contentTitle}>Contents</div>
          {selectedContent && <div style={styles.selectedText}>{selectedContent}</div>}
          {selectedComment && (
            <>
              <div style={styles.contentTitle}>Comment</div>
              <div style={styles.commentText}>
                {selectedComment.emoji} {selectedComment.text}
              </div>
            </>
          )}
        </div>

        <div style={styles.suggestedSection}>
          <div style={styles.contentTitle}>Suggested Related Nodes</div>
          <div style={styles.suggestedItem}>
            <div style={styles.suggestedTitle}>Resource Allocation →</div>
          </div>
          <div style={styles.suggestedItem}>
            <div style={styles.suggestedTitle}>Market Economy →</div>
          </div>
        </div>

        <div style={styles.suggestedSection}>
          <div style={styles.contentTitle}>Found in Current Document</div>
          <div style={styles.suggestedItem}>
            <div style={styles.suggestedTitle}>Section 1.3</div>
            <div style={styles.suggestedDescription}>Resources are considered scarce when...</div>
          </div>
          <div style={styles.suggestedItem}>
            <div style={styles.suggestedTitle}>Section 2.1</div>
            <div style={styles.suggestedDescription}>The economic problem of scarcity leads to...</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 왼쪽 사이드바 컴포넌트
const LeftSidebar = ({
  isOpen,
  onToggle,
  highlights,
  onHighlightClick,
  onDeleteHighlight,
}: {
  isOpen: boolean;
  onToggle: () => void;
  highlights: IHighlight[];
  onHighlightClick: (highlight: IHighlight) => void;
  onDeleteHighlight: (id: string) => void;
}) => {
  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // 클릭 이벤트 전파 방지
    onDeleteHighlight(id);
  };

  return (
    <div style={styles.getLeftSidebarStyle(isOpen)} className="bg-blue-900">
      <button style={styles.toggleButton} onClick={onToggle}>
        {isOpen ? "←" : "→"}
      </button>
      <div style={styles.leftSidebarContent}>
        <div style={styles.contentTitle}>Highlights</div>
        <div style={styles.highlightList}>
          {highlights.map((highlight, index) => (
            <div key={highlight.id} className="highlight-item-container">
              <div className="highlight-item" onClick={() => onHighlightClick(highlight)}>
                <div style={styles.highlightText}>{highlight.content.text}</div>
                {highlight.comment && (
                  <div style={styles.highlightComment}>
                    {highlight.comment.emoji} {highlight.comment.text}
                  </div>
                )}
                <button
                  className="delete-button"
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
    <div style={styles.container}>
      <Button>Click me</Button>
      <LeftSidebar
        isOpen={isLeftSidebarOpen}
        onToggle={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
        highlights={highlights}
        onHighlightClick={handleHighlightClick}
        onDeleteHighlight={handleDeleteHighlight}
      />
      <div style={styles.pdfContainer}>
        <div style={styles.pdfViewer}>
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
                highlightTransform={(highlight, index, setTip, hideTip, viewportToScaled, screenshot, isScrolledTo) => {
                  const isTextHighlight = !Boolean(highlight.content && highlight.content.image);

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
                        />
                      }
                      onMouseOver={(popupContent) => setTip(highlight, (highlight) => popupContent)}
                      onMouseOut={hideTip}
                      key={index}
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
      <Sidebar selectedContent={selectedContent} selectedComment={selectedComment} />
    </div>
  );
}

export default App;
