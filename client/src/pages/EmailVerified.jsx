// client/src/pages/EmailVerified.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { APP_SERVER_URL } from '../constants';

function EmailVerified() {
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationSuccess, setVerificationSuccess] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Extract token from query params
    const query = new URLSearchParams(window.location.search);
    const token = query.get('token');

    if (token) {
      // Call backend to verify email
      axios
        .get(`${APP_SERVER_URL}/auth/verify-email?token=${token}`)
        .then(() => {
          setVerificationSuccess(true);
          // Redirect to home page after successful verification
          setTimeout(() => navigate('/'), 2000); // Redirect after 2 seconds
        })
        .catch((error) => {
          console.error('Verification failed:', error);
          setVerificationSuccess(false);
          setErrorMessage('Verification failed. Please try again later.');
        })
        .finally(() => {
          setIsVerifying(false);
        });
    } else {
      setVerificationSuccess(false);
      setErrorMessage('Verification token is missing.');
      setIsVerifying(false);
    }
  }, [navigate]);

  if (isVerifying) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-n-8">
        <div className="bg-orange-100 p-8 rounded-lg shadow-md w-full max-w-md text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">
            Verifying Email...
          </h2>
          <p className="text-gray-600">
            Please wait while we verify your email.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-n-8">
      <div
        className={`p-8 rounded-lg shadow-md w-full max-w-md text-center ${verificationSuccess ? 'bg-green-100' : 'bg-red-100'}`}
      >
        <h2
          className={`text-2xl font-semibold ${verificationSuccess ? 'text-green-700' : 'text-red-700'} mb-6`}
        >
          {verificationSuccess ? 'Email Verified!' : 'Verification Failed'}
        </h2>
        <p
          className={`text-gray-600 ${verificationSuccess ? 'text-green-600' : 'text-red-600'}`}
        >
          {verificationSuccess
            ? 'Your email has been successfully verified.'
            : errorMessage}
        </p>
      </div>
    </div>
  );
}

export default EmailVerified;
