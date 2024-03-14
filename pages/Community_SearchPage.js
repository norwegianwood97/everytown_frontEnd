import React, {useEffect, useState} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import axios from 'axios';

function CommunitySearchPage() {
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const {searchQuery} = location.state;

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await axios.get('http://localhost:8080/boards/search', {
          params: {
            query: searchQuery,
            page: 0, // 페이지 번호
            lat: location.lat,
            lon: location.lon,
          },
        });
        setSearchResults(response.data.content);
        console.log(response.data.content);
      } catch (error) {
        console.error('Error fetching community search data:', error);
      }
    };

    if (searchQuery) {
      fetchSearchResults();
    }
  }, [searchQuery]);

  return (
    <div>
      <h1>커뮤니티 검색 결과</h1>
      <div>
        {searchResults.map((post, index) => (
          <div key={index} className="post-item" onClick={() => navigate(`/community/${post.id}`)}>
            <h2>{post.title}</h2>
            <p>작성자: {post.nickname}</p>
            <p>{post.createdAt}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommunitySearchPage;
