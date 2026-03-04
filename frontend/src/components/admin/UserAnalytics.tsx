import React, { useState, useEffect } from 'react';
import { Chart, Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { getApiEndpoint } from '../../utils/api';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

interface UserAnalyticsData {
  totalUsers: number;
  newUsersToday: number;
  verifiedUsers: number;
  usersByVerificationStatus: { _id: string; count: number }[];
  userGrowth: { _id: { year: number; month: number }; count: number }[];
}

const UserAnalytics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<UserAnalyticsData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('tagalong-token') || sessionStorage.getItem('tagalong-token');
        const response = await fetch(getApiEndpoint('/api/admin/analytics/users'), {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user analytics');
        }

        const analyticsData = await response.json();
        setData(analyticsData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-full">Loading analytics...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!data) return <div>No data available</div>;

  // Prepare data for user growth chart
  const growthLabels = data.userGrowth.map(item => {
    const month = new Date(0, item._id.month - 1).toLocaleString('default', { month: 'short' });
    return `${month} ${item._id.year}`;
  });

  const growthData = data.userGrowth.map(item => item.count);

  // Prepare data for verification status chart
  const statusLabels = data.usersByVerificationStatus.map(item => item._id);
  const statusData = data.usersByVerificationStatus.map(item => item.count);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">User Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-500 mb-2">Total Users</h3>
          <p className="text-4xl font-bold">{data.totalUsers}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-500 mb-2">New Users Today</h3>
          <p className="text-4xl font-bold">{data.newUsersToday}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-500 mb-2">Verified Users</h3>
          <p className="text-4xl font-bold">{data.verifiedUsers}</p>
          <p className="text-sm text-gray-500 mt-2">
            {((data.verifiedUsers / data.totalUsers) * 100).toFixed(1)}% of total
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">User Growth</h3>
          <div className="h-80">
            <Line
              data={{
                labels: growthLabels,
                datasets: [{
                  label: 'New Users',
                  data: growthData,
                  borderColor: 'rgb(59, 130, 246)',
                  backgroundColor: 'rgba(59, 130, 246, 0.5)',
                  tension: 0.2
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: false }
                }
              }}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Verification Status</h3>
          <div className="h-80">
            <Doughnut
              data={{
                labels: statusLabels,
                datasets: [{
                  data: statusData,
                  backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(16, 185, 129, 0.8)'
                  ],
                  borderWidth: 1
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'bottom' }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAnalytics;