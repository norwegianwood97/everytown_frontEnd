// NavigationBar.js
import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import './NavigationBar.css';

function NavigationBar({isLoggedIn, onLogout}) {
  const accessToken = localStorage.getItem('accessToken');
  const [thumbnail, setThumbnail] = useState(localStorage.getItem('thumbnail'));

  const getMemberInfo = async () => {
    try {
      const response = await axios.get('http://localhost:8080/member/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const {id, nickname, thumbnail} = response.data;
      localStorage.setItem('id', id);
      localStorage.setItem('nickname', nickname);
      localStorage.setItem('thumbnail', thumbnail);
      setThumbnail(thumbnail);
    } catch (error) {
      console.log('사용자 정보 불러오기 실패');
    }
  };

  useEffect(() => {
    const id = localStorage.getItem('id');
    // 로그인은 됐는데 id값이 없으면
    if (!id && accessToken) {
      getMemberInfo();
      console.log(id);
    }
  }, [accessToken, getMemberInfo]);


  return (
    <div className="navigation-bar">
      <Link to="/" className="MainPage">Every Town</Link>
      <div className="navigation-links">
        <Link to="/locationchange" className="navigation-link-location">위치 설정</Link>
        {isLoggedIn ? (
          <>
            {/* <Icon type="user_icon" /> 사용자 아이콘 */}
            &nbsp;
            <img className="profileElement" src={thumbnail}/>
            <button onClick={onLogout} className="navigation-link-logout">로그아웃</button>
          </>
        ) : (
          <Link to="/login" className="navigation-link-login">로그인</Link>
        )}
      </div>
    </div>
  );
}

export default NavigationBar;
