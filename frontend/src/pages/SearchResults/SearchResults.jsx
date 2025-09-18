import React from "react";
import { useStore } from "../../context/StoreContext";
import ProductItem from "../../components/ProductItem/ProductItem";
import "./SearchResults.css";

const SearchResults = () => {
  const { searchResults } = useStore();

  return (
    <div className="search-results">
      <div className="search-results-products">
        {searchResults.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
