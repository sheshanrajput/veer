"use client";

import { FileText, Image as ImageIcon, CheckCircle, Clock } from 'lucide-react';

export default function DashboardCards({ stats }) {
  const cards = [
    {
      title: 'Total Services',
      value: stats?.totalServices || 0,
      icon: FileText,
      color: 'from-primary/20 to-primary/5 border-primary/20',
      iconColor: 'text-primary',
    },
    {
      title: 'Active Services',
      value: stats?.activeServices || 0,
      icon: CheckCircle,
      color: 'from-success/20 to-success/5 border-success/20',
      iconColor: 'text-success',
    },
    {
      title: 'Gallery Images',
      value: stats?.totalGallery || 0,
      icon: ImageIcon,
      color: 'from-secondary/20 to-secondary/5 border-secondary/20',
      iconColor: 'text-secondary',
    },
    {
      title: 'Recent Uploads',
      value: stats?.recentUploads || 0,
      icon: Clock,
      color: 'from-purple-500/20 to-purple-500/5 border-purple-500/20',
      iconColor: 'text-purple-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className={`p-6 rounded-card bg-gradient-to-br ${card.color} border backdrop-blur-lg flex items-center justify-between shadow-premium transition-all duration-300 hover:scale-[1.02]`}
          >
            <div>
              <p className="text-sm font-medium text-white/50">{card.title}</p>
              <h3 className="text-3xl font-bold text-white mt-1 tracking-tight">{card.value}</h3>
            </div>
            <div className={`p-3 rounded-2xl bg-white/5 ${card.iconColor}`}>
              <Icon size={24} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
