// app/(default)/predict/page.js

import React, { Suspense } from 'react';
import RealEstateMapComponent from './RealEstateMapComponent';

export default function Page() {
  return (
    <div className="w-full h-full bg-gray-950 overflow-hiddengit ">
      <Suspense fallback={<div>Loading...</div>}>
        <RealEstateMapComponent />
      </Suspense>
    </div>
  );
}
