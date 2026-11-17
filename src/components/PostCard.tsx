import { Link } from 'react-router-dom';
import type { PostUI } from '../types';
import TagPill from './TagPill';

type PostCardProps = {
  post: PostUI;
  variant?: 'home' | 'profile';
};

export default function PostCard({ post, variant = 'home' }: PostCardProps) {
  const isProfile = variant === 'profile';

  return (
    <article className="post-card">
      <div className="post-card-body">
        <div className="post-header">
          <div>
            <h3 className="post-user">{post.user}</h3>
          </div>
        </div>

        {!isProfile && (
          <div className="post-gallery-grid">
            {post.images.slice(0, 2).map((image, index) => (
              <img
                key={`${post.id}-${index}`}
                src={image}
                alt={`${post.user} post ${index + 1}`}
                className={post.images.length > 1 && index === 0 ? 'main-image' : 'secondary-image'}
              />
            ))}
          </div>
        )}

        <p className="post-description">{post.description}</p>

        <div className="tag-list">
          {post.tags.map((tag) => (
            <TagPill key={`${post.id}-${tag}`} tag={tag} />
          ))}
        </div>

        {isProfile ? (
          <div className="profile-card-footer">
            <span className="comment-count">{post.visibleComments} comentarios visibles</span>
            <Link to={`/post/${post.id}`} className="primary-button primary-button-small">
              Ver más
            </Link>
          </div>
        ) : (
          <Link to={`/post/${post.id}`} className="primary-button">
            Ver más
          </Link>
        )}
      </div>
    </article>
  );
}
