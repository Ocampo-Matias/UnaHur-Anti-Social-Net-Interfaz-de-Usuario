import type { Comment } from '../data/mockData';

type CommentItemProps = {
  comment: Comment;
};

export default function CommentItem({ comment }: CommentItemProps) {
  return (
    <div className="comment-item">
      <div className="comment-avatar">{comment.user.charAt(0).toUpperCase()}</div>
      <div className="comment-content">
        <strong>{comment.user}</strong>
        <p>{comment.text}</p>
      </div>
    </div>
  );
}
