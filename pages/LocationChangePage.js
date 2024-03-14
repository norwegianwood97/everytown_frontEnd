// LocationChangePage.js
import React, {useState, useEffect} from 'react';
import {useLocation} from '../components/LocationContext.js';
import {useNavigate} from 'react-router-dom';
import './LocationChangePage.css';

const LocationChangePage = () => {
  const {setLocation} = useLocation();
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [localLocation, setLocalLocation] = useState(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);


  useEffect(() => {
    const container = document.getElementById('map');
    const options = {
      center: new window.kakao.maps.LatLng(37.5665, 126.9780),
      level: 3,
    };
    const map = new window.kakao.maps.Map(container, options);
    setMap(map);
  }, []);

  const handleSearch = () => {
    const places = new window.kakao.maps.services.Places();
    places.keywordSearch(searchKeyword, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const {y, x, place_name} = result[0];
        const coords = new window.kakao.maps.LatLng(y, x);
        map.setCenter(coords);
        // 마커 생성 및 지도에 추가
        if (marker) {
          marker.setMap(null); // 기존 마커가 있으면 제거
        }
        const newMarker = new window.kakao.maps.Marker({
          map: map,
          position: coords,
        });
        setMarker(newMarker); // 마커 상태 업데이트
        setLocalLocation({lat: y, lon: x, address: place_name});
      }
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSetLocation = () => {
    if (localLocation) {
      // 전역 상태를 업데이트합니다.
      setLocation(localLocation);
      navigate('/');
    }
  };

  return (
    <div className='location-change-page'>
      <p></p>
      <div className='location-search-button'>
        위치 설정: <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleSearch}>검색</button>
      </div>
      <p></p>
      <div id="map" style={{width: '80%', height: '700px'}}></div>
      <p></p>
      <div >
        <button className='location-set-location-button' onClick={handleSetLocation}>위치 저장</button>
      </div>
    </div>
  );
};
export default LocationChangePage;
