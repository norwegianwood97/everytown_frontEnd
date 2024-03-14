// SearchBar.js
import React, {useState, useContext} from 'react';
import axios from 'axios';
import {LocationContext} from './LocationContext.js';
import {useNavigate} from 'react-router-dom';
import './SearchBar.css';

function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('food');
  const {location} = useContext(LocationContext);
  const navigate = useNavigate();

  const handleSearch = async () => {
    console.log(searchQuery);
    if (!searchQuery.trim()) return;

    let searchUrl = '';
    switch (selectedCategory) {
      case 'food':
        searchUrl = 'http://localhost:8080/restaurants/search';
        break;
      case 'place':
        searchUrl = 'http://localhost:8080/place/search'; // Place 검색 URL
        break;
      case 'chat':
        searchUrl = 'http://localhost:8080/chat/rooms/search'; // Chat 검색 URL
        break;
      case 'community':
        searchUrl = 'http://localhost:8080/boards/search'; // Community 검색 URL
        break;
    }

    try {
      const response = await axios.get(searchUrl, {
        params: {
          query: searchQuery,
          lat: location.lat,
          lon: location.lon,
          page: 0,
        },
      });

      // 추가함
      localStorage.setItem('query', searchQuery);
      navigate(`/${selectedCategory}_search`, {state: {searchResults: response.data.content}});
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="search-bar">
      <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
        <option value="food">음식</option>
        <option value="place">플레이스</option>
        <option value="chat">채팅</option>
        <option value="community">커뮤니티</option>
      </select>
      &nbsp;
      <input
        type="text"
        placeholder="검색"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)
        }
        onKeyPress={handleKeyPress}
      />
      <button onClick={handleSearch}>검색</button>
    </div>
  );
}

export default SearchBar;
