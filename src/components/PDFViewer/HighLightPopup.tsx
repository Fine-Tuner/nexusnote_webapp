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

export default HighlightPopup;
