import React from 'react';
import { scopeCategories } from '../lib/scope-data';
import ScopeTile from './ScopeTile';
import { ScopeGridProps } from '../types';

const ScopeGrid: React.FC<ScopeGridProps> = ({ activatedTiles }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">
      {scopeCategories.map(category => (
        <div key={category.name} className="flex flex-col gap-4">
          <h4 className="font-bold text-lg text-gray-400 border-b-2 border-gray-700 pb-2">
            {category.name}
          </h4>
          <div className="flex flex-col gap-3">
            {category.tiles.map(tile => (
              <ScopeTile 
                key={tile.id} 
                name={tile.name} 
                isActive={activatedTiles.includes(tile.id)} 
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScopeGrid;