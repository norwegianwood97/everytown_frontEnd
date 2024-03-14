// ChatRoom_CreatePage.js
import React, {useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import axios from 'axios';
import {useLocation} from '../components/LocationContext.js';
import './ChatRoom_CreateModal.css';

function ChatRoom_CreateModal({modalOpen, modalClose}) {
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState('');
  const [tag, setTag] = useState('');
  const {location} = useLocation(); // 전역 위치 상태 사용

  const handleCreateRoom = async () => {
    try {
      // 태그를 문자열로 받아서 배열로 변환
      const tags = tag.replace(/#/g, '').replace(/,/g, '').split(' ');

      // 채팅방 생성
      const response = await axios.post(`http://localhost:8080/chat/room`, {
        name: roomName,
        tag: tags,
        address: location.address,
      },
      {params: {
        lat: location.lat,
        lon: location.lon,
      },
      });
      localStorage.setItem('roomName', response.data.name);
      goToChatRoom(response.data.id);
    } catch (error) {
      console.error('Error saving review:', error);
    }
  };

  // 채팅방 이동
  const goToChatRoom = async (roomId) => {
    // 참가 인원수 늘리기
    axios.get(`http://localhost:8080/chat/room/${roomId}/enter`);
    navigate(`/chat/room/${roomId}`);
  };

  return (
    <div className="chat-create-modal">
      <button className="modal-close-button" onClick={modalClose}>X</button>
      <p className="chat-create"><b>채팅방 생성</b></p>

      {/* Textarea */}
      <div className="room-title">
        <p className="room-title-explain">제목</p>
        <textarea
          className="room-title-textarea"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}/>
      </div>

      {/* 태그 입력 -> '#한식 #무한리필' 처럼 공백을 기준으로 #붙여서 작성하면 배열로 변환해서 서버에 보냄*/}
      <div className="room-tag">
        <p className="room-tag-explain">태그</p>
        <textarea
          className="room-tag-textarea"
          value={tag}
          onChange={(e) => setTag(e.target.value)}/>
      </div>
      <button className="create-button" onClick={handleCreateRoom}>채팅방 만들기</button>
    </div>
  );
}

export default ChatRoom_CreateModal;
