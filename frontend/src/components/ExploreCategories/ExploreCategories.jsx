import React from 'react';
import './ExploreCategories.css';
import { menu_list } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';

const ExploreCategories = ({ category, setCategory }) => {
  const navigate = useNavigate();
  const handleCategoryClick = (item) => {
    setCategory(prev => prev === item.menu_name ? "All" : item.menu_name);
  };

  return (
    <div className='explore-categories' id='explore-categories'>
      <h1>Explore Garden Key</h1>
      <p className='explore-categories-text'>Find your garden essentials and services from our wide selection of categories!</p>
      <div className='explore-categories-list'>
        {menu_list.map((item, index) => (
          <div
            onClick={() => handleCategoryClick(item)}
            key={index}
            className='explore-categories-item'
          >
            <img
              className={category === item.menu_name ? "active" : ""}
              src={item.menu_image}
              alt={item.menu_name}
            />
            <p>{item.menu_name}</p>
          </div>
        ))}
      </div>
      <hr />
    </div>
  );
};

export default ExploreCategories;
