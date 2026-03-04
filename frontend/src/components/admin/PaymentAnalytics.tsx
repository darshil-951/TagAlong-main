import React, { useState, useEffect } from 'react';
import { Chart, Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { gsap } from 'gsap';
import { getApiEndpoint } from '../../utils/api';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

interface PaymentAnalyticsData {
  totalPayments: number;
  totalRevenue: number;
  paymentsByStatus: { _id: string; count: number }[];
  avgOrderAmount: number;
  revenueByMonth: { _id: { year: number; month: number }; total: number }[];
}

const PaymentAnalytics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PaymentAnalyticsData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('tagalong-token') || sessionStorage.getItem('tagalong-token');
        const response = await fetch(getApiEndpoint('/api/admin/analytics/payments'), {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch payment analytics');
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
      gsap.from('.payment-card', {
        y: 20,
        opacity: 1,
        duration: 0.6,
        // stagger: 0.1,
        ease: 'power2.out'
      });

      gsap.from('.payment-chart', {
        opacity: 1,
        duration: 0.8,
        delay: 0.4,
        // stagger: 0.2,
        ease: 'power2.out'
      });
    }
  }, [loading, error, data]);

  if (loading) return <div className="flex justify-center items-center h-full">Loading analytics...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!data) return <div>No data available</div>;

  // Prepare data for status chart
  const statusLabels = data.paymentsByStatus.map(item => item._id);
  const statusData = data.paymentsByStatus.map(item => item.count);

  // Prepare data for revenue chart
  const revenueLabels = data.revenueByMonth.map(item => {
    const month = new Date(0, item._id.month - 1).toLocaleString('default', { month: 'short' });
    return `${month} ${item._id.year}`;
  });

  const revenueData = data.revenueByMonth.map(item => item.total / 100); // Convert cents to dollars

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Payment Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="payment-card bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-500 mb-2">Total Payments</h3>
          <p className="text-4xl font-bold">{data.totalPayments}</p>
        </div>

        <div className="payment-card bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-500 mb-2">Total Revenue</h3>
          <p className="text-4xl font-bold">${(data.totalRevenue / 100).toFixed(2)}</p>
        </div>

        <div className="payment-card bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-500 mb-2">Avg Order Amount</h3>
          <p className="text-4xl font-bold">${(data.avgOrderAmount / 100).toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="payment-chart bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Monthly Revenue</h3>
          <div className="h-80">
            <Line
              data={{
                labels: revenueLabels,
                datasets: [{
                  label: 'Revenue ($)',
                  data: revenueData,
                  borderColor: 'rgb(16, 185, 129)',
                  backgroundColor: 'rgba(16, 185, 129, 0.5)',
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

        <div className="payment-chart bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Payments by Status</h3>
          <div className="h-80">
            <Doughnut
              data={{
                labels: statusLabels,
                datasets: [{
                  data: statusData,
                  backgroundColor: [
                    'rgba(16, 185, 129, 0.8)',  // succeeded
                    'rgba(245, 158, 11, 0.8)',  // pending
                    'rgba(239, 68, 68, 0.8)'    // failed
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

export default PaymentAnalytics;