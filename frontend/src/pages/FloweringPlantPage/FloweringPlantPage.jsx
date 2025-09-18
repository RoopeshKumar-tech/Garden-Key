import React, { useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import ProductItem from '../../components/ProductItem/ProductItem';

const typeToName = {
  rose: 'Rose Plants',
  tulip: 'Tulip Plants',
  lily: 'Lily Plants',
};

const FloweringPotPage = () => {
  const { type } = useParams();
  const { productList, loading } = useContext(StoreContext);

  // Filter products based on the type
  const filteredProducts = useMemo(() => {
    if (!productList) return [];
    // You may need to adjust this filter logic based on your product data structure
    return productList.filter(
      (product) =>
        product.category === 'Flowering Pots' &&
        product.name.toLowerCase().includes(type)
    );
  }, [productList, type]);

  return (
    <div className="flowering-pot-page" style={{ padding: '32px 0' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>
        {typeToName[type] || 'Flowering Pots'}
      </h2>
      {loading ? (
        <div style={{ textAlign: 'center' }}>Loading...</div>
      ) : filteredProducts.length === 0 ? (
        <div style={{ textAlign: 'center' }}>No products found for this category.</div>
      ) : (
        <div className="flowering-pot-products" style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>
          {filteredProducts.map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FloweringPotPage;