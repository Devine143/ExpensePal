import React from 'react';
import { cn } from '../../utils/cn';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({ title, value, icon: Icon, trend, className }: StatCardProps) {
  return (
    <div className={cn(
      "bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md",
      className
    )}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
        <Icon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
      </div>
      <p className="mt-2 text-3xl font-bold">{value}</p>
      {trend && (
        <p className={cn(
          "mt-2 text-sm",
          trend.isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
        )}>
          {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
        </p>
      )}
    </div>
  );
}