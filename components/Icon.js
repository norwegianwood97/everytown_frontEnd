import React from 'react';
import {Link} from 'react-router-dom';
import './Icon.css';
import Food from '../assets/이미지/food_logo.png';
import Place from '../assets/이미지/place_logo.png';
import Chat from '../assets/이미지/chat_logo.png';
import Community from '../assets/이미지/community_logo.png';
import Location from '../assets/이미지/location.png';
import map_icon from '../assets/이미지/map_icon.png';
import people_icon from '../assets/이미지/people_icon.png';
import person_icon from '../assets/이미지/person_icon.png';
import search_icon from '../assets/이미지/search_icon.png';
import star_empty from '../assets/이미지/star_empty.png';
import star_full from '../assets/이미지/star_full.png';
import tag_icon from '../assets/이미지/tag_icon.png';

function Icon({type, name, showName = false, textPosition = 'bottom'}) {
  let iconSrc;

  switch (type) {
    case 'Food':
      iconSrc = Food;
      break;
    case 'Place':
      iconSrc = Place;
      break;
    case 'Chat':
      iconSrc = Chat;
      break;
    case 'Community':
      iconSrc = Community;
      break;
    case 'Location':
      iconSrc = Location;
      break;
    case 'map_icon':
      iconSrc = map_icon;
      break;
    case 'people_icon':
      iconSrc = people_icon;
      break;
    case 'person_icon':
      iconSrc = person_icon;
      break;
    case 'search_icon':
      iconSrc = search_icon;
      break;
    case 'star_empty':
      iconSrc = star_empty;
      break;
    case 'star_full':
      iconSrc = star_full;
      break;
    case 'tag_icon':
      iconSrc = tag_icon;
      break;
    default:
      iconSrc = '';
  }

  const isLinkIcon = ['Food', 'Place', 'Chat', 'Community'].includes(type);

  const className = `icon ${
    showName ? (textPosition === 'right' ? 'with-text-right' : 'with-name') : ''
  }`;

  const iconElement = (
    <div className={className}>
      {type === 'star_full' ? (
        <img
          src={iconSrc}
          alt={type}
          style={{width: '20px', height: 'auto'}}
        />
      ) : (
        <img src={iconSrc} alt={type} />
      )}
      {showName && <p className="icon-name">{name}</p>}
    </div>
  );

  if (isLinkIcon) {
    return <Link to={`/${type.toLowerCase()}`}>{iconElement}</Link>;
  }

  return iconElement;
}

export default Icon;
