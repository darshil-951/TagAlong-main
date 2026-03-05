import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAuth } from '../context/AuthContext';
import { getApiEndpoint } from '../utils/api';

// Initialize Stripe with your publishable key
// Replace with your actual Stripe publishable key when in production
const stripePromise = loadStripe('pk_test_51RUPzaHBpdBOgzxC6epamw952mIDYSiFeMjkUIvENF377HBMjgmxE37v3GHqlXNDwNzYBgtQGdoLJu7KNOeLLNUk00PqV5kP60');

const CheckoutForm = ({ parcelId, amount }: { parcelId: string, amount: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>('');

  // Add this useEffect to fetch the client secret when the component mounts
  useEffect(() => {
    // Create a function to fetch the payment intent
    const fetchPaymentIntent = async () => {
      try {
        const token = localStorage.getItem('tagalong-token') || sessionStorage.getItem('tagalong-token');
        const response = await fetch(getApiEndpoint('/api/payment/create-payment-intent'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            parcelId,
            amount
          })
        });

        if (!response.ok) {
          throw new Error('Failed to create payment intent');
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error('Error fetching payment intent:', err);
        setError('Could not initialize payment. Please try again.');
      }
    };

    fetchPaymentIntent();
  }, [parcelId, amount]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        setError('Card element not found');
        setProcessing(false);
        return;
      }

      // Add this check to ensure client secret is available
      if (!clientSecret) {
        setError('Payment not initialized. Please try again.');
        setProcessing(false);
        return;
      }

      // Get user information from local storage
      const token = localStorage.getItem('tagalong-token') || sessionStorage.getItem('tagalong-token');
      const userDataString = localStorage.getItem('tagalong-user') || sessionStorage.getItem('tagalong-user');
      const userData = userDataString ? JSON.parse(userDataString) : null;
      const userName = userData?.name || 'User';

      // Confirm the payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: userName, // Use the actual user name instead of hardcoded value
          },
        },
      });

      if (error) {
        setError(`Payment failed: ${error.message}`);
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        // Notify our backend about the successful payment
        const token = localStorage.getItem('tagalong-token') || sessionStorage.getItem('tagalong-token');
        await fetch(getApiEndpoint('/api/payment/confirm-payment'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ paymentIntentId: paymentIntent.id })
        });

        setSucceeded(true);
        setProcessing(false);

        // Redirect or show success message
        setTimeout(() => {
          navigate('/myparcel', { state: { paymentSuccess: true } });
        }, 2000);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('An unexpected error occurred.');
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="mb-6">
        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
          Card Details
        </label>
        <div className="p-3 border border-gray-300 dark:border-gray-600 rounded">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <button
        type="submit"
        disabled={!stripe || processing || succeeded}
        className={`w-full py-2 px-4 rounded font-bold ${processing || succeeded || !stripe
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-teal-500 hover:bg-teal-600 text-white'
          }`}
      >
        {processing ? 'Processing...' : succeeded ? 'Payment Successful!' : `Pay ₹${amount}`}
      </button>
    </form>
  );
};

const PaymentPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [parcelData, setParcelData] = useState<{ parcelId: string, amount: number } | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on mount

    // Get parcel data from location state
    const state = location.state as { parcelId: string, amount: number } | null;
    if (!state || !state.parcelId || !state.amount) {
      // If no parcel data is provided, redirect back to parcels page
      navigate('/myparcel');
      return;
    }

    setParcelData(state);
  }, [location, navigate]);

  if (!parcelData) {
    return <div className="min-h-screen pt-20 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white text-center">Complete Your Payment</h1>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Payment Details</h2>
              <p className="text-gray-600 dark:text-gray-400">Secure payment processing by Stripe</p>
            </div>
            <div className="text-2xl font-bold text-teal-600">₹{parcelData.amount / 2}</div>
          </div>

          <Elements stripe={stripePromise}>
            <CheckoutForm parcelId={parcelData.parcelId} amount={parcelData.amount / 2} />
          </Elements>
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate('/myparcel')}
            className="text-teal-600 hover:text-teal-800 font-medium"
          >
            Cancel and return to My Parcels
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;