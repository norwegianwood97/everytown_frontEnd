// Food_RestaurantPage.js
import React, {useEffect, useState, useRef, useContext} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import Icon from '../components/Icon.js';
import SearchBar from '../components/SearchBar.js';
import './Food_RestaurantPage.css';
import LocationInfo from '../components/LocationInfo.js';
import axios from 'axios';
import {LocationContext} from '../components/LocationContext.js';

// 변경점
// createAt 추가 -> TimeParse로 이쁘게 보이게함

function Food_RestaurantPage() {
  const {id} = useParams();
  const navigate = useNavigate();
  const {location} = useContext(LocationContext);
  const [restaurantData, setRestaurantData] = useState({
    id: null,
    name: null,
    categoryLargeName: null,
    categoryMiddleName: null,
    categorySmallName: null,
    tag: null,
    dong: null,
    address: null,
    latitude: null,
    longitude: null,
    rating: null,
    distance: null,
    reviewCnt: null,
    image: null,
  });
  const [menuData, setMenuData] = useState([]);
  const [reviewData, setReviewData] = useState([]);
  const mapContainer = useRef(null);

  useEffect(() => {
    // 서버로부터 음식점 상세 정보를 가져옵니다.
    const fetchRestaurantDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/restaurants/${id}/basicInfo`, {

          params: {
            lat: location.lat,
            lon: location.lon,
          },
        });
        setRestaurantData(response.data);
        const options = {
          center: new window.kakao.maps.LatLng(response.data.latitude, response.data.longitude),
          level: 3,
        };

        // 지도 생성
        const map = new window.kakao.maps.Map(mapContainer.current, options);

        // 마커 위치 설정
        const markerPosition = new window.kakao.maps.LatLng(response.data.latitude, response.data.longitude);

        // 마커 생성
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
        });

        // 마커를 지도에 표시
        marker.setMap(map);
      } catch (error) {
        console.error('Error fetching restaurant details:', error);
      }
    };

    // 음식점 메뉴 가져오기
    const fetchMenu = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/restaurants/${id}/menuInfo`);
        setMenuData(response.data);
      } catch (error) {
        console.error('Error fetching menu:', error);
      }
    };

    // 음식점 리뷰 가져오기
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/restaurants/${id}/review`);
        setReviewData(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    // 이미지 크롤링하여 가져오기
    const fetchImage = async () => {
      if (!restaurantData.image) {
        try {
          // restaurant 반환
          const response = await axios.get(`http://localhost:8080/restaurants/${id}/image`, {
            params: {
              lat: location.lat,
              lon: location.lon,
            },
          });
          setRestaurantData(response.data);
        } catch (error) {
          console.error('Error fetching menu:', error);
        }
      }
    };

    fetchRestaurantDetails();
    fetchMenu();
    fetchReviews();
    fetchImage();
  }, [id, location.lat, location.lon]);

  // 별점을 표시하는 함수
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= rating; i++) {
      stars.push(
          <Icon
            type='star_full'
            key={i}
          />,
      );
    }
    return <div className="place-stars">{stars}</div>;
  };

  // 태그를 렌더링하는 함수
  const renderTag = (restaurantTags) => {
    // Ensure tags is an array
    const tags = restaurantTags || [];
    if (tags.length === 0) return null;

    return (
      <div className="restaurant-tags">
        {tags.map((tag, index) => <span key={index} className="tag">#{tag}</span>)}
      </div>
    );
  };

  const [newReview, setNewReview] = useState({
    rating: 0,
    content: '',
    tag: [],
  });

  const handleReviewChange = (e) => {
    const {name, value} = e.target;
    setNewReview({
      ...newReview,
      [name]: value,
    });
  };

  const handleTagChange = (tag) => {
    const updatedTags = newReview.tag.includes(tag) ?
      newReview.tag.filter((t) => t !== tag) :
      [...newReview.tag, tag];
    setNewReview({
      ...newReview,
      tag: updatedTags,
    });
  };

  const handleSubmitReview = async () => {
    try {
      const response = await axios.post(
          `http://localhost:8080/restaurants/${id}/review`,
          newReview,
      );
      const savedReview = response.data;
      setReviewData((prevReviews) => [...prevReviews, savedReview]);
      setNewReview({
        rating: 0,
        content: '',
        tag: [],
      });
    } catch (error) {
      console.error('Error saving review:', error);
    }
  };

  // 시간을 이쁘게 보여주기
  const TimeParse = (props) => {
    const date = new Date(props.date);
    let stringDate = null;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    stringDate = year + '-' + month + '-' + day;

    return (
      <p className="review-time">{stringDate}</p>
    );
  };

  return (
    <div>
      {/* 음식 페이지 바 */}
      <div className="food-page-bar">
        <div className="food-title">
          <Icon type="Food" />
          식당 검색
        </div>
        <div className="spacer"></div>
        <div className="right-icons">
          <Icon type="Location" />
          <div className='location-info'>
            <b><LocationInfo /></b>
          </div>
          <div className="food-search-bar">
            <SearchBar />
          </div>
        </div>
      </div>

      {/* 음식점 정보 섹션 */}
      <div className="restaurant-info">
        <div className="restaurant-name-and-rating">
          <h1>
            {restaurantData ? restaurantData.name : '가게 이름'}
          </h1>
          <div className="restaurant-rating">
            {restaurantData ? renderStars(restaurantData.rating) : renderStars(0)}
          </div>
          {/* 주소와 거리 표시 */}
          <div className="restaurant-location">
            {restaurantData ? (
              <p>주소: {restaurantData.address} ({restaurantData.distance}m)</p>
            ) : (
              <p>주소 정보 미등록 상태입니다.</p>
            )}
          </div>
        </div>
        <div>
          <div className="restaurant-category">
            {restaurantData ? `카테고리 > ${restaurantData.categoryMiddleName}` : '카테고리'}
            <p><div className='restaurant-item-tag'>{renderTag(restaurantData.tag)}</div></p>

          </div>
        </div>
      </div>

      {/* 음식점 상세 정보 및 지도 섹션 */}
      <div className="restaurant-details-and-map">
        {menuData.length > 0 ? (
          <div className="restaurant-details">
            {/* <h2>메뉴</h2> */}
            <ul>
              {menuData.map((menu, index) => (
                <li key={index}>
                  <p className="restaurant-menu-name"><b>{menu.name}</b></p>
                  {menu.price ? <p className="restaurant-menu-price">{menu.price}원</p> : ''}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div
          className={`restaurant-map ${menuData.length === 0 ? 'full-width' : ''}`}
          ref={mapContainer}
          style={{width: '100%', height: '400px'}}>
          {/* 지도 컴포넌트 */}
        </div>
      </div>
      <p></p>

      {/* 리뷰 섹션 */}

      {/* 리뷰와 이미지를 담을 컨테이너 */}
      <div className="restaurant-reviews-and-image">
        {/* 리뷰 작성 섹션 */}
        <div className="restaurant-review-write-and-image">
          <div className="restaurant-review-write">
            <div><b>매장 리뷰</b></div>
            <p></p>
            <textarea
              className="review-textarea"
              name="content"
              placeholder="리뷰를 작성하세요"
              value={newReview.content}
              onChange={handleReviewChange}
            />

            <div className="review-bottom-section">
              <div className="review-rating-and-tags">
                <div className="review-tags">
                  태그: &nbsp;{['가성비', '혼밥', '친절한', '배터지는', '신선한', '청결한'].map((tag) => (
                    <button
                      key={tag}
                      className={`tag-button ${
                        newReview.tag.includes(tag) ? 'selected' : ''
                      }`}
                      onClick={() => handleTagChange(tag)}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
                <p></p>

                <div className="review-rating">
                  <label htmlFor="rating-select">평점 선택:&nbsp;</label>
                  <select
                    id="rating-select"
                    name="rating"
                    value={newReview.rating}
                    onChange={handleReviewChange}
                  >
                    <option value="0">평점 선택</option>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <p></p>
            &nbsp;
              <button className="submit-review-button" onClick={handleSubmitReview}>리뷰 저장
              </button>
            </div>
          </div>


        </div>
        <p></p>


        {/* 리뷰 목록 */}
        <div className="restaurant-reviews">

          {reviewData.map((review, index) => (
            <div key={index} className="review-item">
              <div className="review-rating">{renderStars(review.rating)}</div>
              <p>{review.tag.map((str) => `#${str}`).join(' ')}</p>
              <p className="review-content">{review.content}</p>
              <TimeParse date={review.createdAt} />
              <p className="review-author">
                <img className="reviewThumbnail" src={review.thumbnail} />{review.nickname}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Food_RestaurantPage;
