// SearchPage.js
import React, {useContext} from 'react';
import {SearchContext} from '../components/SearchContext.js';
import {useNavigate} from 'react-router-dom';

function SearchPage() {
  const {searchResults, searchQuery} = useContext(SearchContext);
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/${category.toLowerCase()}_search`, {state: {query: searchQuery}});
  };

  return (
    <div>
      <h1>검색어 카테고리</h1>
      <div>
        <button onClick={() => handleCategoryClick('Food')}>음식</button>
        <button onClick={() => handleCategoryClick('Place')}>플레이스</button>
        <button onClick={() => handleCategoryClick('Chat')}>채팅</button>
        <button onClick={() => handleCategoryClick('Community')}>커뮤니티</button>
      </div>

      {/* 검색 결과를 표시하는 부분*/}
      <div>
        {searchResults.map((item, index) => (
          <div key={index} onClick={() => navigate(`/${item.category}_detail/${item.id}`)}>
            <h3>{item.name}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>


    </div>
  );
}

export default SearchPage;
