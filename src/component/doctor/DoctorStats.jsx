// components/DoctorStats.jsx
import { FaCalendarAlt, FaRupeeSign, FaUserClock } from 'react-icons/fa';

const DoctorStats = ({ slots }) => {
  const stats = {
    totalSlots: slots.length,
    bookedSlots: slots.filter(slot => slot.isBooked).length,
    totalRevenue: slots.reduce((sum, slot) => sum + (slot.isBooked ? slot.price : 0), 0)
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 mb-6">
      <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
        <div className="flex items-center">
          <FaCalendarAlt className="text-blue-500 text-2xl mr-3" />
          <div>
            <p className="text-gray-500 dark:text-gray-300 text-sm">Total Slots</p>
            <p className="text-xl font-bold dark:text-white">{stats.totalSlots}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
        <div className="flex items-center">
          <FaUserClock className="text-green-500 text-2xl mr-3" />
          <div>
            <p className="text-gray-500 dark:text-gray-300 text-sm">Booked Slots</p>
            <p className="text-xl font-bold dark:text-white">{stats.bookedSlots}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
        <div className="flex items-center">
          <FaRupeeSign className="text-purple-500 text-2xl mr-3" />
          <div>
            <p className="text-gray-500 dark:text-gray-300 text-sm">Estimated Revenue</p>
            <p className="text-xl font-bold dark:text-white">₹{stats.totalRevenue}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorStats;