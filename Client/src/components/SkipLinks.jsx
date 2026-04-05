import React from 'react';
import { ACCESSIBILITY } from '../utils/constants';

const SkipLinks = () => {
  return (
    <div className={ACCESSIBILITY.SKIP_LINKS_CLASS}>
      <a 
        href="#main-content" 
        className="bg-white text-gray-900 px-4 py-2 rounded shadow-lg border border-gray-200 font-medium"
      >
        Skip to main content
      </a>
      <a 
        href="#navigation" 
        className="bg-white text-gray-900 px-4 py-2 rounded shadow-lg border border-gray-200 font-medium ml-2"
      >
        Skip to navigation
      </a>
    </div>
  );
};

export default SkipLinks;
