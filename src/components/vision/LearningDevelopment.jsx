import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// TODO: Replace with MongoDB API calls
import { 
  BookOpen, 
  Plus, 
  Calendar,
  Trash2,
  ExternalLink,
  GraduationCap,
  TrendingUp,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';

export default function LearningDevelopment() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedLearning, setSelectedLearning] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technical Skills',
    status: 'Not Started',
    progress_percentage: 0,
    start_date: '',
    target_date: '',
    priority: 'Medium',
    notes: ''
  });

  const [calendarData, setCalendarData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    start_time: '09:00',
    end_time: '10:00',
    description: ''
  });

  const queryClient = useQueryClient();

  const { data: learningItems = [], isLoading } = useQuery({
    queryKey: ['learning'],
    queryFn: () => {
      // TODO: Replace with MongoDB API call
      return Promise.resolve([]);
    }
  });

  const createMutation = useMutation({
    mutationFn: (data) => {
      // TODO: Replace with MongoDB API call
      return Promise.resolve(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['learning']);
      setIsAddOpen(false);
      resetForm();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => {
      // TODO: Replace with MongoDB API call
      return Promise.resolve({ id, ...data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['learning']);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => {
      // TODO: Replace with MongoDB API call
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['learning']);
    }
  });

  const createCalendarMutation = useMutation({
    mutationFn: (data) => {
      // TODO: Replace with MongoDB API call
      return Promise.resolve(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['events']);
      setIsCalendarOpen(false);
      setSelectedLearning(null);
      setCalendarData({
        title: '',
        date: new Date().toISOString().split('T')[0],
        start_time: '09:00',
        end_time: '10:00',
        description: ''
      });
    }
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'Technical Skills',
      status: 'Not Started',
      progress_percentage: 0,
      start_date: '',
      target_date: '',
      priority: 'Medium',
      notes: ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleProgressUpdate = (id, newProgress) => {
    const newStatus = newProgress === 100 ? 'Completed' : newProgress > 0 ? 'In Progress' : 'Not Started';
    updateMutation.mutate({
      id,
      data: { progress_percentage: newProgress, status: newStatus }
    });
  };

  const handleAddToCalendar = (item) => {
    setSelectedLearning(item);
    setCalendarData({
      ...calendarData,
      title: item.title,
      description: item.description || ''
    });
    setIsCalendarOpen(true);
  };

  const handleCalendarSubmit = (e) => {
    e.preventDefault();
    createCalendarMutation.mutate({
      ...calendarData,
      category: 'Learning',
      completed: false
    });
  };

  const categoryColors = {
    'Technical Skills': { bg: 'bg-blue-500', light: 'bg-blue-100', text: 'text-blue-700' },
    'Business & Marketing': { bg: 'bg-purple-500', light: 'bg-purple-100', text: 'text-purple-700' },
    'Design': { bg: 'bg-pink-500', light: 'bg-pink-100', text: 'text-pink-700' },
    'Personal Development': { bg: 'bg-green-500', light: 'bg-green-100', text: 'text-green-700' },
    'Industry Knowledge': { bg: 'bg-amber-500', light: 'bg-amber-100', text: 'text-amber-700' }
  };

  const statusColors = {
    'Not Started': 'bg-slate-100 text-slate-700',
    'In Progress': 'bg-blue-100 text-blue-700',
    'Completed': 'bg-green-100 text-green-700',
    'On Hold': 'bg-amber-100 text-amber-700'
  };

  const priorityColors = {
    'Low': 'border-slate-300',
    'Medium': 'border-blue-400',
    'High': 'border-red-400'
  };

  const filteredItems = filterStatus === 'all' 
    ? learningItems 
    : learningItems.filter(item => item.status === filterStatus);

  const stats = {
    total: learningItems.length,
    inProgress: learningItems.filter(i => i.status === 'In Progress').length,
    completed: learningItems.filter(i => i.status === 'Completed').length,
    avgProgress: learningItems.length > 0 
      ? Math.round(learningItems.reduce((sum, i) => sum + (i.progress_percentage || 0), 0) / learningItems.length)
      : 0
  };

  return (
    <section className="px-6 py-24 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-blue-600 font-medium text-sm uppercase tracking-widest">Growth</span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mt-3">Learning & Development</h2>
          </motion.div>

          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-sm sm:text-base">
                <Plus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Add Learning Goal</span>
                <span className="sm:hidden">Add Goal</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Learning Goal</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">What are you learning? *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="React Advanced Patterns"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="What you want to achieve..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-slate-200"
                    >
                      {Object.keys(categoryColors).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Priority</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-slate-200"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Start Date</label>
                    <Input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Target Date</label>
                    <Input
                      type="date"
                      value={formData.target_date}
                      onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Notes</label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Progress notes, resources, reflections..."
                    rows={3}
                  />
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  Add Learning Goal
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <Card className="bg-white p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              <span className="text-xs sm:text-sm text-slate-600 font-medium">Total</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">{stats.total}</div>
          </Card>

          <Card className="bg-white p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
              <span className="text-xs sm:text-sm text-slate-600 font-medium">In Progress</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-amber-600">{stats.inProgress}</div>
          </Card>

          <Card className="bg-white p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              <span className="text-xs sm:text-sm text-slate-600 font-medium">Completed</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-green-600">{stats.completed}</div>
          </Card>

          <Card className="bg-white p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              <span className="text-xs sm:text-sm text-slate-600 font-medium">Avg Progress</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-purple-600">{stats.avgProgress}%</div>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {['all', 'Not Started', 'In Progress', 'Completed', 'On Hold'].map((status) => (
            <Button
              key={status}
              size="sm"
              variant={filterStatus === status ? 'default' : 'outline'}
              onClick={() => setFilterStatus(status)}
              className={filterStatus === status ? 'bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm' : 'text-xs sm:text-sm'}
            >
              {status === 'all' ? 'All' : status}
            </Button>
          ))}
        </div>

        {/* Learning Items */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-white rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">No learning goals yet. Start your growth journey!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnimatePresence>
              {filteredItems.map((item, i) => {
                const colors = categoryColors[item.category];
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className={`p-4 sm:p-6 hover:shadow-lg transition-all border-l-4 ${priorityColors[item.priority]}`}>
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-base sm:text-lg text-slate-900 mb-2">{item.title}</h3>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge className={`${colors.light} ${colors.text} border-0`}>
                              {item.category}
                            </Badge>
                            <Badge className={statusColors[item.status]}>
                              {item.status}
                            </Badge>
                            {item.priority === 'High' && (
                              <Badge className="bg-red-100 text-red-700 border-0">
                                High Priority
                              </Badge>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-sm text-slate-600 mb-3">{item.description}</p>
                          )}
                        </div>
                        <button
                          onClick={() => deleteMutation.mutate(item.id)}
                          className="text-red-500 hover:text-red-700 flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Progress */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-slate-700">Progress</span>
                          <span className="text-sm font-bold text-slate-900">
                            {item.progress_percentage || 0}%
                          </span>
                        </div>
                        <Progress value={item.progress_percentage || 0} className="h-2" />
                        <div className="flex flex-wrap gap-2 mt-2">
                          {[0, 25, 50, 75, 100].map(val => (
                            <Button
                              key={val}
                              size="sm"
                              variant="outline"
                              onClick={() => handleProgressUpdate(item.id, val)}
                              className="text-xs px-2 sm:px-3"
                            >
                              {val}%
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Dates */}
                      {(item.start_date || item.target_date) && (
                        <div className="text-sm text-slate-600 mb-4 space-y-1">
                          {item.start_date && (
                            <div>Started: {format(new Date(item.start_date), 'MMM d, yyyy')}</div>
                          )}
                          {item.target_date && (
                            <div>Target: {format(new Date(item.target_date), 'MMM d, yyyy')}</div>
                          )}
                        </div>
                      )}

                      {/* Notes */}
                      {item.notes && (
                        <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg mb-4">
                          {item.notes}
                        </div>
                      )}

                      {/* Actions */}
                      <Button
                        onClick={() => handleAddToCalendar(item)}
                        variant="outline"
                        className="w-full"
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Add to Calendar
                      </Button>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Calendar Dialog */}
        <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Learning Session to Calendar</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCalendarSubmit} className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Session Title *</label>
                <Input
                  value={calendarData.title}
                  onChange={(e) => setCalendarData({ ...calendarData, title: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Date *</label>
                  <Input
                    type="date"
                    value={calendarData.date}
                    onChange={(e) => setCalendarData({ ...calendarData, date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Start Time</label>
                  <Input
                    type="time"
                    value={calendarData.start_time}
                    onChange={(e) => setCalendarData({ ...calendarData, start_time: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">End Time</label>
                  <Input
                    type="time"
                    value={calendarData.end_time}
                    onChange={(e) => setCalendarData({ ...calendarData, end_time: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Notes</label>
                <Textarea
                  value={calendarData.description}
                  onChange={(e) => setCalendarData({ ...calendarData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Add to Calendar
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}