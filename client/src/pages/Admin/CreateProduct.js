import React, { useState, useEffect } from 'react';
import AdminMenu from '../../components/Layout/AdminMenu';
import Layout from '../../components/Layout/Layout';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Select } from 'antd';
const { Option } = Select;

const CreateProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [photo, setPhoto] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState('');
  const [shipping, setShipping] = useState('');

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get('/api/category/categories');
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error('Error while fetching categories');
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      productData.append('name', name);
      productData.append('description', description);
      productData.append('quantity', quantity);
      productData.append('price', price);
      productData.append('photo', photo);
      productData.append('category', category);
      const { data } = await axios.post(
        '/api/product/create-product',
        productData
      );
      if (data?.success) {
        toast.success('Produt created successfully');
        navigate('/dashboard/admin/products');
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
    }
  };

  return (
    <Layout title={'Dashboard: Create Product'}>
      <div className='container-fluid'>
        <div className='row dashboard p-3'>
          <div className='col-md-3'>
            <AdminMenu />
          </div>
          <div className='col-md-9 text-center'>
            <div clasName='container'>
              <h1>Create Product</h1>
              <div className='m-1'>
                <Select
                  bordered={false}
                  placeholder='Select a category'
                  size='large'
                  showSearch
                  className='form-select mb-3'
                  onChange={(value) => {
                    setCategory(value);
                  }}
                >
                  {categories?.map((c) => (
                    <Option value={c._id} key={c._id}>
                      {c.name}
                    </Option>
                  ))}
                </Select>
                <div className='mb-3'>
                  <label className='btn btn-outline-secondary col-md-12'>
                    {photo ? photo.name : 'Upload Photo'}
                    <input
                      type='file'
                      name='photo'
                      accept='image/*'
                      onChange={(e) => setPhoto(e.target.files[0])}
                      hidden
                    />
                  </label>
                </div>
                <div className='mb-3'>
                  {photo && (
                    <div className='text-center'>
                      <img
                        src={URL.createObjectURL(photo)}
                        alt='product-pic'
                        height={'200px'}
                        className='img img-responsive'
                      />
                    </div>
                  )}
                </div>
                <div className='mb-3'>
                  <input
                    type='text'
                    value={name}
                    placeholder='Name'
                    className='form-control'
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className='mb-3'>
                  <textarea
                    type='text'
                    value={description}
                    placeholder='Description'
                    className='form-control'
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className='mb-3'>
                  <input
                    type='number'
                    value={price}
                    placeholder='Price'
                    className='form-control'
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
                <div className='mb-3'>
                  <input
                    type='number'
                    value={quantity}
                    placeholder='Quantity'
                    className='form-control'
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
                <div className='mb-3'>
                  <Select
                    bordered={false}
                    placeholder='Select Shipping '
                    size='large'
                    showSearch
                    className='form-select mb-3'
                    onChange={(value) => {
                      setShipping(value);
                    }}
                  >
                    <Option value='0'>No</Option>
                    <Option value='1'>Yes</Option>
                  </Select>
                </div>
                <div className='mb-3'>
                  <button className='btn btn-primary' onClick={handleCreate}>
                    CREATE PRODUCT
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateProduct;
