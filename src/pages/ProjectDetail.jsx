import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// TODO: Replace with MongoDB API calls
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Circle, 
  Plus,
  Trash2,
  Upload,
  Download,
  Calendar,
  DollarSign,
  User,
  Edit2,
  Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function ProjectDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('id');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [newTask, setNewTask] = useState('');
  const [newTaskDate, setNewTaskDate] = useState('');

  const queryClient = useQueryClient();

  const { data: project, isLoading } = useQuery({
    queryKey: ['ongoingProject', projectId],
    queryFn: async () => {
      // TODO: Replace with MongoDB API call
      // Example: const project = await fetch(`/api/ongoingprojects/${projectId}`).then(r => r.json());
      return null;
    },
    enabled: !!projectId
  });

  const updateMutation = useMutation({
    mutationFn: (data) => {
      // TODO: Replace with MongoDB API call
      // Example: return fetch(`/api/ongoingprojects/${projectId}`, { method: 'PUT', body: JSON.stringify(data) }).then(r => r.json());
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['ongoingProject', projectId]);
      queryClient.invalidateQueries(['ongoingProjects']);
    }
  });

  React.useEffect(() => {
    if (project) {
      setNotes(project.notes || '');
    }
  }, [project]);

  if (!projectId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">No project ID provided</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 mb-4">Project not found</p>
          <Link to={createPageUrl('VisionBoard')}>
            <Button>Back to Vision Board</Button>
          </Link>
        </div>
      </div>
    );
  }

  const toggleStage = (index) => {
    const newStages = [...(project.stages || [])];
    newStages[index] = {
      ...newStages[index],
      completed: !newStages[index].completed
    };
    
    const completedCount = newStages.filter(s => s.completed).length;
    const progress = Math.round((completedCount / newStages.length) * 100);
    
    updateMutation.mutate({ 
      stages: newStages,
      progress_percentage: progress
    });
  };

  const updateStageNotes = (index, notes) => {
    const newStages = [...(project.stages || [])];
    newStages[index] = { ...newStages[index], notes };
    updateMutation.mutate({ stages: newStages });
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    const tasks = project.tasks || [];
    updateMutation.mutate({
      tasks: [...tasks, { task: newTask, completed: false, due_date: newTaskDate }]
    });
    setNewTask('');
    setNewTaskDate('');
  };

  const toggleTask = (index) => {
    const tasks = [...(project.tasks || [])];
    tasks[index] = { ...tasks[index], completed: !tasks[index].completed };
    updateMutation.mutate({ tasks });
  };

  const deleteTask = (index) => {
    const tasks = [...(project.tasks || [])];
    tasks.splice(index, 1);
    updateMutation.mutate({ tasks });
  };

  const saveNotes = () => {
    updateMutation.mutate({ notes });
    setIsEditingNotes(false);
  };

  const updateProgress = (value) => {
    updateMutation.mutate({ progress_percentage: parseInt(value) });
  };

  const statusColors = {
    'Planning': 'bg-slate-500',
    'In Progress': 'bg-blue-500',
    'Review': 'bg-amber-500',
    'Completed': 'bg-green-500',
    'On Hold': 'bg-red-500'
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Link to={createPageUrl('VisionBoard')} className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Vision Board
          </Link>
          
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: project.color }}
                />
                <h1 className="text-4xl font-bold text-slate-900">{project.project_name}</h1>
              </div>
              <p className="text-xl text-slate-600">{project.client}</p>
            </div>
            <Badge className={`${statusColors[project.status]} text-white border-0 text-lg px-4 py-2`}>
              {project.status}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview Card */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Project Overview</h2>
              
              {project.description && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-slate-500 mb-2">Description</h3>
                  <p className="text-slate-700">{project.description}</p>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-2">Start Date</h3>
                  <div className="flex items-center gap-2 text-slate-900">
                    <Calendar className="w-4 h-4" />
                    {project.start_date ? format(new Date(project.start_date), 'MMM d, yyyy') : 'Not set'}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-2">Deadline</h3>
                  <div className="flex items-center gap-2 text-slate-900">
                    <Calendar className="w-4 h-4" />
                    {project.deadline ? format(new Date(project.deadline), 'MMM d, yyyy') : 'Not set'}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-2">Project Value</h3>
                  <div className="flex items-center gap-2 text-slate-900 font-semibold">
                    <DollarSign className="w-4 h-4" />
                    ${(project.project_value || 0).toLocaleString()}
                  </div>
                </div>

                {project.client_contact && (
                  <div>
                    <h3 className="text-sm font-medium text-slate-500 mb-2">Client Contact</h3>
                    <div className="flex items-center gap-2 text-slate-900">
                      <User className="w-4 h-4" />
                      {project.client_contact}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Progress Tracker */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Overall Progress</h2>
                <span className="text-3xl font-bold" style={{ color: project.color }}>
                  {project.progress_percentage || 0}%
                </span>
              </div>
              
              <div className="mb-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={project.progress_percentage || 0}
                  onChange={(e) => updateProgress(e.target.value)}
                  className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, ${project.color} 0%, ${project.color} ${project.progress_percentage}%, #e2e8f0 ${project.progress_percentage}%, #e2e8f0 100%)`
                  }}
                />
              </div>
              <p className="text-sm text-slate-500">Drag to update progress manually</p>
            </Card>

            {/* Project Stages */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Project Stages</h2>
              
              <div className="space-y-4">
                {(project.stages || []).map((stage, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      stage.completed 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleStage(index)}
                        className="mt-1"
                      >
                        {stage.completed ? (
                          <CheckCircle2 className="w-6 h-6 text-green-600" />
                        ) : (
                          <Circle className="w-6 h-6 text-slate-400 hover:text-slate-600" />
                        )}
                      </button>
                      
                      <div className="flex-1">
                        <h3 className={`font-semibold mb-2 ${stage.completed ? 'text-green-900 line-through' : 'text-slate-900'}`}>
                          {stage.name}
                        </h3>
                        
                        <Textarea
                          value={stage.notes || ''}
                          onChange={(e) => updateStageNotes(index, e.target.value)}
                          placeholder="Add notes about this stage..."
                          className="text-sm"
                          rows={2}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Tasks */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Tasks</h2>
              
              <div className="flex gap-2 mb-6">
                <Input
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Add a new task..."
                  onKeyPress={(e) => e.key === 'Enter' && addTask()}
                />
                <Input
                  type="date"
                  value={newTaskDate}
                  onChange={(e) => setNewTaskDate(e.target.value)}
                  className="w-40"
                />
                <Button onClick={addTask} style={{ backgroundColor: project.color }}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-3">
                {(project.tasks || []).map((task, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${
                      task.completed ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-200'
                    }`}
                  >
                    <button onClick={() => toggleTask(index)}>
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-400" />
                      )}
                    </button>
                    
                    <span className={`flex-1 ${task.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                      {task.task}
                    </span>
                    
                    {task.due_date && (
                      <span className="text-sm text-slate-500">
                        {format(new Date(task.due_date), 'MMM d')}
                      </span>
                    )}
                    
                    <button
                      onClick={() => deleteTask(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}

                {(!project.tasks || project.tasks.length === 0) && (
                  <p className="text-center text-slate-500 py-8">No tasks yet. Add your first task above!</p>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Notes */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900">Project Notes</h2>
                {!isEditingNotes ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingNotes(true)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={saveNotes}
                    style={{ color: project.color }}
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {isEditingNotes ? (
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add project notes, updates, or important information..."
                  rows={10}
                  className="text-sm"
                />
              ) : (
                <div className="text-sm text-slate-700 whitespace-pre-wrap">
                  {notes || 'No notes yet. Click edit to add notes.'}
                </div>
              )}
            </Card>

            {/* Quick Stats */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Stats</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-slate-500 mb-1">Completed Stages</div>
                  <div className="text-2xl font-bold text-slate-900">
                    {(project.stages || []).filter(s => s.completed).length} / {(project.stages || []).length}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-slate-500 mb-1">Completed Tasks</div>
                  <div className="text-2xl font-bold text-slate-900">
                    {(project.tasks || []).filter(t => t.completed).length} / {(project.tasks || []).length}
                  </div>
                </div>

                {project.deadline && (
                  <div>
                    <div className="text-sm text-slate-500 mb-1">Days Until Deadline</div>
                    <div className="text-2xl font-bold text-slate-900">
                      {Math.ceil((new Date(project.deadline) - new Date()) / (1000 * 60 * 60 * 24))} days
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}