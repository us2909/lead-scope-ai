// frontend/app/components/FinalDashboard.tsx
'use client';

// Import the data types we need from our central types file
import { AssessmentData } from '@/types';
// Import the ScopeGrid component from its own file
import { ScopeGrid } from './ScopeGrid';

function InfoField({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div>
      <label className="text-sm text-gray-400">{label}</label>
      <div className="mt-1 p-2 bg-gray-700 rounded-md border border-gray-600 text-gray-100">
        {value ? value : 'N/A'}
      </div>
    </div>
  );
}

// --- Define the Props type for our component ---
interface DashboardViewProps {
    assessment: AssessmentData;
    activatedTiles: string[];
    userAnswers: {
        geoScope: string;
        isSap: string;
        isOnPrem: string;
    };
}

export function FinalDashboard({ assessment, activatedTiles, userAnswers }: DashboardViewProps) {
  const formatRevenue = (rev: number | null | undefined) => {
    if (!rev) return 'N/A';
    if (rev < 1_000_000_000) return `$${(rev / 1_000_000).toFixed(0)}M`;
    return `$${(rev / 1_000_000_000).toFixed(2)}B`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
      {/* Left Column: Financial Profile & Considerations */}
      <div className="lg-col-span-1 bg-gray-800 p-6 rounded-lg border border-gray-700 space-y-6 self-start">
        <h3 className="text-xl font-bold text-white">The {assessment.company_name || '...'} Company</h3>
        <InfoField label="Industry" value={assessment.classified_industry} />
        
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-300">Financial Profile</h4>
          <InfoField label="Revenue" value={formatRevenue(assessment.revenue)} />
          <InfoField label="Geographical Scope" value={userAnswers.geoScope} />
        </div>
        
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-300">Additional Considerations</h4>
          <InfoField label="Is your current ERP SAP?" value={userAnswers.isSap} />
          <InfoField label="Is your infrastructure currently On-prem?" value={userAnswers.isOnPrem} />
        </div>
      </div>

      {/* Right Column: Business Transformation Scope */}
      <div className="lg:col-span-2 space-y-8">
         <div className="text-center bg-gray-800 border border-gray-700 rounded-lg p-4">
            <p className="font-semibold text-lg text-blue-400">
                Phase 1 Scope includes {activatedTiles.length} key modules based on your selections.
            </p>
         </div>
        <ScopeGrid activatedTiles={activatedTiles} />
      </div>
    </div>
  );
}