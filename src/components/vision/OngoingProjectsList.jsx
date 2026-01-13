import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  FolderKanban, 
  Plus, 
  Calendar,
  DollarSign,
  ExternalLink,
  TrendingUp,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function OngoingProjectsList() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({
    project_name: '',
    client: '',
    description: '',
    start_date: new Date().toISOString().split('T')[0],
    deadline: '',
    project_value: '',
    status: 'Planning',
    color: '#3b82f6'
  });

  const queryClient = useQueryClient();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['ongoingProjects'],
    queryFn: () => base44.entities.OngoingProject.list('-created_date')
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.OngoingProject.create({
      ...data,
      progress_percentage: 0,
      stages: [
        { name: 'Discovery & Planning', completed: false, notes: '' },
        { name: 'Design', completed: false, notes: '' },
        { name: 'Development', completed: false, notes: '' },
        { name: 'Testing', completed: false, notes: '' },
        { name: 'Deployment', completed: false, notes: '' }
      ],
      tasks: []
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['ongoingProjects']);
      setIsAddOpen(false);
      setFormData({
        project_name: '',
        client: '',
        description: '',
        start_date: new Date().toISOString().split('T')[0],
        deadline: '',
        project_value: '',
        status: 'Planning',
        color: '#3b82f6'
      });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate({
      ...formData,
      project_value: parseFloat(formData.project_value) || 0
    });
  };

  const statusColors = {
    'Planning': 'bg-slate-500',
    'In Progress': 'bg-blue-500',
    'Review': 'bg-amber-500',
    'Completed': 'bg-green-500',
    'On Hold': 'bg-red-500'
  };

  const colors = [
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Green', value: '#10b981' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Cyan', value: '#06b6d4' }
  ];

  const activeProjects = projects.filter(p => p.status !== 'Completed');
  const totalValue = activeProjects.reduce((sum, p) => sum + (p.project_value || 0), 0);

  return (
    <section className="px-6 py-24 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-lime-600 font-medium text-sm uppercase tracking-widest">Active Work</span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mt-3">Ongoing projects</h2>
          </motion.div>

          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="bg-lime-600 hover:bg-lime-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Project</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Project Name *</label>
                    <Input
                      value={formData.project_name}
                      onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                      placeholder="E-commerce Website"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Client *</label>
                    <Input
                      value={formData.client}
                      onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                      placeholder="Acme Corp"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief project description..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Start Date</label>
                    <Input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Deadline</label>
                    <Input
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Value ($)</label>
                    <Input
                      type="number"
                      value={formData.project_value}
                      onChange={(e) => setFormData({ ...formData, project_value: e.target.value })}
                      placeholder="5000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-slate-200"
                    >
                      <option value="Planning">Planning</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Review">Review</option>
                      <option value="Completed">Completed</option>
                      <option value="On Hold">On Hold</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Project Color</label>
                    <div className="flex gap-2">
                      {colors.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, color: color.value })}
                          className={`w-10 h-10 rounded-lg border-2 transition-all ${
                            formData.color === color.value ? 'border-slate-900 scale-110' : 'border-slate-200'
                          }`}
                          style={{ backgroundColor: color.value }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-lime-600 hover:bg-lime-700">
                  Create Project
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 border-blue-200">
            <div className="flex items-center gap-3 mb-2">
              <FolderKanban className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-blue-900 font-medium">Active Projects</span>
            </div>
            <div className="text-3xl font-bold text-blue-900">{activeProjects.length}</div>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 p-6 border-green-200">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="text-sm text-green-900 font-medium">Total Value</span>
            </div>
            <div className="text-3xl font-bold text-green-900">${totalValue.toLocaleString()}</div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 border-purple-200">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-purple-900 font-medium">Avg Progress</span>
            </div>
            <div className="text-3xl font-bold text-purple-900">
              {activeProjects.length > 0
                ? Math.round(activeProjects.reduce((sum, p) => sum + (p.progress_percentage || 0), 0) / activeProjects.length)
                : 0}%
            </div>
          </Card>
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-48 bg-slate-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16">
            <FolderKanban className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">No ongoing projects yet. Add your first project!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <AnimatePresence>
              {projects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link to={createPageUrl(`ProjectDetail?id=${project.id}`)}>
                    <Card className="p-6 hover:shadow-xl transition-all cursor-pointer group border-l-4" style={{ borderLeftColor: project.color }}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                            {project.project_name}
                          </h3>
                          <p className="text-slate-500 text-sm">{project.client}</p>
                        </div>
                        <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                      </div>

                      {project.description && (
                        <p className="text-slate-600 text-sm mb-4 line-clamp-2">{project.description}</p>
                      )}

                      <div className="flex items-center gap-2 mb-4">
                        <Badge className={`${statusColors[project.status]} text-white border-0`}>
                          {project.status}
                        </Badge>
                        {project.project_value > 0 && (
                          <span className="text-green-600 font-semibold text-sm">
                            ${project.project_value.toLocaleString()}
                          </span>
                        )}
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-600">Progress</span>
                          <span className="font-semibold text-slate-900">{project.progress_percentage || 0}%</span>
                        </div>
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500"
                            style={{ 
                              width: `${project.progress_percentage || 0}%`,
                              backgroundColor: project.color 
                            }}
                          />
                        </div>
                      </div>

                      {project.deadline && (
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Clock className="w-4 h-4" />
                          Due: {format(new Date(project.deadline), 'MMM d, yyyy')}
                        </div>
                      )}
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}