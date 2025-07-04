// Spinner.jsx
import React from 'react';

const Spinner = ({ size = "w-12 h-12", color = "border-blue-500" }) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className={`animate-spin rounded-full border-4 ${color} border-t-transparent ${size}`} />
  </div>
);

export default Spinner;
