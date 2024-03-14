// Place_RecommendingPage.js
import React from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import './PlacePage.css';
import Icon from '../components/Icon.js';
import LocationInfo from '../components/LocationInfo.js';
import SearchBar from '../components/SearchBar.js';

function Place_RecommendingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const {place} = location.state;

  const goToPlace_DetailPage = (id) => {
    navigate(`/place/${id}`);
  };

  const renderRating = (rating) => {
    const totalStars = 5;
    const stars = [];
    for (let i = 0; i < totalStars; i++) {
      stars.push(
          <Icon type={i < rating ? 'star_full' : 'star_empty'} key={i} />,
      );
    }
    return <div className="place-stars">{stars}</div>;
  };

  return (
    <div>
      {/* 플레이스 페이지 바 */}
      <div className="place-page-bar">
        <div className="place-title">
          <Icon type="Place" />
              플레이스 검색
        </div>
        <div className="spacer"></div>
        <div className="place-right-icons">
          <div>
            <Icon type="Location" />
          </div>
          <div>
            <b><LocationInfo /></b>
          </div>
          <div className="place-search-bar">
            <SearchBar />
          </div>
        </div>
      </div>
      <button onClick={() => navigate('/place')}>이전 페이지로 돌아가기</button>
      <p>추천 목록</p>
      <div className="place-list">
        {place.map((place, index) => (
          <div key={index} className="place-item" onClick={() => goToPlace_DetailPage(place.id)}>
            <div className="place-details">
              <h2>{place.name}</h2>
              <p>{place.categoryMiddleName}</p>
              <p><div className='star-list'>{renderRating(place.rating)}</div> &nbsp; ({place.reviewCnt})</p>


              <p>{place.dong}&nbsp;({place.distance}m)</p>
              <p><button className="map-view">지도에서 보기</button></p>
            </div>
            <div className='place-image'>
              <img src={place.image} alt={`${place.name} 이미지`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Place_RecommendingPage;
