import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  Briefcase, 
  Plus, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  Mail,
  ChevronRight,
  Edit2,
  Trash2,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function PipelineOverview() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [selectedStage, setSelectedStage] = useState('all');
  const [formData, setFormData] = useState({
    project_name: '',
    client: '',
    stage: 'Lead',
    estimated_value: '',
    expected_close_date: '',
    notes: '',
    contact_email: '',
    last_contact_date: ''
  });

  const queryClient = useQueryClient();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projectPipeline'],
    queryFn: () => base44.entities.ProjectPipeline.list('-created_date')
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.ProjectPipeline.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['projectPipeline']);
      setIsAddOpen(false);
      resetForm();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.ProjectPipeline.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['projectPipeline']);
      setEditingProject(null);
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.ProjectPipeline.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['projectPipeline']);
    }
  });

  const resetForm = () => {
    setFormData({
      project_name: '',
      client: '',
      stage: 'Lead',
      estimated_value: '',
      expected_close_date: '',
      notes: '',
      contact_email: '',
      last_contact_date: ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      estimated_value: parseFloat(formData.estimated_value) || 0
    };

    if (editingProject) {
      updateMutation.mutate({ id: editingProject.id, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      project_name: project.project_name || '',
      client: project.client || '',
      stage: project.stage || 'Lead',
      estimated_value: project.estimated_value?.toString() || '',
      expected_close_date: project.expected_close_date || '',
      notes: project.notes || '',
      contact_email: project.contact_email || '',
      last_contact_date: project.last_contact_date || ''
    });
    setIsAddOpen(true);
  };

  const handleStageChange = (projectId, newStage) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      updateMutation.mutate({ 
        id: projectId, 
        data: { ...project, stage: newStage } 
      });
    }
  };

  const stages = [
    { 
      name: 'Lead', 
      color: 'bg-slate-500', 
      lightColor: 'bg-slate-50',
      borderColor: 'border-slate-200',
      textColor: 'text-slate-700'
    },
    { 
      name: 'Proposal', 
      color: 'bg-blue-500', 
      lightColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700'
    },
    { 
      name: 'Negotiation', 
      color: 'bg-amber-500', 
      lightColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-700'
    },
    { 
      name: 'Closed-Won', 
      color: 'bg-green-500', 
      lightColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-700'
    },
    { 
      name: 'Closed-Lost', 
      color: 'bg-red-500', 
      lightColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-700'
    }
  ];

  // Calculate pipeline metrics
  const activePipeline = projects.filter(p => 
    !['Closed-Won', 'Closed-Lost'].includes(p.stage)
  );
  
  const totalPipelineValue = activePipeline.reduce((sum, p) => 
    sum + (p.estimated_value || 0), 0
  );

  const wonProjects = projects.filter(p => p.stage === 'Closed-Won');
  const wonValue = wonProjects.reduce((sum, p) => sum + (p.estimated_value || 0), 0);

  const stageStats = stages.map(stage => ({
    ...stage,
    count: projects.filter(p => p.stage === stage.name).length,
    value: projects
      .filter(p => p.stage === stage.name)
      .reduce((sum, p) => sum + (p.estimated_value || 0), 0)
  }));

  const filteredProjects = selectedStage === 'all' 
    ? projects 
    : projects.filter(p => p.stage === selectedStage);

  return (
    <section className="px-6 py-24 bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-lime-400 font-medium text-sm uppercase tracking-widest">Sales Pipeline</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3">Pipeline overview</h2>
          </motion.div>

          <Dialog open={isAddOpen} onOpenChange={(open) => {
            setIsAddOpen(open);
            if (!open) {
              setEditingProject(null);
              resetForm();
            }
          }}>
            <DialogTrigger asChild>
              <Button className="bg-lime-600 hover:bg-lime-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProject ? 'Edit Project' : 'Add New Project'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Project Name *</label>
                    <Input
                      value={formData.project_name}
                      onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                      placeholder="Website Redesign"
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

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Stage</label>
                    <select
                      value={formData.stage}
                      onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-slate-900"
                    >
                      {stages.map(stage => (
                        <option key={stage.name} value={stage.name}>{stage.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Estimated Value ($)</label>
                    <Input
                      type="number"
                      value={formData.estimated_value}
                      onChange={(e) => setFormData({ ...formData, estimated_value: e.target.value })}
                      placeholder="5000"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Expected Close Date</label>
                    <Input
                      type="date"
                      value={formData.expected_close_date}
                      onChange={(e) => setFormData({ ...formData, expected_close_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Contact Email</label>
                    <Input
                      type="email"
                      value={formData.contact_email}
                      onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                      placeholder="client@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Last Contact Date</label>
                  <Input
                    type="date"
                    value={formData.last_contact_date}
                    onChange={(e) => setFormData({ ...formData, last_contact_date: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Notes</label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional details about this project..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1 bg-lime-600 hover:bg-lime-700">
                    {editingProject ? 'Update Project' : 'Add Project'}
                  </Button>
                  {editingProject && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => {
                        if (confirm('Delete this project?')) {
                          deleteMutation.mutate(editingProject.id);
                          setIsAddOpen(false);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-lime-500 w-10 h-10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="text-slate-300 text-sm">Active Pipeline</span>
              </div>
              <div className="text-3xl font-bold">${totalPipelineValue.toLocaleString()}</div>
              <div className="text-slate-400 text-sm mt-1">{activePipeline.length} projects</div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-green-500 w-10 h-10 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <span className="text-slate-300 text-sm">Won Value</span>
              </div>
              <div className="text-3xl font-bold">${wonValue.toLocaleString()}</div>
              <div className="text-slate-400 text-sm mt-1">{wonProjects.length} projects won</div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-blue-500 w-10 h-10 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <span className="text-slate-300 text-sm">Total Projects</span>
              </div>
              <div className="text-3xl font-bold">{projects.length}</div>
              <div className="text-slate-400 text-sm mt-1">All stages</div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-amber-500 w-10 h-10 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <span className="text-slate-300 text-sm">Win Rate</span>
              </div>
              <div className="text-3xl font-bold">
                {projects.length > 0 
                  ? Math.round((wonProjects.length / projects.filter(p => ['Closed-Won', 'Closed-Lost'].includes(p.stage)).length) * 100) || 0
                  : 0}%
              </div>
              <div className="text-slate-400 text-sm mt-1">Close rate</div>
            </Card>
          </motion.div>
        </div>

        {/* Stage Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Button
            variant={selectedStage === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedStage('all')}
            className={selectedStage === 'all' ? 'bg-lime-600 hover:bg-lime-700' : 'bg-white/10 border-white/20 hover:bg-white/20'}
          >
            All ({projects.length})
          </Button>
          {stageStats.map((stage, i) => (
            <Button
              key={i}
              variant={selectedStage === stage.name ? 'default' : 'outline'}
              onClick={() => setSelectedStage(stage.name)}
              className={selectedStage === stage.name 
                ? `${stage.color} hover:opacity-90` 
                : 'bg-white/10 border-white/20 hover:bg-white/20'}
            >
              {stage.name} ({stage.count})
            </Button>
          ))}
        </div>

        {/* Projects List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-white/10 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-16">
            <Briefcase className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">No projects in pipeline yet. Add your first project!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            <AnimatePresence>
              {filteredProjects.map((project, i) => {
                const stageConfig = stages.find(s => s.name === project.stage);
                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05 }}
                    className="group"
                  >
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 hover:bg-white/15 transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-1">{project.project_name}</h3>
                          <p className="text-slate-300 text-sm">{project.client}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleEdit(project)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        <Badge className={`${stageConfig?.color} text-white border-0`}>
                          {project.stage}
                        </Badge>
                        {project.estimated_value > 0 && (
                          <span className="text-lime-400 font-semibold">
                            ${project.estimated_value.toLocaleString()}
                          </span>
                        )}
                      </div>

                      {(project.expected_close_date || project.contact_email) && (
                        <div className="space-y-2 text-sm text-slate-300 mb-4">
                          {project.expected_close_date && (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-slate-400" />
                              Expected: {format(new Date(project.expected_close_date), 'MMM d, yyyy')}
                            </div>
                          )}
                          {project.contact_email && (
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-slate-400" />
                              {project.contact_email}
                            </div>
                          )}
                        </div>
                      )}

                      {project.notes && (
                        <p className="text-slate-400 text-sm mb-4 line-clamp-2">{project.notes}</p>
                      )}

                      {/* Quick Stage Change */}
                      {!['Closed-Won', 'Closed-Lost'].includes(project.stage) && (
                        <div className="flex gap-2 pt-4 border-t border-white/10">
                          <span className="text-xs text-slate-400 mr-2">Move to:</span>
                          {stages
                            .filter(s => s.name !== project.stage && !['Closed-Lost'].includes(s.name))
                            .slice(0, 3)
                            .map((stage) => (
                              <Button
                                key={stage.name}
                                variant="ghost"
                                size="sm"
                                className="text-xs h-7 px-2 hover:bg-white/10"
                                onClick={() => handleStageChange(project.id, stage.name)}
                              >
                                {stage.name}
                                <ChevronRight className="w-3 h-3 ml-1" />
                              </Button>
                            ))}
                        </div>
                      )}
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}