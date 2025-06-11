import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    tableau: any;
  }
}

const TableauDashboard: React.FC = () => {
  const vizRef = useRef<HTMLDivElement>(null);
  const viz = useRef<any>(null);
  
  useEffect(() => {
    // Load Tableau JavaScript API
    const script = document.createElement('script');
    script.src = 'https://public.tableau.com/javascripts/api/tableau-2.min.js';
    script.async = true;
    script.onload = initTableau;
    document.body.appendChild(script);
    
    return () => {
      // Clean up
      if (viz.current) {
        viz.current.dispose();
      }
      document.body.removeChild(script);
    };
  }, []);
  
  const initTableau = () => {
    if (!vizRef.current || !window.tableau) return;
    
    // Replace this URL with your actual Tableau dashboard URL
    const url = 'https://public.tableau.com/views/YourDashboardName/Dashboard';
    
    const options = {
      hideTabs: true,
      hideToolbar: true,
      width: '100%',
      height: '800px'
    };
    
    viz.current = new window.tableau.Viz(vizRef.current, url, options);
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Tableau Dashboard</h2>
      <div className="bg-white rounded-lg shadow p-4">
        <div ref={vizRef} className="w-full h-[800px]"></div>
      </div>
    </div>
  );
};

export default TableauDashboard;