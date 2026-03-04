// src/components/common/PageHeader.jsx
import React from "react";

const PageHeader = ({ title, subtitle, icon, bgImage }) => {
  return (
    <div
      className="text-gray-900 bg-cover bg-right h-70 relative flex items-center"
      // Use inline style for the dynamic URL
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Dark Overlay to ensure text readability like in the image */}

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-md">
          <div className="flex items-center gap-4 mb-2">
            {icon && <span className="text-gray-900">{icon}</span>}
            <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter">
              {title}
            </h1>
          </div>
          {subtitle && (
            <p className="text-lg opacity-90 border-t border-yellow-600/50 pt-2 inline-block">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
