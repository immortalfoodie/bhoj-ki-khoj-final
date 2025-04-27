import React, { useState } from 'react';

const initialHotels = [
  {
    id: 'HOTEL001',
    name: 'Balaji Caterers',
    menuItems: [
      { id: 'ITEM001', name: 'Pav Bhaji', price: '₹80.00', available: true },
      { id: 'ITEM002', name: 'Vada Pav', price: '₹20.00', available: true },
      { id: 'ITEM003', name: 'Masala Dosa', price: '₹70.00', available: false },
      { id: 'ITEM004', name: 'Upma', price: '₹30.00', available: true },
      { id: 'ITEM005', name: 'Poha', price: '₹25.00', available: true },
      { id: 'ITEM006', name: 'Idli Sambar', price: '₹50.00', available: false },
    ],
  },
  {
    id: 'HOTEL002',
    name: 'Punjabi Zaika',
    menuItems: [
      { id: 'ITEM007', name: 'Butter Chicken', price: '₹280.00', available: true },
      { id: 'ITEM008', name: 'Paneer Tikka', price: '₹220.00', available: true },
      { id: 'ITEM009', name: 'Amritsari Kulcha', price: '₹100.00', available: false },
      { id: 'ITEM010', name: 'Aloo Paratha', price: '₹50.00', available: true },
      { id: 'ITEM011', name: 'Chole Bhature', price: '₹90.00', available: true },
      { id: 'ITEM012', name: 'Rajma Chawal', price: '₹80.00', available: false },
    ],
  },
  {
    id: 'HOTEL003',
    name: 'Chaat Ka Kamal',
    menuItems: [
      { id: 'ITEM013', name: 'Puneri Chaat', price: '₹50.00', available: true },
      { id: 'ITEM014', name: 'Assal Misal', price: '₹70.00', available: true },
      { id: 'ITEM015', name: 'Usal Pav', price: '₹50.00', available: false },
      { id: 'ITEM016', name: 'Dahi Puri', price: '₹40.00', available: true },
      { id: 'ITEM017', name: 'Sev Puri', price: '₹35.00', available: true },
      { id: 'ITEM018', name: 'Samosa Chaat', price: '₹45.00', available: false },
    ],
  },
];

const MenuManagement = () => {
  const [hotels, setHotels] = useState(initialHotels);

  const toggleAvailability = (hotelId, itemId) => {
    const updatedHotels = hotels.map((hotel) => {
      if (hotel.id === hotelId) {
        const updatedMenuItems = hotel.menuItems.map((item) => {
          if (item.id === itemId) {
            return { ...item, available: !item.available };
          }
          return item;
        });
        return { ...hotel, menuItems: updatedMenuItems };
      }
      return hotel;
    });
    setHotels(updatedHotels);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-900">Menu Management</h1>
      {hotels.map((hotel) => (
        <div key={hotel.id} className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 border-b-2 border-b-gray-300 pb-2">{hotel.name}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {hotel.menuItems.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 shadow hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-medium mb-1">{item.name}</h3>
                <p className="text-gray-700 mb-2">Price: {item.price}</p>
                {item.available ? (
                  <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-semibold">Available</span>
                ) : (
                  <span className="inline-block px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-semibold">Unavailable</span>
                )}
                <button
                  onClick={() => toggleAvailability(hotel.id, item.id)}
                  className="mt-3 inline-block px-4 py-1 rounded bg-blue-500 text-white text-xs font-semibold hover:bg-blue-600 transition-colors"
                >
                  {item.available ? 'Mark Unavailable' : 'Mark Available'}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuManagement;
