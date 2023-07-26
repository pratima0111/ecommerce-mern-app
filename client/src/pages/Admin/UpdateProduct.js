import React, { useState, useEffect } from 'react';
import AdminMenu from '../../components/Layout/AdminMenu';
import Layout from '../../components/Layout/Layout';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Select } from 'antd';
const { Option } = Select;

const UpdateProduct = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [categories, setCategories] = useState([]);
  const [id, setId] = useState('');
  const [photo, setPhoto] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState('');
  const [shipping, setShipping] = useState('');

  //GET SINGLE PRODUCT
  const getOneProduct = async () => {
    try {
      const { data } = await axios.get(
        `/api/product/single-product/${params.slug}`
      );
      setName(data.product.name);
      setId(data.product._id);
      setDescription(data.product.description);
      setPrice(data.product.price);
      setQuantity(data.product.quantity);
      setCategory(data.product.category._id);
      setShipping(data.product.shipping);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(
    () => {
      getOneProduct();
    },
    //eslint-disable-next-line
    []
  );
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

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      productData.append('name', name);
      productData.append('description', description);
      productData.append('quantity', quantity);
      productData.append('price', price);
      photo && productData.append('photo', photo);
      productData.append('category', category);
      const { data } = await axios.put(
        `/api/product/update-product/${id}`,
        productData
      );
      if (data?.success) {
        toast.success('Produt Updated successfully');
        navigate('/dashboard/admin/products');
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
    }
  };

  const handleDelete = async() => {
    try{
        let answer = window.prompt('Are you sure you want to delete this product?')
        if (!answer) return;
        const {data} = await axios.delete(`/api/product/delete-product/${id}`);
        toast.success('Product deleted successfully')
        navigate('/dashboard/admin/products')
    }catch(error){
      console.log(error)
      toast.error('Something went wrong')
    }
  }


  return (
    <Layout title={'Dashboard: Update Product'}>
      <div className='container-fluid m-3 p-3'>
        <div className='row'>
          <div className='col-md-3'>
            <AdminMenu />
          </div>
          <div className='col-md-9 '>
            <h1>Update Product</h1>
            <div className='m-1 w-75'>
              <Select
                bordered={false}
                placeholder='Select a category'
                size='large'
                showSearch
                className='form-select mb-3'
                onChange={(value) => {
                  setCategory(value);
                }}
                value={category}
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
                {photo ? (
                  <div className='text-center'>
                    <img
                      src={URL.createObjectURL(photo)}
                      alt='product-pic'
                      height={'200px'}
                      className='img img-responsive'
                    />
                  </div>
                ) : (
                  <div className='text-center'>
                    <img
                      src={`/api/product/product-photo/${id}`}
                      height={'200px'}
                      className='img img-responsive'
                      alt='product-img'
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
                  value={shipping ? 'Yes' : 'No'}
                >
                  <Option value='0'>No</Option>
                  <Option value='1'>Yes</Option>
                </Select>
              </div>
              <div className='mb-3'>
                <button className='btn btn-primary' onClick={handleUpdate}>
                  UPDATE PRODUCT
                </button>
              </div>
              <div className="mb-3">
                <button className='btn btn-danger' onClick={handleDelete}>
                  DELETE PRODUCT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UpdateProduct;
