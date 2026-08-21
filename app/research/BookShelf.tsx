import research from "../data/research-archive.json";

export default function BookShelf() {
  const books = research.filter((item) => item.image);
  if (books.length === 0) return null;

  return (
    <section className="book-shelf" aria-label="저서와 역서">
      {books.map((book) =>
        book.url ? (
          <a href={book.url} key={book.slug} title={book.text}>
            <img alt={book.text} src={book.image!} />
          </a>
        ) : (
          <img alt={book.text} key={book.slug} src={book.image!} title={book.text} />
        )
      )}
    </section>
  );
}
