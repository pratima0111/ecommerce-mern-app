import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { Checkbox, Radio } from 'antd';
import axios from 'axios';
import { Prices } from '../components/Prices';
import { useCart } from '../context/cart';
import { toast } from 'react-hot-toast';
import { AiOutlineReload } from 'react-icons/ai';
import '../styles/HomePage.css';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [cart, setCart] = useCart();

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get('/api/category/categories');
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);

  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/product/product-list/${page}`);
      setLoading(false);
      setProducts(data.products);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!checked.length && !radio.length) getAllProducts();
  }, [checked.length, radio.length]);

  useEffect(() => {
    if (checked.length || radio.length) filterProducts();
  }, [checked, radio]);

  const getTotal = async () => {
    try {
      const { data } = await axios.get('/api/product/product-count');
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);

  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/product/product-list/${page}`);
      setLoading(false);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  //filter by category, value={true(checked) or false(unchecked)}
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      //if the checkbox is checked, push it's id to the array of checked categories
      all.push(id);
    } else {
      //if checkbox unchecked, remove the checked category from the array
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };

  //get filtered product
  const filterProducts = async () => {
    try {
      const { data } = await axios.post('/api/product/filter-product', {
        checked,
        radio,
      });
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout title={'All Products - Best offers '}>
      {/* banner image */}
      <img
        src='/images/banner.png'
        className='banner-img'
        alt='bannerimage'
        width={'100%'}
      />
      {/* banner image */}
      <div className='container-fluid row g-0 mt-3 home-page'>
        <div className='container-fluid col-md-3 filters'>
          <h4 className='text-center'>Filter By Category</h4>
          <div className='d-flex flex-column justify-content-center'>
            {categories?.map((c) => (
              <Checkbox
                key={c._id}
                onChange={(e) => handleFilter(e.target.checked, c._id)}
              >
                {c.name}
              </Checkbox>
            ))}
          </div>
          {/* price filter */}
          <h4 className='text-center mt-4'>Filter By Price</h4>
          <div className='d-flex flex-column'>
            <Radio.Group onChange={(e) => setRadio(e.target.value)}>
              {Prices?.map((p) => (
                <div key={p._id}>
                  <Radio value={p.array}>{p.name}</Radio>
                </div>
              ))}
            </Radio.Group>
          </div>
          <div className='d-flex flex-column mb-4'>
            <button
              className='btn btn-danger'
              onClick={() => window.location.reload()}
            >
              RESET FILTERS
            </button>
          </div>
        </div>
        <div className='col-md-9 justify-content-center'>
          <h1 className='text-center'>All Products</h1>
          <div className='d-flex flex-wrap justify-content-center'>
            {products?.map((p) => (
              <div className='card m-2' key={p._id}>
                <img
                  src={`/api/product/product-photo/${p._id}`}
                  className='card-img-top'
                  alt={p.name}
                />
                <div className='card-body'>
                  <div className='card-name-price'>
                    <h5 className='card-title'>{p.name}</h5>
                    <h5 className='card-title card-price'>
                      {p.price.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      })}
                    </h5>
                  </div>
                  <p className='card-text '>
                    {p.description.substring(0, 60)}...
                  </p>
                  <div className='card-name-price'>
                    <button
                      className='btn btn-info ms-1'
                      onClick={() => navigate(`/product/${p.slug}`)}
                    >
                      More Details
                    </button>
                    <button
                      className='btn btn-dark ms-1'
                      onClick={() => {
                        setCart([...cart, p]);
                        localStorage.setItem(
                          'cart',
                          JSON.stringify([...cart, p])
                        );
                        toast.success('Item Added to cart');
                      }}
                    >
                      ADD TO CART
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className='m-2 p-3'>
            {products && products.length < total && (
              <button
                className='btn loadmore'
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);
                }}
              >
                {loading ? (
                  'Loading ...'
                ) : (
                  <>
                    {' '}
                    Loadmore <AiOutlineReload />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
