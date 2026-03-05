import { useState, useEffect } from 'react';
import categoriesData from '../data/categories.json';

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 300));
        setCategories(categoriesData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load categories');
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const getCategoryById = (id) => {
    return categories.find(category => category.id === parseInt(id));
  };

  const getCategoryName = (id) => {
    const category = getCategoryById(id);
    return category ? category.category_name : 'Uncategorized';
  };

  const getMainCategories = (limit = 5) => {
    return categories.slice(0, limit);
  };

  const searchCategories = (searchTerm) => {
    return categories.filter(cat => 
      cat.category_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getCategoryHierarchy = () => {
    // Group categories by first letter for display
    const grouped = {};
    categories.forEach(category => {
      const firstLetter = category.category_name[0].toUpperCase();
      if (!grouped[firstLetter]) {
        grouped[firstLetter] = [];
      }
      grouped[firstLetter].push(category);
    });
    
    // Sort letters alphabetically
    const sortedLetters = Object.keys(grouped).sort();
    
    return sortedLetters.map(letter => ({
      letter,
      categories: grouped[letter].sort((a, b) => 
        a.category_name.localeCompare(b.category_name)
      )
    }));
  };

  return {
    categories,
    loading,
    error,
    getCategoryById,
    getCategoryName,
    getMainCategories,
    searchCategories,
    getCategoryHierarchy
  };
};