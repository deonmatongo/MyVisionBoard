import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { DollarSign, Users, Package, Repeat, Edit2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function ProgressDashboard({ progressData, isLoading }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    current_revenue: 0,
    monthly_revenue: 0,
    active_clients: 0,
    retainer_clients: 0,
    completed_projects: 0
  });

  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      if (progressData?.id) {
        return await base44.entities.VisionProgress.update(progressData.id, data);
      } else {
        return await base44.entities.VisionProgress.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['visionProgress']);
      setIsEditing(false);
    }
  });

  React.useEffect(() => {
    if (progressData) {
      setFormData({
        current_revenue: progressData.current_revenue || 0,
        monthly_revenue: progressData.monthly_revenue || 0,
        active_clients: progressData.active_clients || 0,
        retainer_clients: progressData.retainer_clients || 0,
        completed_projects: progressData.completed_projects || 0
      });
    }
  }, [progressData]);

  const handleSave = () => {
    updateMutation.mutate(formData);
  };

  const metrics = [
    {
      icon: DollarSign,
      title: 'Annual Revenue',
      value: formData.current_revenue,
      goal: 100000,
      format: (v) => `$${v.toLocaleString()}`,
      color: 'bg-lime-500',
      lightColor: 'bg-lime-50',
      field: 'current_revenue'
    },
    {
      icon: DollarSign,
      title: 'Monthly Revenue',
      value: formData.monthly_revenue,
      format: (v) => `$${v.toLocaleString()}`,
      color: 'bg-emerald-500',
      lightColor: 'bg-emerald-50',
      field: 'monthly_revenue'
    },
    {
      icon: Users,
      title: 'Active Clients',
      value: formData.active_clients,
      format: (v) => v,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50',
      field: 'active_clients'
    },
    {
      icon: Repeat,
      title: 'Retainer Clients',
      value: formData.retainer_clients,
      format: (v) => v,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50',
      field: 'retainer_clients'
    },
    {
      icon: Package,
      title: 'Completed Projects',
      value: formData.completed_projects,
      format: (v) => v,
      color: 'bg-amber-500',
      lightColor: 'bg-amber-50',
      field: 'completed_projects'
    }
  ];

  if (isLoading) {
    return (
      <section className="px-6 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-200 rounded w-48" />
            <div className="grid md:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-slate-200 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 py-16 bg-white border-b border-slate-100">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-lime-600 font-medium text-sm uppercase tracking-widest">Current Progress</span>
            <h2 className="text-3xl font-bold text-slate-900 mt-1">Where you are now</h2>
          </div>
          <Button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            variant={isEditing ? 'default' : 'outline'}
            className={isEditing ? 'bg-lime-600 hover:bg-lime-700' : ''}
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save
              </>
            ) : (
              <>
                <Edit2 className="w-4 h-4 mr-2" />
                Update Progress
              </>
            )}
          </Button>
          {isEditing && (
            <Button
              onClick={() => setIsEditing(false)}
              variant="ghost"
              className="ml-2"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {metrics.map((metric, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              <Card className={`${metric.lightColor} p-5 border-none`}>
                <div className={`${metric.color} w-10 h-10 rounded-xl flex items-center justify-center mb-3`}>
                  <metric.icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">
                  {metric.title}
                </div>
                {isEditing ? (
                  <Input
                    type="number"
                    value={formData[metric.field]}
                    onChange={(e) => setFormData({
                      ...formData,
                      [metric.field]: parseFloat(e.target.value) || 0
                    })}
                    className="text-2xl font-bold h-12"
                  />
                ) : (
                  <>
                    <div className="text-2xl font-bold text-slate-900">
                      {metric.format(metric.value)}
                    </div>
                    {metric.goal && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                          <span>{Math.round((metric.value / metric.goal) * 100)}%</span>
                          <span>Goal: {metric.format(metric.goal)}</span>
                        </div>
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((metric.value / metric.goal) * 100, 100)}%` }}
                            transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                            className={`h-full ${metric.color}`}
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}