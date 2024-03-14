// ChatPage.js
import React, {useState, useEffect} from 'react';
import './ChatPage.css';
import Icon from '../components/Icon.js';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import {useLocation} from '../components/LocationContext.js';
import LocationInfo from '../components/LocationInfo.js';
import SearchBar from '../components/SearchBar.js';
import ChatRoom_CreateModal from './ChatRoom_CreateModal.js';


// memberId는 채팅방 만든 사람 Id, myId는 현 사용자 Id
const ChatItem = ({id, name, memberId, nickname, tag, memberCnt, created_at, address}) => {
  const navigate = useNavigate();
  const myId = localStorage.getItem('id');

  const goToChatRoom = async (roomId) => {
    // 입장 -> 이걸 해줘야 참여 인원 수 올라감
    await axios
        .get(`http://localhost:8080/chat/room/${roomId}/enter`)
        .then((response) => {
          localStorage.setItem('roomName', response.data.name);
        });
    navigate(`/chat/room/${roomId}`);
  };

  const deleteChatRoom = async (roomId) => {
    axios.delete(`http://localhost:8080/chat/room/${roomId}`);
    window.location.href = '/chat';
  };

  // 시간을 이쁘게 보여주기
  const TimeParse = (props) => {
    const date = new Date(props.date);
    let stringDate = null;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');

    const today = new Date();
    // 오늘 작성되었으면
    if (date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()) {
      stringDate = hour + ':' + minute;
    }
    // 올해 작성되었으면
    else if (date.getFullYear() === today.getFullYear()) {
      stringDate = month + '-' + day;
    } else {
      stringDate = year + '-' + month + '-' + day;
    }

    return (
      <div className="chat-time com6">
        <span>{stringDate}</span>
      </div>
    );
  };

  // 채팅 항목을 렌더링하는 컴포넌트입니다.
  return (
    <div className="chat-item" onClick={() => goToChatRoom(id)}>
      <div className="chat-info com1">
        <h3>{name}</h3>
      </div>
      <div className="chat-tagwhat com2">
        {tag.map((tagName, index) => (
          <span key={index} className="tag">
              #{tagName}&nbsp;
          </span>
        ))}
      </div>

      <div className="chat-people com3">
        <Icon type="people_icon" />
           인원:<span>{memberCnt}</span>
      </div>
      <div className="chat-createMember com4">
        <span>작성자 : {nickname}</span>
      </div>
      <div className="chat-address com5">
        <span>{address}</span>
      </div>
      <TimeParse date={created_at} />
      <div className="chat-delete com7">
        {
            myId == memberId ? (<button onClick={(event) => {
              event.stopPropagation(); deleteChatRoom(id);
            }}>삭제</button>) : null
        }
      </div>
    </div>
  );
};

function ChatPage() {
  const {location} = useLocation(); // 전역 위치 상태 사용
  const [chatrooms, setChatrooms] = useState([]);
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (location.lat && location.lon) {
      fetchData(location.lat, location.lon);
    }
  }, [location]);

  const fetchData = async (lat, lon) => {
    try {
      const response = await axios.get('http://localhost:8080/chat/rooms', {
        params: {
          lat: lat,
          lon: lon,
          page: 0,
        },
      });
      setChatrooms(response.data.content);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const showModal= () => {
    setModalOpen(true);
  };

  const modalClose= () => {
    setModalOpen(false);
  };

  return (
    <div className="chat-page">

      <div className="chat-page-bar">
        <div className="chat-title">
          <Icon type="Chat" />
              채팅
        </div>
        <div className="spacer"></div>
        <div className="chat-right-icons">
          <div>
            <Icon type="Location" />
          </div>
          <div className='location-info'>
            <b><LocationInfo /></b>
          </div>
          <div className="chat-search-bar">
            <SearchBar />
          </div>
        </div>
        <div className='create-button'>
          {/* <button onClick={() => navigate("/chat/room/create")}>채팅방 생성</button> */}
          <button onClick={showModal}>채팅방 생성</button>
          {modalOpen && <ChatRoom_CreateModal modalOpen={modalOpen} modalClose={modalClose} />}
        </div>
      </div>


      <div className="chat-left-section">
        {/* 여기에 각 채팅방을 렌더링합니다. */}
        {chatrooms.map((chatroom, index) => (
          <ChatItem key={index} {...chatroom} />
        ))}
        <p></p>
      </div>
    </div>
  );
}

export default ChatPage;
