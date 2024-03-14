// FoodPage.js
import React, {useState, useEffect, useContext} from 'react';
import './FoodPage.css';
import Icon from '../components/Icon.js';
import SearchBar from '../components/SearchBar.js';
import {useNavigate} from 'react-router-dom';
import LocationInfo from '../components/LocationInfo.js';
import axios from 'axios';
import {useLocation} from '../components/LocationContext.js';
import {SearchContext} from '../components/SearchContext.js';

// 마우스 올렸을 때 이펙트 추가함!!!!!!!!!

function FoodPage() {
  const navigate = useNavigate();
  const {location} = useLocation(); // 전역 위치 상태 사용
  const [restaurants, setRestaurants] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortMethod, setSortMethod] = useState('rating');
  const [category, setCategory] = useState();
  const [tags, setTags] = useState([]);

  useEffect(() => {
    if (location.lat && location.lon) {
      fetchData();
    }
  }, [location, currentPage, category, tags, sortMethod]);

  const fetchRecommendations = async () => {
    try {
      const response = await axios.get('http://localhost:8080/restaurants/recommend', {
        params: {
          lat: location.lat,
          lon: location.lon,
        },
      });
      navigate('/food/recommending', {state: {restaurants: response.data}});
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/restaurants', {
        params: {
          lat: location.lat,
          lon: location.lon,
          cate: category,
          tag: tags.join(' '),
          page: currentPage,
          criteria: sortMethod,
        },
      });
      setRestaurants(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  const categoryMapping = {
    '한식': 'I201',
    '중식': 'I202',
    '일식': 'I203',
    '양식': 'I204',
    '동남아식': 'I205',
    '기타': 'I210',
  };

  const goToFood_RestaurantDetails = (id) => {
    navigate(`/food/${id}`);
  };

  // 별점을 렌더링하는 함수
  const renderRating = (rating) => {
    const stars = [];
    for (let i = 1; i <= rating; i++) {
      stars.push(
          <Icon
            type='star_full'
            key={i}
          />,
      );
    }
    return <div className="place-stars">{stars}</div>;
  };

  // 태그를 렌더링하는 함수
  const renderTag = (restaurantTags) => {
    if (!restaurantTags || restaurantTags.length === 0) return null;
    return (
      <div className="restaurant-tags">
        {restaurantTags.map((tag, index) => <span key={index} className="tag">#{tag}</span>)}
      </div>
    );
  };


  // 페이지 번호를 변경하는 함수
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 0; i < totalPages; i++) {
      // 최초, 현재, 최종 페이지만 표시하고, 나머지는 점으로 표시
      if (i === 0 || i === totalPages - 1 || i === currentPage - 1 || i === currentPage || i === currentPage + 1) {
        pages.push(
            <button key={i} onClick={() => handlePageChange(i)} className={currentPage === i ? 'active' : ''}>
              {i + 1}
            </button>,
        );
      } else if (i === 1 && currentPage > 2) {
        // 현재 페이지가 처음 페이지보다 멀리 떨어져 있을 때 시작 부분에 점을 추가
        pages.push(<span key="start-ellipsis">...</span>);
      } else if (i === totalPages - 2 && currentPage < totalPages - 3) {
        // 현재 페이지가 마지막 페이지보다 멀리 떨어져 있을 때 끝 부분에 점을 추가
        pages.push(<span key="end-ellipsis">...</span>);
      }
    }
    return <div className="pagination">{pages}</div>;
  };

  const handleSortChange = (e) => {
    setSortMethod(e.target.value); // 사용자가 선택한 정렬 방식으로 상태 업데이트
    setCurrentPage(0);
  };

  const changeCategory = (cate) => {
    const categoryDB = categoryMapping[cate];
    if (category === categoryDB) {
      setCategory(null); // 이미 선택된 카테고리를 다시 누르면 해제
    } else {
      setCategory(categoryDB); // 새 카테고리 선택
    }
    setCurrentPage(0);
  };


  const changeTag = (selectedTag) => {
    if (tags.includes(selectedTag)) {
      setTags(tags.filter((t) => t !== selectedTag));
    } else {
      setTags([...tags, selectedTag]);
    }
    setCurrentPage(0);
  };


  const {searchResults} = useContext(SearchContext);

  useEffect(() => {
    // 검색 결과가 있는 경우에만 해당 결과를 화면에 표시합니다.
    if (searchResults && searchResults.length > 0) {
      setRestaurants(searchResults);
      setCurrentPage(0);
      setTotalPages(1);
    } else {
      fetchData(); // 검색 결과가 없는 경우 기본 데이터 로딩
    }
  }, [searchResults, location, currentPage, category, tags, sortMethod]);


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
          <div className='location-info'>
            <b><LocationInfo /></b>
          </div>
          <div className="food-search-bar">
            <SearchBar />
          </div>
        </div>
      </div>

      <div className="food-category-bar">
        <div className='categories-with-tags-section'>
          <div className="food-categories">
              음식점:&nbsp;
            <button onClick={() => changeCategory('한식')} className={category === 'I201' ? 'selected' : ''}>#한식</button>
            <button onClick={() => changeCategory('중식')} className={category === 'I202' ? 'selected' : ''}>#중식</button>
            <button onClick={() => changeCategory('일식')} className={category === 'I203' ? 'selected' : ''}>#일식</button>
            <button onClick={() => changeCategory('양식')} className={category === 'I204' ? 'selected' : ''}>#양식</button>
            <button onClick={() => changeCategory('동남아식')} className={category === 'I205' ? 'selected' : ''}>#동남아식</button>
            <button onClick={() => changeCategory('기타')} className={category === 'I210' ? 'selected' : ''}>#기타</button>
          </div>
          <p></p>
          <div className="food-tags">
              태그:&nbsp;
            <button onClick={() => changeTag('혼밥')} className={tags.includes('혼밥') ? 'selected' : ''}>#혼밥</button>
            <button onClick={() => changeTag('가성비')} className={tags.includes('가성비') ? 'selected' : ''}>#가성비</button>
            <button onClick={() => changeTag('친절한')} className={tags.includes('친절한') ? 'selected' : ''}>#친절한</button>
            <button onClick={() => changeTag('배터지는')} className={tags.includes('배터지는') ? 'selected' : ''}>#배터지는</button>
            <button onClick={() => changeTag('신선한')} className={tags.includes('신선한') ? 'selected' : ''}>#신선한</button>
            <button onClick={() => changeTag('청결한')} className={tags.includes('청결한') ? 'selected' : ''}>#청결한</button>
          </div>
        </div>

        <div className="recommend-button">
          <button className="special-recommend-button" onClick={fetchRecommendations}>추천받기</button>
        </div>
      </div>
      <p></p>
      {/* 정렬 선택 바 */}
      <div className="sort-select-container">
        <label htmlFor="sort-select">정렬:</label>
        <select id="sort-select" onChange={handleSortChange}>
          <option value="rating">평점순</option>
          <option value="dist">거리순</option>
        </select>
      </div>


      {/* 음식점 리스트 */}
      <div className="restaurant-list">
        {restaurants.map((restaurant, index) => (
          <div key={index} className="restaurant-item" onClick={() => goToFood_RestaurantDetails(restaurant.id)}>
            <div className="restaurant-details">
              <h2>{restaurant.name}</h2>
              <p>{restaurant.categoryMiddleName}&nbsp;({restaurant.reviewCnt})</p>
              <p><div className='restaurant-item-tag'>{renderTag(restaurant.tag)}</div></p>
              <p><div className='star-list'>{renderRating(restaurant.rating)}</div></p>
              <p>{restaurant.dong}&nbsp;({restaurant.distance}m)</p>
            </div>

            <div className="restaurant-image">
              { (restaurant.image == null || restaurant.image == 'NO_IMAGE') ? <image src="C:/Users/user/project/everytown/react/EveryTown/EveryTown/everytown/src/assets/이미지/food_logo.png" /> : <img src={restaurant.image} /> }

            </div>
          </div>
        ))}
      </div>
      {renderPageNumbers()}
    </div>
  );
}

export default FoodPage;
