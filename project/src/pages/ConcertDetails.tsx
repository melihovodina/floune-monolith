import React from 'react';
import { useParams } from 'react-router-dom';

export default function ConcertDetails() {
  const { id } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Concert Details</h1>
      <div className="space-y-4">
        {/* Concert details will be added later */}
      </div>
    </div>
  );
}