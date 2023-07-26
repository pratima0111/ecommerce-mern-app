//custom hook to get all categories

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useCategory() {
  const [categories, setCategories] = useState([]);

  //get categories
  const getCategory = async () => {
    const { data } = await axios.get('/api/category/categories');
    setCategories(data?.category);
  };

  useEffect(() => {
    getCategory();
  }, []);

  return categories;
}
