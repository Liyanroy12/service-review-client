import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Service = () => {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredServices, setFilteredServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  // Fetch services from the server
  useEffect(() => {
    fetch('https://service-review-system-server-kappa.vercel.app/services')
      .then((res) => res.json())
      .then((data) => {
        setServices(data);
        setFilteredServices(data); // Set initially to all services
        const uniqueCategories = [...new Set(data.map((service) => service.category))];
        setCategories(uniqueCategories); // Extract unique categories
      });
  }, []);

  // Handle search input changes
  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearchTerm(keyword);
    filterServices(keyword, selectedCategory);
  };

  // Handle category selection changes
  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    filterServices(searchTerm, category);
  };

  // Filter services based on search term and category
  const filterServices = (keyword, category) => {
    const filtered = services.filter((service) => {
      const matchesSearch =
        service.companyName.toLowerCase().includes(keyword) ||
        service.serviceTitle.toLowerCase().includes(keyword) ||
        service.category.toLowerCase().includes(keyword);
      const matchesCategory = category ? service.category === category : true;
      return matchesSearch && matchesCategory;
    });
    setFilteredServices(filtered);
  };

  return (
    <div className='w-11/12 mx-auto'>
      <div className="my-4 flex gap-4">
        <input
          type="text"
          placeholder="Search services..."
          value={searchTerm}
          onChange={handleSearch}
          className="p-2 border border-gray-300 rounded w-full"
        />
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredServices.map((service) => (
          <div key={service._id} className="border p-4 rounded shadow">
            <img src={service.serviceImage} alt={service.serviceTitle} className="w-full h-40 object-cover mb-4" />
            <h1 className="text-lg font-bold">Company Name: {service.companyName}</h1>
            <h2 className="text-md text-gray-600">Title: {service.serviceTitle}</h2>
            <p className="text-sm text-gray-500">Description: {service.description}</p>
            <p className="text-sm font-semibold">Category: {service.category}</p>
            <p className="text-lg font-bold text-orange-500">Price: ${service.price}</p>
              <Link className='w-full' to={`/service/${service._id}`}>
                <button className="btn btn-warning mt-4 block text-center w-full">Details</button>
              </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Service;
