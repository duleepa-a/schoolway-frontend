import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  text: string;
  number: number;
}

const StatCard: React.FC<StatCardProps> = ({ icon, text, number }) => {
  return (
    <div className="bg-white rounded-xl shadow border-1 border-amber-300 p-6 flex items-center gap-4">
      <div className="p-3 bg-page-background rounded-full text-primary">
        {icon}
      </div>
      <div>
        <p className="text-gray-500 text-sm">{text}</p>
        <p className="font-semibold text-lg text-gray-800">{number}</p>
      </div>
    </div>
  );
};

export default StatCard;
