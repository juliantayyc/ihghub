import { useEffect, useState } from 'react';

const UnauthorizedPopup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <p>Unauthorized Access. Please sign in with appropriate permissions.</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default UnauthorizedPopup;
