import React, { useState } from 'react';

const ProductModal = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    if (image) formData.append('image', image);
    onSave(formData);
  };


  return (
    <div className="fixed flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold text-[#4B7F52] mb-4">Add New Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700">Product Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full border px-3 py-2 rounded-md" />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Price</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required className="w-full border px-3 py-2 rounded-md" />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Product Image</label>
            <input type="file" onChange={(e) => setImage(e.target.files[0])} accept="image/*" className="w-full" />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button"  className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-[#4B7F52] text-white rounded-md">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;