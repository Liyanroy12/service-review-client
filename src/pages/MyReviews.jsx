import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { authContext } from '../components/Authprovider/AuthProvider';

const MyReviews = () => {
  const { user } = useContext(authContext);
  const [services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [updatedService, setUpdatedService] = useState({
    rating: 0,
    text: '',

  });


  console.log(services)

  useEffect(() => {
    if (user) {
      fetch(`https://service-review-system-server-kappa.vercel.app/user/reviews?email=${user.email}`)
        .then(res => res.json())
        .then(data => setServices(data));
    }
  }, [user]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const openDeleteModal = (service) => {
    setSelectedService(service);
    setIsDeleteModalOpen(true);
    handleDelete();
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedService(null);
  };

  const handleDelete = (_id) => {

    fetch(`https://service-review-system-server-kappa.vercel.app/deleteReview/${_id}`, {
      method: 'DELETE',

    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'Service deleted successfully.') {
          setServices(services.filter(service => service._id !== _id));
        } else {
          console.error('Delete error:', data.message);
        }
        closeDeleteModal();
      })
      .catch(error => {
        console.error("Delete error:", error);
      });
  };

  const openUpdateModal = (service) => {
    setSelectedService(service);
    setUpdatedService({
      rating: service.rating,
      text: service.text,
    });

    document.getElementById('my_modal_5').showModal()
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedService(null);
  };

  const handleUpdate = () => {
    // const token = localStorage.getItem('token');

    console.log(updatedService)

    fetch(`https://service-review-system-server-kappa.vercel.app/updateReview/${selectedService._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updatedService),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'Service updated successfully.') {
          setServices(services.map(service =>
            service._id === selectedService._id ? { ...service, ...updatedService } : service
          ));
        } else {
          console.error('Update error:', data.message);
        }
        closeUpdateModal();
      })
      .catch(error => {
        console.error("Update error:", error);
      });
  };

  return (
    <div className='w-11/12 mx-auto'>
      <div className='flex justify-center my-4'>
        <input
          type="text"
          placeholder="Search services..."
          value={searchQuery}
          onChange={handleSearch}
          className="mb-4 py-2 px-24 border rounded"
        />
      </div>
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th>Service Title</th>
            <th>Rating</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service._id}>
              <td className='text-center'>{service.text}</td>
              <td className='text-center'>{service.rating}</td>
              <td className='text-center'>

                <Link to={`/service/${service._id}`} className="btn btn-warning mr-2">Details</Link>
                <button
                  className="btn btn-info mr-2"
                  onClick={() => openUpdateModal(service)}
                >
                  Update
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(service._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Are you sure you want to delete this service?</h2>
            <button onClick={handleDelete}>Yes</button>
            <button onClick={closeDeleteModal}>No</button>
          </div>
        </div>
      )}

      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          {/* <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">Press ESC key or click the button below to close</p> */}
          <div className="modal-action">
            <div className=''>
              <h2>Update Service</h2>
              <div className='flex gap-4'>
                <input
                  type="number"
                  value={updatedService.rating}
                  onChange={(e) => setUpdatedService({ ...updatedService, rating: e.target.value })}
                  placeholder="Service Title"
                  className='border'
                />
                <textarea
                  value={updatedService.text}
                  onChange={(e) => setUpdatedService({ ...updatedService, text: e.target.value })}
                  placeholder="Description"
                  className='border'
                />
              </div>
              <div className='flex justify-center gap-5 my-5'>
                <button className='btn' onClick={handleUpdate}>Update</button>
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button className="btn">Close</button>
                </form>
              </div>
              {/* <button onClick={closeUpdateModal}>Cancel</button> */}
            </div>

          </div>
        </div>
      </dialog>
    </div>
  );
};

export default MyReviews;
