import React from 'react';
import Layout from '../components/Layout/Layout';
import { useSearch } from '../context/search';

const Search = () => {
  const [values, setValues] = useSearch();

  return (
    <Layout title={'Search Results'}>
      <div className='container search-box'>
        <div className='text-center mt-4'>
          <h1>Search Results</h1>
          <h6>
            {values?.results.length < 1
              ? 'No Products Found'
              : `Found ${values?.results.length}`}
          </h6>
          <div className='d-flex flex-wrap'>
            {values?.results.map((p) => (
              <div className='card m-2' style={{ width: '18rem' }} key={p._id}>
                <img
                  src={`/api/product/product-photo/${p._id}`}
                  className='card-img-top'
                  alt={p.name}
                />
                <div className='card-body'>
                  <h5 className='card-title'>{p.name}</h5>
                  <p className='card-text'>{p.description}</p>
                  <p className='card-text'>${p.price}</p>
                  <button class='btn btn-primary ms-1'>More Details</button>
                  <button class='btn btn-secondary ms-1'>Add to Cart</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Search;
