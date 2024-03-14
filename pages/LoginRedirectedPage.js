import React, {useEffect} from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';

const LoginRedirectPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {platform} = useParams();

  const handleOAuthLogin = async (code) => {
    try {
      // 카카오로부터 받아온 code를 서버에 전달하여 카카오로 회원가입 & 로그인한다
      const response = await axios.get(`http://localhost:8080/auth/redirected/${platform}?code=${code}`);
      const {accessToken, refreshToken, accessTokenExpiresAt} = response.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('accessTokenExpiresAt', accessTokenExpiresAt);

      // 삭제해도 됨
      alert('로그인 성공');

      console.log('accessToken : '+accessToken);
      console.log('refreshToken : '+refreshToken);
      console.log('accessTokenExpiresAt : '+accessTokenExpiresAt);

      // 이렇게 이동해야 app.js가 다시 훅 실행함
      window.location.href = 'http://localhost:3000';
    } catch (error) {
      console.log('Redirect ERROR!');
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code'); // Redirect 시키면서 code를 쿼리 스트링으로 준다.
    console.log('CODE : '+code);
    handleOAuthLogin(code);
  }, [location]);

  return (
    <div>
      <div>Processing...</div>
    </div>
  );
};

export default LoginRedirectPage;
