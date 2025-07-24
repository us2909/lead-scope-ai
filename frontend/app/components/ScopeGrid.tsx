// frontend/app/components/ScopeGrid.tsx
'use client';

// Use the correct path alias to import from the lib directory
import { scopeCategories } from '@/lib/scope-data';

function ScopeTile({ name, isActive }: { name: string; isActive: boolean }) {
  const baseClasses = "text-center p-4 rounded-md text-sm transition-colors";
  const activeClasses = "bg-blue-600 text-white font-bold shadow-lg";
  const inactiveClasses = "bg-gray-800 text-gray-400";
  return <div className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>{name}</div>;
}

export function ScopeGrid({ activatedTiles }: { activatedTiles: string[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">
      {scopeCategories.map(category => (
        <div key={category.name} className="flex flex-col gap-4">
          <h4 className="font-bold text-lg text-gray-400 border-b-2 border-gray-700 pb-2">{category.name}</h4>
          <div className="flex flex-col gap-3">
            {category.tiles.map(tile => <ScopeTile key={tile.id} name={tile.name} isActive={activatedTiles.includes(tile.id)} />)}
          </div>
        </div>
      ))}
    </div>
  );
}