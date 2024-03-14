// App.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { LocationProvider } from './components/LocationContext.js';
import NavigationBar from './components/NavigationBar.js';
import MainPage from './pages/MainPage.js';
import LocationChangePage from './pages/LocationChangePage.js';
import LoginPage from './pages/LoginPage.js';
import LoginRedirectPage from './pages/LoginRedirectedPage.js';
import FoodPage from './pages/FoodPage.js';
import FoodRestaurantPage from './pages/Food_RestaurantPage.js';
import FoodRecommendingPage from './pages/Food_RecommendingPage.js';
import PlacePage from './pages/PlacePage.js';
import PlaceDetailPage from './pages/Place_DetailPage.js';
import PlaceRecommendingPage from './pages/Place_RecommendingPage.js';
import ChatPage from './pages/ChatPage.js';
import ChatRoom from './pages/ChatRoom.js';
import CommunityPage from './pages/CommunityPage.js';
import CommunityDetailPage from './pages/Community_DetailPage.js';
import CommunityCreatePage from './pages/Community_CreatePage.js';
import CommunityModifyPage from './pages/Community_ModifyPage.js';
import { SearchProvider } from './components/SearchContext.js';
import SearchPage from './pages/SearchPage.js';
import FoodSearchPage from './pages/Food_SearchPage.js';
import PlaceSearchPage from './pages/Place_SearchPage.js';
import ChatSearchPage from './pages/Chat_SearchPage.js';
import CommunitySearchPage from './pages/Community_SearchPage.js';

function App() {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem('accessToken')
  );
  const [accessTokenExpiresAt, setAccessTokenExpiresAt] = useState(
    localStorage.getItem('accessTokenExpiresAt')
  );
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem('accessToken')
  );

  // 로그아웃 처리 함수
  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8080/auth/logout', {
        refreshToken: localStorage.getItem('refreshToken'),
      });
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('accessTokenExpiresAt');
      // 사용자 데이터 삭제
      localStorage.removeItem('id');
      localStorage.removeItem('nickname');
      localStorage.removeItem('thumbnail');
      setIsLoggedIn(false); // 로그아웃 상태로 변경
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // 토큰 만료 시 재발급 함수
  const refreshAccessToken = async () => {
    try {
      const response = await axios.post('http://localhost:8080/auth/reissue', {
        refreshToken: localStorage.getItem('refreshToken'),
      });
      setAccessToken(response.data.accessToken);
      setAccessTokenExpiresAt(response.data.accessTokenExpiresAt);
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken); // Fixed
      localStorage.setItem(
        'accessTokenExpiresAt',
        response.data.accessTokenExpiresAt
      );
    } catch (error) {
      console.error('Token refresh error:', error);
      handleLogout();
    }
  };

  // 액세스 토큰 만료 검사 및 재발급 로직
  useEffect(() => {
    const checkTokenValidity = () => {
      const now = Math.floor(Date.now() / 1000); // Current time in Unix format
      if (accessTokenExpiresAt && now >= parseInt(accessTokenExpiresAt)) {
        refreshAccessToken();
      }
    };

    checkTokenValidity();
    const interval = setInterval(checkTokenValidity, 60000); // Every 1 minute
    return () => clearInterval(interval);
  }, [accessTokenExpiresAt, refreshAccessToken]);

  // Axios 인터셉터 설정
  useEffect(() => {
    const axiosInterceptor = axios.interceptors.request.use(
      async (config) => {
        if (accessToken && accessTokenExpiresAt) {
          config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      axios.interceptors.request.eject(axiosInterceptor);
    };
  }, [accessToken, accessTokenExpiresAt]);

  return (
    <SearchProvider>
      <Router>
        <LocationProvider>
          <NavigationBar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/locationchange" element={<LocationChangePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/login/redirected/:platform"
              element={<LoginRedirectPage />}
            />
            <Route path="/food" element={<FoodPage />} />
            <Route path="/food/:id" element={<FoodRestaurantPage />} />
            <Route
              path="/food/recommending"
              element={<FoodRecommendingPage />}
            />
            <Route path="/place" element={<PlacePage />} />
            <Route path="/place/:id" element={<PlaceDetailPage />} />
            <Route
              path="/place/recommending"
              element={<PlaceRecommendingPage />}
            />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/chat/room/:id" element={<ChatRoom />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/community/:id" element={<CommunityDetailPage />} />
            <Route path="/community/create" element={<CommunityCreatePage />} />
            <Route
              path="/community/modify/:id"
              element={<CommunityModifyPage />}
            />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/food_search" element={<FoodSearchPage />} />
            <Route path="/place_search" element={<PlaceSearchPage />} />
            <Route path="/chat_search" element={<ChatSearchPage />} />
            <Route path="/community_search" element={<CommunitySearchPage />} />
          </Routes>
        </LocationProvider>
      </Router>
    </SearchProvider>
  );
}

export default App;
