import React, { memo } from 'react';
import { ScopeTileProps } from '../types';

const ScopeTile: React.FC<ScopeTileProps> = memo(({ name, isActive }) => {
  const baseClasses = "text-center p-4 rounded-md text-sm transition-colors";
  const activeClasses = "bg-blue-600 text-white font-bold shadow-lg";
  const inactiveClasses = "bg-gray-800 text-gray-400";
  
  return (
    <div 
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
      role="status"
      aria-label={`${name} module ${isActive ? 'active' : 'inactive'}`}
    >
      {name}
    </div>
  );
});

ScopeTile.displayName = 'ScopeTile';

export default ScopeTile;