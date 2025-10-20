'use client';

import { useState } from 'react';
import PrivatehireTable from './PrivatehireTable';
import AcceptedhiresTable from './AcceptedhiresTable';


export default function PrivateHireDetailTab() {
  const [activeTab, setActiveTab] = useState('new');

  return (
  <div className="bg-blue-shade-light bg-opacity-10 rounded-xl p-6">
      {/* Tabs */}

      {activeTab === 'new' && (
        <PrivatehireTable/>
      )}

    </div>
  );
}
