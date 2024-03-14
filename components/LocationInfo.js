// LocationInfo.js
import React, {useEffect, useState} from 'react';
import './LocationInfo.css';

import {useLocation} from './LocationContext.js'; // LocationContext 훅 임포트

const LocationInfo = () => {
  const {location, setLocation} = useLocation(); // 전역 위치 상태 사용

  useEffect(() => {
    if (!location.lat || !location.lon) {
      navigator.geolocation.getCurrentPosition(
          (position) => {
            const geocoder = new window.kakao.maps.services.Geocoder();
            const callback = function(result, status) {
              if (status === window.kakao.maps.services.Status.OK) {
                const address = result[0].address;
                // 전역 위치 상태 업데이트
                setLocation({lat: position.coords.latitude, lon: position.coords.longitude, address: `${address.region_2depth_name} ${address.region_3depth_name}`});
              }
            };
            geocoder.coord2Address(position.coords.longitude, position.coords.latitude, callback);
          },
          (error) => {
            console.error('Geolocation error:', error);
          },
      );
    }
  }, [location, setLocation]); // 의존성 배열에 location과 setLocation 추가

  return <div>{location.address}</div>;
};

export default LocationInfo;
