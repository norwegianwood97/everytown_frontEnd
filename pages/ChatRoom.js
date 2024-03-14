// ChatRoom.js
import React, {useState, useEffect, useRef, Fragment} from 'react';
import SockJS from 'sockjs-client';
import {Stomp} from '@stomp/stompjs';
import axios from 'axios';
import {Form, useLocation} from 'react-router-dom';
import './ChatRoom.css';

function ChatRoom() {
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState('');
  const [memberCnt, setMemberCnt] = useState(1);

  const roomId = useRef('');
  const stompClient = useRef(null);
  const nickname = useRef('');
  const memberId = useRef('');
  const thumbnail = useRef('');
  const roomName = useRef('');

  const location = useLocation();
  const locationPathname = location.pathname;

  const accessToken = localStorage.getItem('accessToken');


  const getChatLog = () => {
    axios
        .get(`http://localhost:8080/chat/room/${roomId.current}/log`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          const messageList = response.data;
          setMessages((prevMessages) => [...messageList, ...prevMessages]);
        })
        .catch((error) => {
          alert(error);
          window.location.href = '/';
        });
  };

  const updateMemberCnt = () => {
    axios
        .get(`http://localhost:8080/chat/room/${roomId.current}/memberCnt`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          setMemberCnt(response.data.memberCnt);
        })
        .catch((error) => {
          alert(error);
          window.location.href = '/';
        });
  };

  // 메시지 보낼때
  // messageContent는 입력된 메시지의 값을 저장하기 위함
  // 이후 버튼을 눌러 메시지를 보내면 이 함수가 수행되어 STOMP로 메시지 보내고 messageContent 초기화
  const sendMessage = (event) => {
    event.preventDefault();

    if (messageContent && stompClient.current) {
      const chatMessage = {
        type: 'TALK',
        roomId: roomId.current,
        memberId: memberId.current,
        nickName: nickname.current,
        message: messageContent,
        thumbnail: thumbnail.current,
        time: null,
      };

      stompClient.current.send(
          '/pub/chat/send',
          {Authorization: `Bearer ${accessToken}`},
          JSON.stringify(chatMessage),
      );
      // 다시 메시지 초기화
      setMessageContent('');
    }
  };

  // 메시지 받았을 때
  const onMessageRcvd = (payload) => {
    const message = JSON.parse(payload.body);

    if (message.type === 'ENTER' || message.type === 'LEAVE') updateMemberCnt();
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  // 연결시
  const onConnect = () => {
    stompClient.current.subscribe(
        `/sub/chat/room/${roomId.current}`,
        onMessageRcvd,
        {Authorization: `Bearer ${accessToken}`},
    );

    stompClient.current.send(
        '/pub/chat/enter',
        {Authorization: `Bearer ${accessToken}`},
        JSON.stringify({
          type: 'ENTER',
          roomId: roomId.current,
          memberId: memberId.current,
          nickName: nickname.current,
          message: null,
          thumbnail: null,
          time: null,
        }),
    );

    // 채팅 기록 가져오기
    getChatLog();
  };

  const onError = (payload) => {
    if (payload != null) {
      console.log('연결 실패');
    }
  };

  useEffect(() => {
    memberId.current = localStorage.getItem('id');
    nickname.current = localStorage.getItem('nickname');
    thumbnail.current = localStorage.getItem('thumbnail');
    roomName.current = localStorage.getItem('roomName');
    roomId.current = decodeURIComponent(
        locationPathname.split('/').pop(),
    );

    const socket = new SockJS('http://localhost:8080/ws/chat');
    stompClient.current = Stomp.over(socket);

    if (stompClient.current != null) {
      console.log('stompClient 설정 완료');
      stompClient.current.connect(
          {Authorization: `Bearer ${accessToken}`},
          onConnect,
          onError,
      );
    }

    return () => {
      if (stompClient.current) {
        stompClient.current.send(
            '/pub/chat/leave',
            {Authorization: `Bearer ${accessToken}`},
            JSON.stringify({
              type: 'LEAVE',
              roomId: roomId.current,
              memberId: memberId.current,
              nickName: nickname.current,
              message: messageContent,
              thumbnail: null,
              time: null,
            }),
        );
        console.log('leave!!');
      }
    };
  }, []);

  const MessageArea = (props) => {
    let message;
    if (props.chat.type === 'TALK') {
      if (props.chat.memberId == memberId.current) {
        message = <MyMessage chat={props.chat} />;
      } else {
        message = <OtherMessage chat={props.chat} />;
      }
    } else {
      message = <SystemMessage chat={props.chat} />;
    }

    return <div>{message}</div>;
  };

  const MyMessage = (props) => {
    return (
      <span className="myMessage">
        <li>
          <div className="myMessageContent">
            <div className="nickNameElement">{props.chat.nickName}</div>
            <div className="messageElement">{props.chat.message}</div>
            <TimeParse date={props.chat.time} />
          </div>&nbsp;
          <img
            className="profileElement"
            src={props.chat.thumbnail}
          />
        </li>
      </span>
    );
  };

  const OtherMessage = (props) => {
    return (
      <span className="otherMessage">
        <li>
          <img
            className="profileElement"
            src={props.chat.thumbnail}
          />
          <div className="otherMessageContent">
            <div className="nickNameElement">{props.chat.nickName}</div>
            <div className="messageElement">{props.chat.message}</div>
            <TimeParse date={props.chat.time} />
          </div>
        </li>
      </span>
    );
  };

  const SystemMessage = (props) => {
    return (
      <span className="systemMessage">
        <li>
          <div className="systemMessageElement">{props.chat.message}</div>
        </li>
      </span>
    );
  };

  const TimeParse = (props) => {
    const date = new Date(props.date);
    let stringDate = null;

    if (date.getHours() < 12) {
      stringDate =
              '오전 ' +
              String(date.getHours()) +
              ':' +
              String(date.getMinutes()).padStart(2, '0');
    } else if (date.getHours() === 12) {
      stringDate =
              '오후 ' +
              String(date.getHours()) +
              ':' +
              String(date.getMinutes()).padStart(2, '0');
    } else {
      stringDate =
              '오후 ' +
              String(date.getHours() - 12) +
              ':' +
              String(date.getMinutes()).padStart(2, '0');
    }

    return <div className="timeElement">{stringDate}</div>;
  };

  // 채팅 올라올 때마다 스크롤 아래로 이동
  const scrollRef = useRef();

  useEffect(() => {
    // 최대 높이로 스크롤하여 아래로 이동
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  return (
    <Fragment>
      <div className="chatRoomInfo">
        <div className="chatRoomName">{roomName.current} ({memberCnt})</div>
      </div>
      <ul className="messageArea" ref={scrollRef}>
        {messages.map((message, index) => (
          <div key={index}>
            <MessageArea chat={message} />
          </div>
        ))}
      </ul>
      <form id = "chatMessageForm" name = "chatMmessageForm" onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="실시간 TALK에 참여해보세요"
          autoComplete="off"
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
        />
        <button className="chatButton" type="submit">전송</button>
      </form>
    </Fragment>
  );
}

export default ChatRoom;
