import React, { useState, useEffect } from 'react';
import { Chart, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { gsap } from 'gsap';
import { getApiEndpoint } from '../../utils/api';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

interface LocationAnalyticsData {
  popularSourceLocations: { _id: string; count: number }[];
  popularDestinationLocations: { _id: string; count: number }[];
  popularRoutes: { _id: { source: string; destination: string }; count: number }[];
}

const LocationAnalytics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<LocationAnalyticsData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('tagalong-token') || sessionStorage.getItem('tagalong-token');
        const response = await fetch(getApiEndpoint('/api/admin/analytics/locations'), {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch location analytics');
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
      gsap.from('.location-title', {
        y: -20,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out'
      });

      gsap.from('.location-chart', {
        y: 30,
        opacity: 1,
        duration: 0.8,
        delay: 0.2,
        // stagger: 0.2,
        ease: 'power3.out'
      });

      gsap.from('.route-item', {
        x: -20,
        opacity: 1,
        duration: 0.5,
        // stagger: 0.05,
        delay: 0.4,
        ease: 'power2.out'
      });
    }
  }, [loading, error, data]);

  if (loading) return <div className="flex justify-center items-center h-full">Loading analytics...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!data) return <div>No data available</div>;

  // Prepare data for source locations chart
  const sourceLabels = data.popularSourceLocations.map(item => item._id);
  const sourceData = data.popularSourceLocations.map(item => item.count);

  // Prepare data for destination locations chart
  const destLabels = data.popularDestinationLocations.map(item => item._id);
  const destData = data.popularDestinationLocations.map(item => item.count);

  return (
    <div>
      <h2 className="location-title text-2xl font-bold mb-6">Location Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="location-chart bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Popular Source Locations</h3>
          <div className="h-80">
            <Bar
              data={{
                labels: sourceLabels,
                datasets: [{
                  label: 'Number of Trips',
                  data: sourceData,
                  backgroundColor: 'rgba(59, 130, 246, 0.8)',
                  borderColor: 'rgb(59, 130, 246)',
                  borderWidth: 1
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                  legend: { position: 'top' }
                }
              }}
            />
          </div>
        </div>

        <div className="location-chart bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Popular Destination Locations</h3>
          <div className="h-80">
            <Bar
              data={{
                labels: destLabels,
                datasets: [{
                  label: 'Number of Trips',
                  data: destData,
                  backgroundColor: 'rgba(245, 158, 11, 0.8)',
                  borderColor: 'rgb(245, 158, 11)',
                  borderWidth: 1
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                  legend: { position: 'top' }
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Popular Routes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.popularRoutes.map((route, index) => (
            <div key={index} className="route-item flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">{route._id.source} → {route._id.destination}</div>
                <div className="text-sm text-gray-500">Route Popularity</div>
              </div>
              <div className="text-xl font-bold">{route.count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LocationAnalytics;