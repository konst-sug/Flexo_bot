export default function ImageViewCard({ title, src, alt = '', emptyText = 'Изображение не загружено' }) {
  return (
    <section className="card">
      <h2>{title}</h2>
      {src ? (
        <img
          className="image-view"
          src={src}
          alt={alt}
        />
      ) : (
        <p className="hint muted">{emptyText}</p>
      )}
    </section>
  );
}
