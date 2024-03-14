// SearchContext.js
import React, {createContext, useState} from 'react';

export const SearchContext = createContext();

export const SearchProvider = ({children}) => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const updateSearchResults = (results) => {
    setSearchResults(results);
  };

  const updateSearchQuery = (query) => {
    setSearchQuery(query);
  };

  return (
    <SearchContext.Provider value={{searchResults, searchQuery, updateSearchResults, updateSearchQuery}}>
      {children}
    </SearchContext.Provider>
  );
};
