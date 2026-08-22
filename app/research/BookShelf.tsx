import research from "../data/research-archive.json";

export default function BookShelf() {
  const books = research.filter((item) => item.image);
  if (books.length === 0) return null;
  const track = [...books, ...books];

  return (
    <div className="slideshow-viewport" aria-label="저서, 역서와 보고서">
      <div className="slideshow-track book-shelf" style={{ animationDuration: `${books.length * 3.5}s` }}>
        {track.map((book, i) =>
          book.url ? (
            <a href={book.url} key={`${book.slug}-${i}`} title={book.title} target="_blank" rel="noopener noreferrer">
              <img alt={book.title} src={book.image!} />
            </a>
          ) : (
            <img alt={book.title} key={`${book.slug}-${i}`} src={book.image!} title={book.title} />
          )
        )}
      </div>
    </div>
  );
}
