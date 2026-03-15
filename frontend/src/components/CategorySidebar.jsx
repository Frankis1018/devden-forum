export default function CategorySidebar({
  categories,
  activeCategoryId,
  onSelect,
}) {
  return (
    <aside className="sidebar">
      <h2>Categories</h2>
      <ul className="category-list">
        {categories.map((category) => (
          <li key={category._id}>
            <button
              className={
                activeCategoryId === category._id
                  ? "category-button active"
                  : "category-button"
              }
              onClick={() => onSelect(category)}
            >
              <strong>{category.name}</strong>
              <span>{category.description}</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
