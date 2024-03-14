// LocationContext.js
import React, {createContext, useState, useEffect, useContext} from 'react';

export const useLocation = () => useContext(LocationContext);

export const LocationProvider = ({children}) => {
  // 로컬 스토리지에서 위치 정보를 불러오는 함수
  const loadLocationFromLocalStorage = () => {
    const storedLocation = localStorage.getItem('location');
    return storedLocation ? JSON.parse(storedLocation) : {lat: null, lon: null, address: '현재 위치'};
  };

  const [location, setLocation] = useState(loadLocationFromLocalStorage());

  // 상태가 변경될 때마다 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem('location', JSON.stringify(location));
  }, [location]);

  return (
    <LocationContext.Provider value={{location, setLocation}}>
      {children}
    </LocationContext.Provider>
  );
};

export const LocationContext = createContext(null);
