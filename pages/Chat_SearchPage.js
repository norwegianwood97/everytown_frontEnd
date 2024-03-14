// Chat_SearchPage.js
import React, {useEffect, useState} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';


function ChatSearchPage() {
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.searchResults) {
      setSearchResults(location.state.searchResults);
    }
  }, [location.state]);

  return (
    <div>
      <h1>채팅 검색 결과</h1>
      <div>
        {searchResults.map((chat, index) => (
          <div>
            <div key={index} className="chat-item" onClick={() => navigate(`/chat/room/${chat.id}`)}>
              <div>
                <h2>{chat.name}</h2>
              </div>
              <div>

              </div>
            </div>
            <p>참여자 수: {chat.memberCnt}</p>
            <p>작성자: {chat.nickname}</p>
            <p>태그: {chat.tag.join(', ')}</p>
            <p>주소: {chat.address}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatSearchPage;
