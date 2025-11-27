import "./SideMenu.css";

const categories = [
  { label: "Tất cả sản phẩm", value: "all" },

  { label: "Khác", value: "khac" },
];

function SideMenu({ selected, onSelect }) {
  return (
    <aside className="side-menu">
      <div className="side-menu-title">Danh mục</div>
      <ul className="side-menu-list">
        {categories.map((cat) => (
          <li
            key={cat.value}
            className={selected === cat.value ? "active" : ""}
            onClick={() => onSelect && onSelect(cat.value)}
          >
            {cat.label}
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default SideMenu;
