type CommentItemProps = {
  comment: {
    id: number | string;
    user: string;
    text: string;
  };
};

export default function CommentItem({ comment }: CommentItemProps) {
  const initial = (comment.user || 'U').charAt(0).toUpperCase();

  return (
    <div className="comment-item">
      <div className="comment-avatar">{initial}</div>
      <div className="comment-content">
        <strong>{comment.user}</strong>
        <p>{comment.text}</p>
      </div>
    </div>
  );
}
