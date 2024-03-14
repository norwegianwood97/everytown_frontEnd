// Food_SearchPage.js
import React, {useEffect, useState} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import Icon from '../components/Icon.js';
import './FoodPage.css';
import SearchBar from '../components/SearchBar.js';
import LocationInfo from '../components/LocationInfo.js';
import axios from 'axios';


function FoodSearchPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortMethod, setSortMethod] = useState('default');
  const [category, setCategory] = useState();
  const [tags, setTags] = useState([]);

  const [isFromSearchBar, setIsFromSearchBar] = useState(true);

  const query = localStorage.getItem('query');
  const lat = JSON.parse(localStorage.getItem('location')).lat;
  const lon = JSON.parse(localStorage.getItem('location')).lon;

  // READ ME!!!
  // 1. useEffect에서 if문에서 항상 true가 나오기 때문에 fetchData가 수행되지 않는 문제가 있어서 수정함
  // 2. 카테고리, 태그 state가 훅 의존성 배열에 있기 때문에 change 이벤트에서 fetchData 삭제함
  // 3. 좌표 정보를 제대로 읽지 못하길래 그냥 localStorage에서 꺼내서 씀
  // 4. 검색어 정보 얻기 위해 SearchBar.js 에서 localStorage에 검색어 저장후 꺼내 쓰기로함
  // 5. 정렬 기준 "정확도" 추가 -> 이것을 기본으로 설정


  useEffect(() => {
    if (isFromSearchBar) {
      setSearchResults(location.state.searchResults);
      setTotalPages(Math.ceil(location.state.searchResults.length / 10)); // 10개씩 페이지네이션
      setIsFromSearchBar(false);
    } else {
      fetchData();
    }
  }, [location.state, currentPage, category, tags, sortMethod]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/restaurants/search', {
        params: {
          query: query,
          lat: lat,
          lon: lon,
          cate: category,
          tag: tags.join(' '),
          page: currentPage,
          criteria: sortMethod,
        },
      });
      setSearchResults(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // 별점을 렌더링하는 함수
  const renderRating = (rating) => {
    const stars = [];
    for (let i = 1; i <= rating; i++) {
      stars.push(<Icon type='star_full' key={i} />);
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

  // 페이지 번호 렌더링
  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 0; i < totalPages; i++) {
      if (i === 0 || i === totalPages - 1 || (i >= currentPage - 1 && i <= currentPage + 1)) {
        pages.push(
            <button key={i} onClick={() => handlePageChange(i)} className={currentPage === i ? 'active' : ''}>
              {i + 1}
            </button>,
        );
      } else if ((i === 1 && currentPage > 2) || (i === 2 && currentPage > 3)) {
        pages.push(<span key="start-ellipsis">...</span>);
      } else if ((i === totalPages - 2 && currentPage < totalPages - 3) || (i === totalPages - 3 && currentPage < totalPages - 4)) {
        pages.push(<span key="end-ellipsis">...</span>);
      }
    }
    return <div className="pagination">{pages}</div>;
  };

  const handleSortChange = (e) => {
    setSortMethod(e.target.value); // 정렬 방식 업데이트
    console.log(sortMethod);
    setCurrentPage(0);
  };

  const categoryMapping = {
    '한식': 'I201',
    '중식': 'I202',
    '일식': 'I203',
    '양식': 'I204',
    '동남아식': 'I205',
    '기타': 'I210',
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

  // 현재 페이지의 검색 결과
  const startIndex = currentPage * 10;
  const endIndex = startIndex + 10;
  const currentPageResults = searchResults.slice(startIndex, endIndex);

  return (
    <div>
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
      </div>
      <p></p>
      {/* 정렬 선택 바 */}
      <div className="sort-select-container">
        <label htmlFor="sort-select">정렬:</label>
        <select id="sort-select" onChange={handleSortChange}>
          <option value="default">정확도순</option>
          <option value="rating">평점순</option>
          <option value="dist">거리순</option>
        </select>
      </div>

      <h1>"{query}" 검색 결과</h1>
      <div className="restaurant-list">
        {currentPageResults.map((restaurant, index) => (
          <div key={index} className="restaurant-item" onClick={() => navigate(`/food/${restaurant.id}`)}>
            <div className="restaurant-details">
              <h2>{restaurant.name}</h2>
              <p>{restaurant.categoryMiddleName}&nbsp;({restaurant.reviewCnt})</p>
              <p><div className='restaurant-item-tag'>{renderTag(restaurant.tag)}</div></p>
              <p><div className='star-list'>{renderRating(restaurant.rating)}</div></p>
              <p>{restaurant.dong}&nbsp;({restaurant.distance}m)</p>
            </div>
            <div className="restaurant-image">
              <img src={restaurant.image} alt={restaurant.name} />
            </div>
          </div>
        ))}
      </div>
      {renderPageNumbers()}
    </div>
  );
}

export default FoodSearchPage;
