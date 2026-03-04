import React, { useState, useEffect, useRef } from 'react';
import { Chart, Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { gsap } from 'gsap';
import { getApiEndpoint } from '../../utils/api';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

interface TripAnalyticsData {
  totalTrips: number;
  tripsByStatus: { _id: string; count: number }[];
  tripsByTransport: { _id: string; count: number }[];
  avgCapacity: { avgWeight: number; avgVolume: number };
}

const TripAnalytics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TripAnalyticsData | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('tagalong-token') || sessionStorage.getItem('tagalong-token');
        const response = await fetch(getApiEndpoint('/api/admin/analytics/trips'), {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch trip analytics');
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
    if (!loading && !error && data && containerRef.current) {
      gsap.from('.trip-card', {
        y: 20,
        opacity: 1,
        duration: 0.6,
        // stagger: 0.1,
        ease: 'power2.out'
      });

      gsap.from('.trip-chart', {
        scale: 0.9,
        opacity: 1,
        duration: 0.8,
        delay: 0.3,
        // stagger: 0.2,
        ease: 'back.out(1.2)'
      });
    }
  }, [loading, error, data]);

  if (loading) return <div className="flex justify-center items-center h-full">Loading analytics...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!data) return <div>No data available</div>;

  // Prepare data for status chart
  const statusLabels = data.tripsByStatus.map(item => item._id);
  const statusData = data.tripsByStatus.map(item => item.count);

  // Prepare data for transport chart
  const transportLabels = data.tripsByTransport.map(item => item._id);
  const transportData = data.tripsByTransport.map(item => item.count);

  return (
    <div ref={containerRef}>
      <h2 className="text-2xl font-bold mb-6">Trip Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="trip-card bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-500 mb-2">Total Trips</h3>
          <p className="text-4xl font-bold">{data.totalTrips}</p>
        </div>

        <div className="trip-card bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-500 mb-2">Avg Weight Capacity</h3>
          <p className="text-4xl font-bold">{data.avgCapacity.avgWeight.toFixed(2)} kg</p>
        </div>

        <div className="trip-card bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-500 mb-2">Avg Volume Capacity</h3>
          <p className="text-4xl font-bold">{data.avgCapacity.avgVolume.toFixed(2)} m³</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="trip-chart bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Trips by Status</h3>
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

        <div className="trip-chart bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Trips by Transport Type</h3>
          <div className="h-80">
            <Bar
              data={{
                labels: transportLabels,
                datasets: [{
                  label: 'Number of Trips',
                  data: transportData,
                  backgroundColor: 'rgba(16, 185, 129, 0.8)',
                  borderColor: 'rgb(16, 185, 129)',
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

export default TripAnalytics;