import React, { useState, useEffect } from 'react';
import AdminMenu from '../../components/Layout/AdminMenu';
import Layout from '../../components/Layout/Layout';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Products = () => {
  const [products, setProducts] = useState([]);

  const getAllProducts = async () => {
    try {
      const { data } = await axios.get('/api/product/get-product');
      setProducts(data.products);
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <Layout title={'Products'}>
      <div className='row m-3 p-3'>
        <div className='col-md-3'>
          <AdminMenu />
        </div>
        <div className='col-md-9 w-75'>
          <h1 className='text-center'>All Products</h1>
          <div className='d-flex '>
            {products?.map((p) => (
              <Link to={`/dashboard/admin/product/${p.slug}`} className='product-link'>
                <div
                  className='card m-2'
                  style={{ width: '18rem' }}
                  key={p._id}
                >
                  <img src={`/api/product/product-photo/${p._id}`} className='card-img-top' alt={p.name} />
                  <div className='card-body'>
                    <h5 className='card-title'>{p.name}</h5>
                    <p className='card-text'>{p.description}</p>
                    <p className='card-text'>${p.price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
