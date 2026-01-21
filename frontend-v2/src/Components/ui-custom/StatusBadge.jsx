import React from 'react';
import { cn } from '@/utils/cn';

const StatusBadge = ({ status, className }) => {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return {
          bg: 'bg-emerald-100',
          text: 'text-emerald-700',
          border: 'border-emerald-200',
          dot: 'bg-emerald-500'
        };
      case 'rejected':
        return {
          bg: 'bg-rose-100',
          text: 'text-rose-700',
          border: 'border-rose-200',
          dot: 'bg-rose-500'
        };
      case 'pending':
        return {
          bg: 'bg-amber-100',
          text: 'text-amber-700',
          border: 'border-amber-200',
          dot: 'bg-amber-500'
        };
      case 'processing':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-700',
          border: 'border-blue-200',
          dot: 'bg-blue-500'
        };
      case 'shipped':
        return {
          bg: 'bg-purple-100',
          text: 'text-purple-700',
          border: 'border-purple-200',
          dot: 'bg-purple-500'
        };
      case 'delivered':
        return {
          bg: 'bg-emerald-100',
          text: 'text-emerald-700',
          border: 'border-emerald-200',
          dot: 'bg-emerald-500'
        };
      case 'cancelled':
        return {
          bg: 'bg-slate-100',
          text: 'text-slate-700',
          border: 'border-slate-200',
          dot: 'bg-slate-500'
        };
      default:
        return {
          bg: 'bg-slate-100',
          text: 'text-slate-700',
          border: 'border-slate-200',
          dot: 'bg-slate-500'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div className={cn(
      'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border',
      config.bg,
      config.text,
      config.border,
      className
    )}>
      <div className={cn('h-1.5 w-1.5 rounded-full', config.dot)} />
      {status}
    </div>
  );
};

export default StatusBadge;
