interface RightSidebarProps {
  selectedContent: string;
  selectedComment: { text: string; emoji: string } | null;
}

const RightSidebar = ({ selectedContent, selectedComment }: RightSidebarProps) => {
  return (
    <div className="w-[400px] h-screen bg-white border-l border-gray-200 overflow-auto">
      <div className="p-5">
        <div className="mb-6">
          <div className="text-sm font-semibold text-gray-900 mb-3">Contents</div>
          {selectedContent && (
            <div className="text-sm leading-relaxed text-gray-700 bg-gray-50 p-3 rounded-md mb-3">
              {selectedContent}
            </div>
          )}
          {selectedComment && (
            <>
              <div className="text-sm font-semibold text-gray-900 mb-3">Comment</div>
              <div className="text-sm leading-relaxed text-gray-700">
                {selectedComment.emoji} {selectedComment.text}
              </div>
            </>
          )}
        </div>

        <div className="mb-6">
          <div className="text-sm font-semibold text-gray-900 mb-3">Suggested Related Nodes</div>
          <div className="p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="text-sm font-medium text-gray-700">Resource Allocation →</div>
          </div>
          <div className="p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="text-sm font-medium text-gray-700">Market Economy →</div>
          </div>
        </div>

        <div className="mb-6">
          <div className="text-sm font-semibold text-gray-900 mb-3">Found in Current Document</div>
          <div className="p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="text-sm font-medium text-gray-700 mb-1">Section 1.3</div>
            <div className="text-xs text-gray-500 leading-relaxed">Resources are considered scarce when...</div>
          </div>
          <div className="p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="text-sm font-medium text-gray-700 mb-1">Section 2.1</div>
            <div className="text-xs text-gray-500 leading-relaxed">The economic problem of scarcity leads to...</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
