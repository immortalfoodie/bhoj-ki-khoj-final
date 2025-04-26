import React from 'react';

const schedules = [
  { id: 1, task: 'Prepare breakfast orders', time: '7:00 AM - 9:00 AM' },
  { id: 2, task: 'Lunch preparation', time: '11:00 AM - 1:00 PM' },
  { id: 3, task: 'Evening snacks and tea', time: '4:00 PM - 5:30 PM' },
  { id: 4, task: 'Dinner preparation', time: '7:00 PM - 9:00 PM' },
];

const Schedule = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Schedule</h1>
      <p className="mb-4">This is the Schedule page for the Restaurant dashboard.</p>

      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold mb-4">Today's Tasks</h2>
        <ul className="space-y-3">
          {schedules.map((item) => (
            <li key={item.id} className="flex items-center justify-between">
              <div className="font-medium">{item.task}</div>
              <div className="text-sm text-gray-600">{item.time}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Schedule;
