// Community_CreatePage.js
import React, {useState, useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import {LocationContext} from '../components/LocationContext.js';
import axios from 'axios';
import './Community_CreatePage.css';

function Community_CreatePage() {
  const navigate = useNavigate();
  const {location} = useContext(LocationContext);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [boardCategory, setBoardCategory] = useState('1'); // 예: 1 (자유게시판)로 초기화

  const handlePostSave = async () => {
    try {
      await axios.post('http://localhost:8080/boards', {
        title,
        content,
        boardCategory: parseInt(boardCategory), // boardCategory를 숫자로 변환
        address: location.address,
      }, {
        params: {
          lat: location.lat,
          lon: location.lon,
        },
      });
      navigate('/community'); // 게시글 목록 페이지로 이동
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div className='community_create-page'>
      <div className='community_create_title'>
        제목: <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          style={{
            width: '80%',
          }}
        />
      </div>
      <p></p>
      <div className='community_create_content'>
        <label htmlFor="content-area">내용:</label>
        <textarea
          id="content-area"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 입력하세요"
          style={{width: '85%', height: '30em'}}
        />
      </div>
      <p></p>
      <select
        value={boardCategory}
        onChange={(e) => setBoardCategory(e.target.value)}
      >
        <option value="1">자유게시판</option>
        <option value="2">취업게시판</option>
        <option value="3">모집게시판</option>
        <option value="4">홍보게시판</option>
      </select>
      &nbsp;
      <button onClick={handlePostSave}>게시글 저장</button>
    </div>
  );
}

export default Community_CreatePage;
