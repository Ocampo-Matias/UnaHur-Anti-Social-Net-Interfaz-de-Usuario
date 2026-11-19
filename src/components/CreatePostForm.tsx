import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createPost, createPostImage, getTags } from '../services/api';
import type { ApiPost, Tag } from '../types';
import '../styles/Home.css';

type CreatePostFormProps = {
  onCreated: (post: ApiPost) => void;
};

export default function CreatePostForm({ onCreated }: CreatePostFormProps) {
  const { user } = useAuth();
  const [tags, setTags] = useState<Tag[]>([]);
  const [tagsError, setTagsError] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>(['']);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    getTags()
      .then((loadedTags) => {
        if (!ignore) {
          setTags(loadedTags);
          setTagsError(null);
        }
      })
      .catch(() => {
        if (!ignore) {
          setTagsError('No se pudieron cargar las etiquetas.');
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  const handleTagToggle = (tagId: number) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user || !description.trim()) return;

    try {
      setSubmitting(true);
      setError(null);

      const newPost = await createPost({
        description: description.trim(),
        userId: user.id,
        tagIds: selectedTagIds,
      });

      const validUrls = imageUrls.map((url) => url.trim()).filter(Boolean);
      for (const url of validUrls) {
        await createPostImage({ url, postId: newPost.id });
      }

      setDescription('');
      setImageUrls(['']);
      setSelectedTagIds([]);
      onCreated(newPost);
    } catch {
      setError('Ocurrió un error al crear la publicación. Intentá nuevamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="composer-card">
      <div className="composer-card-body">
        <h2 className="section-title">
          ¿Qué estás pensando{user?.nickName ? `, ${user.nickName}` : ''}?
        </h2>

        {error && (
          <div className="alert alert-danger py-2 small" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="composer-field">
            <textarea
              className="composer-input"
              rows={4}
              placeholder="Escribí tu publicación..."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              disabled={submitting}
              required
            />
          </div>

          <div className="composer-row">
            <div className="upload-box">
              <span className="upload-label d-block mb-2">
                Imágenes (URL) — podés agregar más de una
              </span>

              {imageUrls.map((url, index) => (
                <div key={index} className="d-flex align-items-center gap-2 mb-2">
                  <input
                    type="url"
                    className="composer-input mb-0"
                    placeholder={`https://ejemplo.com/imagen${index + 1}.jpg`}
                    value={url}
                    onChange={(event) =>
                      setImageUrls((prev) =>
                        prev.map((currentUrl, currentIndex) =>
                          currentIndex === index ? event.target.value : currentUrl
                        )
                      )
                    }
                    disabled={submitting}
                  />
                  {imageUrls.length > 1 && (
                    <button
                      type="button"
                      className="secondary-button secondary-button-small"
                      onClick={() =>
                        setImageUrls((prev) => prev.filter((_, currentIndex) => currentIndex !== index))
                      }
                      aria-label="Eliminar campo de imagen"
                      title="Eliminar"
                      style={{ flexShrink: 0 }}
                      disabled={submitting}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                className="secondary-button secondary-button-small mt-1"
                onClick={() => setImageUrls((prev) => [...prev, ''])}
                disabled={submitting}
              >
                + Agregar otra imagen
              </button>
            </div>

            <div className="tag-selector">
              <span className="upload-label d-block mb-2">Etiquetas</span>
              <div className="tag-list tag-list-inline">
                {tagsError ? (
                  <span className="text-danger small">{tagsError}</span>
                ) : tags.length > 0 ? (
                  tags.map((tag) => {
                    const isSelected = selectedTagIds.includes(tag.id);
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        className={`chip-button ${isSelected ? 'active' : ''}`}
                        onClick={() => handleTagToggle(tag.id)}
                        disabled={submitting}
                      >
                        #{tag.name}
                      </button>
                    );
                  })
                ) : (
                  <span className="text-muted small">Cargando etiquetas...</span>
                )}
              </div>
            </div>
          </div>

          <div className="publish-actions">
            <button
              type="submit"
              className="primary-button"
              disabled={submitting || !description.trim()}
            >
              {submitting ? 'Publicando...' : 'Publicar'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
