import React, { useEffect, useState } from 'react';
import { CiEdit } from "react-icons/ci";
import { FaRegTrashAlt } from "react-icons/fa";
import { getToken } from "../../utils/auth";

const CatalogProduct = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  
  const [confirmMessage, setConfirmMessage] = useState('');
  const [onConfirm, setOnConfirm] = useState(null);

  useEffect(() => {
    // Ambil data dari backend
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Failed to fetch products:', err));
  }, []);

  const handleDelete = (id) => {
    showConfirmAlert('Are you sure you want to delete this product?', async () => {
      try {
        const token = getToken();
        await fetch(`http://localhost:5000/api/products/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setProducts(products.filter(p => p._id !== id));
        triggerAlert('Product deleted successfully!');
      } catch (error) {
        console.error('Delete failed', error);
        triggerAlert('Failed to delete product');
      }
    })
    };
  
    const triggerAlert = (message) => {
      setAlertMessage(message);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000); // hilang setelah 3 detik
    };
    
    const showConfirmAlert = (message, onConfirmAction) => {
      setConfirmMessage(message);
      setOnConfirm(() => onConfirmAction); // simpan fungsi callback
    };
    
    
    const handleEdit = (product) => {
    setSelectedProduct(product);
    setEditModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#4B7F52]">Product Catalog</h2>
          <button
            onClick={() => setShowModal(true)} // ✅ open modal
            className="bg-[#4B7F52] text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            <i className="fas fa-plus mr-2"></i> Add Product
          </button>
        </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <img
              src={`http://localhost:5000${product.imageUrl}`}
              alt={product.name}
              className="w-full h-60 object-cover"
              onError={(e) => e.target.src = 'https://via.placeholder.com/200'}
            />
            <div className="p-4 bg-[#ECD79B] flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-[#606C38] mb-2">{product.name}</h3>
                <p className="text-[#606C38] font-bold">Rp {Number(product.price).toLocaleString('id-ID')}</p>
              </div>
              <div className='text-center'>
                <h3 className='text-lg font-semibold text-[#606C38] mb-2'>Stok</h3>
                <h4 className='text-[#606C38] font-bold'>{product.stock}</h4>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="rounded-md bg-[#4B7F52]-100 px-2 py-1 text-lg font-medium text-[#4B7F52] ring-1 ring-[#606C38] ring-inset hover:bg-[#606C38] hover:text-white focus:outline-none focus:ring-2 focus:ring-green-600/50 w-8 h-8 flex items-center justify-center"
                ><CiEdit /></button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="rounded-md bg-red-60 px-2 py-1 text-lg font-medium text-red-700 ring-1 ring-red-600/20 ring-inset hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-600/50 w-8 h-8 flex items-center justify-center"
                ><FaRegTrashAlt /></button>
              </div>
              {/* <button className="mt-4 bg-[#4B7F52] text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
                Add to Cart
              </button> */}
            </div>
          </div>
        ))}
      </div>

      {/* ✅ MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/75">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Tambah Product Fluerish</h2>
            <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);

                  try {
                    const token = getToken();
                    const res = await fetch('http://localhost:5000/api/products', {
                      method: 'POST',
                      headers: {
                        'Authorization': `Bearer ${token}`
                      },
                      body: formData
                    });

                    const result = await res.json();
                    triggerAlert('Product added successfully!');
                    setProducts([...products, result]); // update list
                    setShowModal(false);
                  } catch (error) {
                    console.error('Error:', error);
                    triggerAlert('Failed to add product');
                  }
                }}
                encType="multipart/form-data"
              >
              <div className="grid grid-cols-1 gap-4">
                <input type="text" name="name" placeholder="Name Product" required className="border p-2 rounded" />
                <input type="file" name="image" accept="image/*" required className="border p-2 rounded" />
                <input type="number" name="price" placeholder="Harga Product" required className="border p-2 rounded" />
                <input type="number" name="stock" placeholder="Stock Product" required className="border p-2 rounded" />
                <select name="status" required className="border p-2 rounded">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" name="codAvailable" className="form-checkbox" />
                  <span>COD Available</span>
                </label>
                <textarea name="description" placeholder="Description" className="border p-2 rounded" />
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#4B7F52] text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* ✅ MODAL EDIT */}
      {editModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/75">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Edit Product</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);

                try {
                  const token = getToken();
                  const res = await fetch(`http://localhost:5000/api/products/${selectedProduct._id}`, {
                    method: 'PUT',
                    headers: {
                      'Authorization': `Bearer ${token}`
                    },
                    body: formData
                  });

                  const updated = await res.json();
                  setProducts(products.map(p => (p._id === updated._id ? updated : p)));
                  setEditModalOpen(false);
                  setSelectedProduct(null);
                  triggerAlert('Product updated successfully!');
                } catch (error) {
                  console.error('Error updating:', error);
                  alert('Failed to update product');
                }
              }}
              encType="multipart/form-data"
            >
              <div className="grid grid-cols-1 gap-4">
                <label htmlFor="name">Nama Product</label>
                <input type="text" name="name" defaultValue={selectedProduct.name} required className="border p-2 rounded" />
                <label htmlFor="price">Harga</label>
                <input type="number" name="price" defaultValue={selectedProduct.price} required className="border p-2 rounded" />
                <label htmlFor="stock">Stock</label>
                <input type="number" name="stock" defaultValue={selectedProduct.stock} required className="border p-2 rounded" />
                <label htmlFor="status">Status</label>
                <select name="status" defaultValue={selectedProduct.status} required className="border p-2 rounded">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="codAvailable"
                    defaultChecked={selectedProduct.codAvailable}
                    className="form-checkbox"
                  />
                  <span>COD Available</span>
                </label>
                <label htmlFor="description">Deskripsi</label>
                <textarea name="description" defaultValue={selectedProduct.description} className="border p-2 rounded" />
                <label htmlFor="image">Foto Product</label>
                <input type="file" name="image" accept="image/*" className="border p-2 rounded" />
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditModalOpen(false);
                    setSelectedProduct(null);
                  }}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#4B7F52] text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm">
            <p className="text-gray-800 text-center mb-4">{confirmMessage}</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setConfirmMessage('');
                  setOnConfirm(null);
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (onConfirm) onConfirm();
                  setConfirmMessage('');
                  setOnConfirm(null);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogProduct;
