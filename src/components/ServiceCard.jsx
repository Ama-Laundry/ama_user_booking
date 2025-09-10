// src/components/ServiceCard.jsx

export default function ServiceCard({ item, isSelected, onSelect }) {
  // Your App.css uses a `.selected` class for the green border.
  // This correctly applies that class when the card is selected.
  const cardClassName = `card ${isSelected ? "selected" : ""}`;

  return (
    // The <label> tag allows clicking anywhere on the card to select it.
    <label className={cardClassName}>
      
      {/* This checkbox is visually hidden by your CSS but controls the selection state. */}
      <input
        type="checkbox"
        checked={isSelected}
        onChange={onSelect}
      />
      
      {/* ✅ FIX: This structure now matches your App.css file. */}
      <div className="media">
        {item.image && <img src={item.image} alt={item.name} />}
      </div>
      
      <div className="content">
        {/* The <h4> tag will be styled correctly by your existing CSS. */}
        <h4>{item.name}</h4>
        
        {/* The <div> with class "price" will be styled correctly. */}
        <div className="price">৳{item.price}</div>
      </div>

    </label>
  );
}
