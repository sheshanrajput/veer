import prisma from '@/lib/prisma';
import DashboardCards from '@/components/admin/DashboardCards';
import Link from 'next/link';
import { Plus, FileText, Image as ImageIcon, ArrowUpRight, Clock, ToggleLeft, ToggleRight } from 'lucide-react';

// Force dynamic rendering to always fetch fresh dashboard statistics
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // Fetch stats concurrently
  const [
    totalServices,
    activeServices,
    totalGallery,
    recentUploadsCount,
    latestServices,
    latestGallery,
  ] = await Promise.all([
    prisma.service.count(),
    prisma.service.count({ where: { status: true } }),
    prisma.gallery.count(),
    prisma.gallery.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Uploads in the last 7 days
        },
      },
    }),
    prisma.service.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.gallery.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ]);

  const stats = {
    totalServices,
    activeServices,
    totalGallery,
    recentUploads: recentUploadsCount,
  };

  // Build Recent Activity Feed
  const recentActivity = [
    ...latestServices.map((s) => ({
      id: `service-${s.id}`,
      type: 'service',
      title: s.title,
      action: 'Service updated/created',
      date: s.updatedAt,
    })),
    ...latestGallery.map((g) => ({
      id: `gallery-${g.id}`,
      type: 'gallery',
      title: g.title,
      action: 'Gallery image uploaded',
      date: g.createdAt,
    })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-white/40 text-sm mt-1">Real-time statistics and latest updates of your website.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/veeradmin/services"
            className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-primary/20"
          >
            <Plus size={16} />
            <span>Add Service</span>
          </Link>
          <Link
            href="/veeradmin/gallery"
            className="flex items-center gap-2 px-4 py-2.5 bg-secondary hover:bg-secondary-dark text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-secondary/20"
          >
            <Plus size={16} />
            <span>Upload Image</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <DashboardCards stats={stats} />

      {/* Grid Layout for Latest Records and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Latest Services */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-card bg-dark-light border border-white/5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText size={18} className="text-primary" />
                <span>Latest Services</span>
              </h3>
              <Link
                href="/veeradmin/services"
                className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>

            {latestServices.length === 0 ? (
              <div className="py-8 text-center text-white/30 text-sm">
                No services created yet. Click "Add Service" to create one.
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {latestServices.map((service) => (
                  <div key={service.id} className="py-3.5 flex items-center justify-between first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      {service.image ? (
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/5 border border-white/10 relative">
                          <img
                            src={service.image}
                            alt={service.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/30">
                          <FileText size={16} />
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-semibold text-white">{service.title}</h4>
                        <p className="text-xs text-white/40 mt-0.5 truncate max-w-xs sm:max-w-md">
                          {service.shortDescription}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          service.status
                            ? 'bg-success/15 text-success border border-success/20'
                            : 'bg-white/5 text-white/40 border border-white/10'
                        }`}
                      >
                        {service.status ? 'Active' : 'Draft'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Latest Gallery Uploads */}
          <div className="p-6 rounded-card bg-dark-light border border-white/5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ImageIcon size={18} className="text-secondary" />
                <span>Latest Gallery Uploads</span>
              </h3>
              <Link
                href="/veeradmin/gallery"
                className="text-xs font-semibold text-secondary hover:text-secondary-dark transition-colors flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>

            {latestGallery.length === 0 ? (
              <div className="py-8 text-center text-white/30 text-sm">
                No images uploaded yet. Click "Upload Image" to add one.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {latestGallery.map((item) => (
                  <div key={item.id} className="group relative rounded-xl overflow-hidden border border-white/5 aspect-square bg-white/5">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2.5">
                      <p className="text-[10px] text-white font-semibold truncate">{item.title}</p>
                      <span className="text-[8px] text-white/60 truncate uppercase tracking-wider">{item.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity Timeline */}
        <div className="p-6 rounded-card bg-dark-light border border-white/5 shadow-2xl space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock size={18} className="text-purple-400" />
              <span>Recent Activity</span>
            </h3>
          </div>

          {recentActivity.length === 0 ? (
            <div className="py-8 text-center text-white/30 text-sm">
              No recent activity recorded.
            </div>
          ) : (
            <div className="relative border-l-2 border-white/5 pl-4 ml-2 space-y-6">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="relative">
                  {/* Timeline bullet */}
                  <div
                    className={`absolute -left-[23px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-dark-light ${
                      activity.type === 'service' ? 'bg-primary' : 'bg-secondary'
                    }`}
                  />
                  <div>
                    <span className="text-xs font-semibold text-white/40 block">
                      {activity.date.toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <h4 className="text-sm font-semibold text-white mt-0.5">{activity.title}</h4>
                    <p className="text-xs text-white/55 mt-0.5">{activity.action}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
