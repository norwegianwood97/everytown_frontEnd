// Community_ModifyPage.js
import React, {useState, useEffect, useContext} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {LocationContext} from '../components/LocationContext.js';
import axios from 'axios';
import './Community_ModifyPage.css';

function Community_ModifyPage() {
  const {id} = useParams(); // URL로부터 게시글 ID를 추출
  const navigate = useNavigate();
  const {location} = useContext(LocationContext);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [boardCategory, setBoardCategory] = useState('');

  useEffect(() => {
    // 페이지 로드 시 게시글 정보 불러오기
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/boards/${id}`);
        const {title, content, boardCategory} = response.data;
        setTitle(title);
        setContent(content);
        setBoardCategory(boardCategory.toString()); // 카테고리는 문자열로 변환
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [id]);

  const handlePostSave = async () => {
    try {
      // 게시글 수정을 위한 POST 요청
      await axios.post(`http://localhost:8080/boards/${id}`, {
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
      navigate('/community'); // 성공적으로 수정 후 CommunityPage로 이동
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  return (
    <div className='community_modify-page'>
      <div className='community_modify_title'>
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
      내용:
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="내용을 입력하세요"
        style={{
          width: '100%',
          height: '30em',
        }}
      />
      <p></p>
      <button onClick={handlePostSave}>게시글 저장</button>
    </div>
  );
}

export default Community_ModifyPage;
