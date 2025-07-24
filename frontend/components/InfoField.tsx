import React from 'react';
import { InfoFieldProps } from '../types';

const InfoField: React.FC<InfoFieldProps> = ({ label, value }) => {
  return (
    <div>
      <label className="text-sm text-gray-400">{label}</label>
      <div className="mt-1 p-2 bg-gray-700 rounded-md border border-gray-600 text-gray-100">
        {value ?? 'N/A'}
      </div>
    </div>
  );
};

export default InfoField;