// Food_ReviewingPage.js
import React, {useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import Icon from '../components/Icon.js';
import SearchBar from '../components/SearchBar.js';
import LocationInfo from '../components/LocationInfo.js';
import axios from 'axios';

function Food_ReviewingPage() {
  const {id} = useParams();
  const navigate = useNavigate();
  const [reviewContent, setReviewContent] = useState('');
  const [rating, setRating] = useState(0);
  const [tags, setTags] = useState([]);

  const handleTagChange = (tag) => {
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  const handleReviewSave = async () => {
    try {
      await axios.post(`http://localhost:8080/restaurants/${id}/review`, {
        content: reviewContent,
        rating: rating,
        tag: tags,
      });
      navigate(`/food/${id}`);
    } catch (error) {
      console.error('Error saving review:', error);
    }
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
        <div className="right-icons">
          <Icon type="Location" />
          <div className='location-info'>
            <b><LocationInfo /></b>
          </div>
          <div className="food-search-bar">
            <SearchBar />
          </div>
        </div>
      </div>

      {/* Textarea */}
      <textarea
        value={reviewContent}
        onChange={(e) => setReviewContent(e.target.value)}
        style={{
          width: '100%',
          height: '10em',
        }}
      />
      <p></p>

      {/* 평점 선택 바 */}
      <div style={{margin: '10px 0'}}>
        <label htmlFor="rating-select">평점 선택:&nbsp;</label>
        <select
          id="rating-select"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        >
          <option value="0">평점 선택</option>
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
      </div>
      <p></p>

      {/* 태그 선택 버튼 */}
      <div>
        {['혼밥', '가성비'].map((tag) => (
          <button
            key={tag}
            style={{
              color: tags.includes(tag) ? 'white' : 'black',
              backgroundColor: tags.includes(tag) ? 'darkgrey' : 'lightgrey',
              transform: 'scale(1.5)',
              margin: '5px',
              padding: '5px 10px',
            }}
            onClick={() => handleTagChange(tag)}
          >
            #{tag}
          </button>
        ))}
      </div>
      <button onClick={handleReviewSave}>리뷰 저장</button>
    </div>
  );
}

export default Food_ReviewingPage;
