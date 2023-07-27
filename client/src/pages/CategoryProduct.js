import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/cart';
import { toast } from 'react-hot-toast';
import '../styles/CategoryProductStyles.css';

const CategoryProduct = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const [cart, setCart] = useCart();

  const navigate = useNavigate();

  useEffect(() => {
    if (params?.slug) getProductsByCat();
  }, [params?.slug]);
  const getProductsByCat = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `/api/product/product-category/${params.slug}`
      );
      setProducts(data?.products);
      setCategory(data?.category);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Layout>
      <div className='container mt-3 category'>
        {loading ? (
          <>
            <h4 className='text-center'>Category </h4>
            <h6 className='text-center'>Loading...</h6>
          </>
        ) : (
          <>
            <h4 className='text-center'>Category {category?.name}</h4>
            <h6 className='text-center'>{products?.length} result found</h6>
            <div className='row justify-content-center'>
              <div className='col-md-12'>
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
                          {/* <button
                  className="btn btn-dark ms-1"
                  onClick={() => {
                    setCart([...cart, p]);
                    localStorage.setItem(
                      "cart",
                      JSON.stringify([...cart, p])
                    );
                    toast.success("Item Added to cart");
                  }}
                >
                  ADD TO CART
                </button> */}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* <div className="m-2 p-3">
          {products && products.length < total && (
            <button
              className="btn btn-warning"
              onClick={(e) => {
                e.preventDefault();
                setPage(page + 1);
              }}
            >
              {loading ? "Loading ..." : "Loadmore"}
            </button>
          )}
        </div> */}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default CategoryProduct;
