import React, { useState, useEffect } from 'react';
import { Chart, Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { gsap } from 'gsap';
import { getApiEndpoint } from '../../utils/api';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

interface ParcelAnalyticsData {
  totalParcels: number;
  parcelsByStatus: { _id: string; count: number }[];
  parcelsByPaymentStatus: { _id: string; count: number }[];
  parcelsByCategory: { _id: string; count: number }[];
  avgParcelWeight: number;
}

const ParcelAnalytics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ParcelAnalyticsData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('tagalong-token') || sessionStorage.getItem('tagalong-token');
        const response = await fetch(getApiEndpoint('/api/admin/analytics/parcels'), {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch parcel analytics');
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

  // Add animation when component mounts
  useEffect(() => {
    if (!loading && !error && data) {
      gsap.from('.analytics-card', {
        y: 20,
        opacity: 1,
        duration: 0.6,
        // stagger: 0.1,
        ease: 'power2.out'
      });

      gsap.from('.chart-container', {
        y: 30,
        opacity: 1,
        duration: 0.8,
        delay: 0.3,
        // stagger: 0.2,
        ease: 'power2.out'
      });
    }
  }, [loading, error, data]);

  if (loading) return <div className="flex justify-center items-center h-full">Loading analytics...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!data) return <div>No data available</div>;

  // Prepare data for status chart
  const statusLabels = data.parcelsByStatus.map(item => item._id);
  const statusData = data.parcelsByStatus.map(item => item.count);

  // Prepare data for category chart
  const categoryLabels = data.parcelsByCategory.map(item => item._id);
  const categoryData = data.parcelsByCategory.map(item => item.count);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Parcel Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="analytics-card bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-500 mb-2">Total Parcels</h3>
          <p className="text-4xl font-bold">{data.totalParcels}</p>
        </div>

        <div className="analytics-card bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-500 mb-2">Average Weight</h3>
          <p className="text-4xl font-bold">{data.avgParcelWeight.toFixed(2)} kg</p>
        </div>

        <div className="analytics-card bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-500 mb-2">Payment Pending</h3>
          <p className="text-4xl font-bold">
            {data.parcelsByPaymentStatus.find(item => item._id === 'pending')?.count || 0}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="chart-container bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Parcels by Status</h3>
          <div className="h-80">
            <Doughnut
              data={{
                labels: statusLabels,
                datasets: [{
                  data: statusData,
                  backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(239, 68, 68, 0.8)'
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

        <div className="chart-container bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Parcels by Category</h3>
          <div className="h-80">
            <Bar
              data={{
                labels: categoryLabels,
                datasets: [{
                  label: 'Number of Parcels',
                  data: categoryData,
                  backgroundColor: 'rgba(59, 130, 246, 0.8)',
                  borderColor: 'rgb(59, 130, 246)',
                  borderWidth: 1
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'top' }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParcelAnalytics;