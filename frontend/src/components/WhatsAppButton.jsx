import React from 'react';
import siteData from '../data/siteData';

const WhatsAppButton = () => {
  return (
    <a
      href={`https://wa.me/${siteData.whatsapp.number}?text=${encodeURIComponent(siteData.whatsapp.message)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 lg:w-16 lg:h-16 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 hover:scale-110 transition-all duration-300 hover:shadow-xl"
      aria-label="WhatsApp"
    >
      <i className="fab fa-whatsapp text-2xl lg:text-3xl"></i>
    </a>
  );
};

export default WhatsAppButton;