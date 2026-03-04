import React from 'react';
import { useAuth } from '../context/AuthContext';

const DebugUserPage: React.FC = () => {
  const { currentUser, isAuthenticated } = useAuth();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Debug Information</h1>
      
      <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded">
        <p><strong>Is Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
        <p><strong>User Role:</strong> {currentUser?.role || 'Not available'}</p>
        <pre className="bg-gray-200 p-2 mt-4 rounded overflow-auto">
          {JSON.stringify(currentUser, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default DebugUserPage;