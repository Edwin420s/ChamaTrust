import React, { useState, useEffect } from 'react';
import { ACCESSIBILITY } from '../utils/constants';

const Announcer = () => {
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    const announce = (message) => {
      setAnnouncement(message);
      setTimeout(() => setAnnouncement(''), ACCESSIBILITY.ANNOUNCEMENT_DELAY);
    };

    // Make announce function globally available
    window.announceToScreenReader = announce;

    return () => {
      delete window.announceToScreenReader;
    };
  }, []);

  return (
    <div 
      aria-live="polite" 
      aria-atomic="true" 
      className="sr-only"
    >
      {announcement}
    </div>
  );
};

export default Announcer;
