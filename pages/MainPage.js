// MainPage.js
import React from 'react';
import '../App.css';
import './MainPage.css';
import SearchBar from '../components/SearchBar.js';
import Icon from '../components/Icon.js';
import LocationInfo from '../components/LocationInfo.js';
const MainPage = () => {
  return (
    <div className="App">
      <header className="App-header">
        <div className="middle-icions">
          <div className="mainpage-Location-bar">
            <div>
              <Icon type="Location" />
            </div>
            <div>
              <b>
                <LocationInfo />
              </b>
            </div>
            <p></p>
          </div>
          <div className="MainPage-search-bar">
            <SearchBar />
          </div>
        </div>

        <div className="icons-container">
          <Icon type="Food" name="Food" showName={true} />
          <Icon type="Place" name="Place" showName={true} />
          <Icon type="Chat" name="Chat" showName={true} />
          <Icon type="Community" name="Community" showName={true} />
        </div>
      </header>
    </div>
  );
};

export default MainPage;
