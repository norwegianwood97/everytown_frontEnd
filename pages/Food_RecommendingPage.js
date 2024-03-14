// Food_RecommendingPage.js
import React from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import './FoodPage.css';
import Icon from '../components/Icon.js';
import LocationInfo from '../components/LocationInfo.js';
import SearchBar from '../components/SearchBar.js';

function Food_RecommendingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const {restaurants} = location.state;

  const goToFood_RestaurantDetails = (id) => {
    navigate(`/food/${id}`);
  };

  const renderRating = (rating) => {
    const totalStars = 5;
    const stars = [];
    for (let i = 0; i < totalStars; i++) {
      stars.push(
          <Icon type={i < rating ? 'star_full' : 'star_empty'} key={i} />,
      );
    }
    return <div className="restaurant-stars">{stars}</div>;
  };

  return (
    <div>
      {/* 음식 페이지 바 */}
      <div className="food-page-bar">
        <div className="food-title">
          <Icon type="Food" />
              식당 검색
        </div>
        <div className="spacer"></div>
        <div className="food-right-icons">
          <div>
            <Icon type="Location" />
          </div>
          <div>
            <b><LocationInfo /></b>
          </div>
          <div className="food-search-bar">
            <SearchBar />
          </div>
        </div>
      </div>
      <div className='back-to-previous-page'>
        <button onClick={() => navigate('/food')}>이전 페이지로 돌아가기</button>
      </div>
      <p>추천 목록</p>
      <div className="restaurant-list">
        {restaurants.map((restaurant, index) => (
          <div key={index} className="restaurant-item" onClick={() => goToFood_RestaurantDetails(restaurant.id)}>
            <div className="restaurant-details">
              <h2>{restaurant.name}</h2>
              <p>{restaurant.categoryMiddleName}</p>
              <p><div className='star-list'>{renderRating(restaurant.rating)}</div> &nbsp; ({restaurant.reviewCnt})</p>


              <p>{restaurant.dong}&nbsp;({restaurant.distance}m)</p>
              <p><button className="map-view">지도에서 보기</button></p>
            </div>
            <div className='restaurant-image'>
              <img src={restaurant.image} alt={`${restaurant.name} 이미지`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Food_RecommendingPage;
