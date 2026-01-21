import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendUp, 
  iconBg = "bg-slate-100", 
  iconColor = "text-slate-600" 
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={`h-12 w-12 rounded-xl ${iconBg} flex items-center justify-center`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>
      {trend && (
        <div className="flex items-center gap-1 mt-4">
          {trendUp ? (
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-rose-500" />
          )}
          <span className={`text-sm ${trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
            {trend} {trendUp ? 'increase' : 'decrease'}
          </span>
          <span className="text-sm text-slate-400 ml-auto">from last week</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
