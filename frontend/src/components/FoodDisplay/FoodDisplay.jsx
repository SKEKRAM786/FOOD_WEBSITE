import React, { useContext } from 'react'
import './FoodDisplay.css'
import FoodItem from '../FoodItem/FoodItem'
import { StoreContext } from '../../Context/StoreContext'

const norm = (s) => String(s ?? "").toLowerCase();

const FoodDisplay = ({ category, searchQuery }) => {

  const { food_list } = useContext(StoreContext);
  const q = norm((searchQuery || "").trim());

  const visible = (food_list || []).filter((item) => {
    if (!item) return false;
    const inCategory = category === "All" || category === item.category;
    const hay = `${norm(item.name)} ${norm(item.description)} ${norm(item.category)}`;
    const matchesSearch = !q || hay.includes(q);
    if (!matchesSearch) return false;
    if (!q) return inCategory;
    return true;
  });

  return (
    <div className='food-display' id='food-display'>
      <h2>
        {q
          ? `Dishes matching “${(searchQuery || "").trim()}”`
          : "Top dishes near you"}
      </h2>
      {q && visible.length > 0 ? (
        <p className="food-display-search-hint">
          {`${visible.length} item${visible.length === 1 ? "" : "s"} from your menu`}
        </p>
      ) : null}
      <div className='food-display-list'>
        {visible.length === 0 ? (
          <p className="food-display-empty">
            {q ? "No dishes match your search. Try a different name." : "No dishes in this category yet."}
          </p>
        ) : (
          visible.map((item) => (
            <FoodItem key={item._id} image={item.image} name={item.name} desc={item.description} price={item.price} id={item._id} />
          ))
        )}
      </div>
    </div>
  )
}

export default FoodDisplay
