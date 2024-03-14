// Place_SearchPage.js
import React, {useEffect, useState} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import Icon from '../components/Icon.js';
import './PlacePage.css';
import SearchBar from '../components/SearchBar.js';
import LocationInfo from '../components/LocationInfo.js';
import axios from 'axios';


function PlaceSearchPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortMethod, setSortMethod] = useState('rating');
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
  // 6. 페이지 지금 엉망인데 뭘 건드려야 할지 모르겠음


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
      const response = await axios.get('http://localhost:8080/place/search', {
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
  const renderTag = (placeTags) => {
    if (!placeTags || placeTags.length === 0) return null;
    return (
      <div className="place-tags">
        {placeTags.map((tag, index) => <span key={index} className="tag">#{tag}</span>)}
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
            <button key={`page-${i}`} onClick={() => handlePageChange(i)} className={currentPage === i ? 'active' : ''}>
              {i + 1}
            </button>,
        );
      } else if ((i === 1 && currentPage > 2) || (i === 2 && currentPage > 3)) {
        pages.push(<span key={`start-ellipsis-${i}`}>...</span>);
      } else if ((i === totalPages - 2 && currentPage < totalPages - 3) || (i === totalPages - 3 && currentPage < totalPages - 4)) {
        pages.push(<span key={`end-ellipsis-${i}`}>...</span>);
      }
    }
    return <div className="pagination">{pages}</div>;
  };


  const handleSortChange = (e) => {
    setSortMethod(e.target.value); // 정렬 방식 업데이트
    setCurrentPage(0);
  };

  const categoryMapping = {
    '카페': 'I212',
    '숙박': 'I101',
    '스포츠': 'R103',
    '병원': 'Q101 Q102 Q104 M111',
    '약국': 'G215',
    '문화시설': 'R104',
    '주점': 'I211',
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
          <div className='location-info'>
            <b><LocationInfo /></b>
          </div>
          <div className="place-search-bar">
            <SearchBar />
          </div>
        </div>
      </div>

      <div className="place-category-bar">
        <div className='categories-with-tags-section'>
          <div className="place-categories">
                    플레이스:&nbsp;
            <button onClick={() => changeCategory('카페')} className={category === 'I212' ? 'selected' : ''}>#카페</button>
            <button onClick={() => changeCategory('숙박')} className={category === 'I101' ? 'selected' : ''}>#숙박</button>
            <button onClick={() => changeCategory('스포츠')} className={category === 'R103' ? 'selected' : ''}>#스포츠</button>
            <button onClick={() => changeCategory('병원')} className={category === 'Q101 Q102 Q104 M111' ? 'selected' : ''}>#병원</button>
            <button onClick={() => changeCategory('약국')} className={category === 'G215' ? 'selected' : ''}>#약국</button>
            <button onClick={() => changeCategory('문화시설')} className={category === 'R104' ? 'selected' : ''}>#문화시설</button>
            <button onClick={() => changeCategory('주점')} className={category === 'I211' ? 'selected' : ''}>#주점</button>
          </div>

          <p></p>
          <div className="place-tags">
                태그:&nbsp;
            <button onClick={() => changeTag('혼술')} className={tags.includes('혼술') ? 'selected' : ''}>#혼술</button>
            <button onClick={() => changeTag('가성비')} className={tags.includes('가성비') ? 'selected' : ''}>#가성비</button>
            <button onClick={() => changeTag('데이트')} className={tags.includes('데이트') ? 'selected' : ''}>#데이트</button>
            <button onClick={() => changeTag('친절해요')} className={tags.includes('친절해요') ? 'selected' : ''}>#친절해요</button>
            <button onClick={() => changeTag('깔끔해요')} className={tags.includes('깔끔해요') ? 'selected' : ''}>#깔끔해요</button>
            <button onClick={() => changeTag('넓어요')} className={tags.includes('넓어요') ? 'selected' : ''}>#넓어요</button>
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

      <h1>플레이스 검색 결과</h1>
      <div className="place-list">
        {currentPageResults.map((place, index) => (
          <div key={index} className="place-item" onClick={() => navigate(`/place/${place.id}`)}>
            <div className="place-details">
              <h2>{place.name}</h2>
              <p>{place.categoryMiddleName}&nbsp;({place.reviewCnt})</p>
              <p><div className='place-item-tag'>{renderTag(place.tag)}</div></p>
              <p><div className='star-list'>{renderRating(place.rating)}</div></p>
              <p>{place.dong}&nbsp;({place.distance}m)</p>
            </div>
            <div className="place-image">
              <img src={place.image} alt={place.name} />
            </div>
          </div>
        ))}
      </div>
      {renderPageNumbers()}
    </div>
  );
}

export default PlaceSearchPage;
