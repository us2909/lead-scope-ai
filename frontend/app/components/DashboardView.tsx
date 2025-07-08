'use client';
import { ScopeGrid } from '../page'; // Assuming ScopeGrid is exported from page.tsx

// A small component for a single input field on the dashboard
function InfoField({ label, value }: { label: string, value: string | number | null }) {
  return (
    <div>
      <label className="text-sm text-gray-400">{label}</label>
      <div className="mt-1 p-2 bg-gray-700 rounded-md border border-gray-600">
        {value ? value : 'N/A'}
      </div>
    </div>
  );
}

export function DashboardView({ assessment, activatedTiles }) {
  const formatRevenue = (rev: number | null) => {
    if (!rev) return 'N/A';
    return `$${(rev / 1_000_000_000).toFixed(2)}B`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
      {/* Left Column: Financial Profile & Considerations */}
      <div className="lg:col-span-1 bg-gray-800 p-6 rounded-lg border border-gray-700 space-y-6">
        <h3 className="text-xl font-bold text-white">The {assessment.company_name || '...'} Company</h3>
        <InfoField label="Industry" value={assessment.classified_industry} />

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-300">Financial Profile</h4>
          <InfoField label="Revenue" value={formatRevenue(assessment.revenue)} />
          <InfoField label="Geographical Scope" value={assessment.geo_scope} />
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-300">Additional Considerations</h4>
          <p className="text-sm text-gray-400">Is your current ERP SAP?</p>
          <div className="flex gap-4"><span className="p-2 bg-blue-600 rounded-md">Yes</span><span className="p-2 bg-gray-700 rounded-md">No</span></div>

          <p className="text-sm text-gray-400">Is your infrastructure currently On-prem?</p>
          <div className="flex gap-4"><span className="p-2 bg-blue-600 rounded-md">Yes</span><span className="p-2 bg-gray-700 rounded-md">No</span></div>
        </div>
      </div>

      {/* Right Column: Business Transformation Scope */}
      <div className="lg:col-span-2">
        <ScopeGrid activatedTiles={activatedTiles} />
      </div>
    </div>
  );
}