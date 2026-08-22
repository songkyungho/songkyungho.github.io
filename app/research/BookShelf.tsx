import research from "../data/research-archive.json";

export default function BookShelf() {
  const books = research.filter((item) => item.image);
  if (books.length === 0) return null;

  return (
    <section className="book-shelf" aria-label="저서와 역서">
      {books.map((book) =>
        book.url ? (
          <a href={book.url} key={book.slug} title={book.title} target="_blank" rel="noopener noreferrer">
            <img alt={book.title} src={book.image!} />
          </a>
        ) : (
          <img alt={book.title} key={book.slug} src={book.image!} title={book.title} />
        )
      )}
    </section>
  );
}
