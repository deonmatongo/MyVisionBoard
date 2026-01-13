import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Clock,
  Trash2,
  CheckCircle2,
  Circle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    start_time: '',
    end_time: '',
    category: 'Client Work',
    description: ''
  });

  const queryClient = useQueryClient();

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['calendarEvents'],
    queryFn: () => base44.entities.CalendarEvent.list('-date')
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.CalendarEvent.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['calendarEvents']);
      setIsAddOpen(false);
      setFormData({
        title: '',
        date: selectedDate.toISOString().split('T')[0],
        start_time: '',
        end_time: '',
        category: 'Client Work',
        description: ''
      });
    }
  });

  const toggleCompleteMutation = useMutation({
    mutationFn: ({ id, completed }) => 
      base44.entities.CalendarEvent.update(id, { completed }),
    onSuccess: () => {
      queryClient.invalidateQueries(['calendarEvents']);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.CalendarEvent.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['calendarEvents']);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const categoryColors = {
    'Client Work': { bg: 'bg-blue-500', light: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
    'Sales': { bg: 'bg-green-500', light: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
    'Learning': { bg: 'bg-purple-500', light: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
    'Marketing': { bg: 'bg-pink-500', light: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-200' },
    'Admin': { bg: 'bg-slate-500', light: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' },
    'Meeting': { bg: 'bg-amber-500', light: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
    'Personal': { bg: 'bg-cyan-500', light: 'bg-cyan-100', text: 'text-cyan-700', border: 'border-cyan-200' }
  };

  // Generate calendar days
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getEventsForDay = (day) => {
    return events.filter(event => isSameDay(new Date(event.date), day));
  };

  const selectedDayEvents = getEventsForDay(selectedDate);

  return (
    <section className="px-6 py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-lime-600 font-medium text-sm uppercase tracking-widest">Daily Planning</span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mt-3">Work calendar</h2>
          </motion.div>

          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="bg-lime-600 hover:bg-lime-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Calendar Event</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Title *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Client meeting"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-3">
                    <label className="text-sm font-medium mb-2 block">Date *</label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Start</label>
                    <Input
                      type="time"
                      value={formData.start_time}
                      onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">End</label>
                    <Input
                      type="time"
                      value={formData.end_time}
                      onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
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
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Event details..."
                    rows={3}
                  />
                </div>

                <Button type="submit" className="w-full bg-lime-600 hover:bg-lime-700">
                  Add Event
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-6">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                
                <h3 className="text-2xl font-bold text-slate-900">
                  {format(currentDate, 'MMMM yyyy')}
                </h3>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {/* Day headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-slate-500 py-2">
                    {day}
                  </div>
                ))}

                {/* Calendar days */}
                {calendarDays.map((day, i) => {
                  const dayEvents = getEventsForDay(day);
                  const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                  const isToday = isSameDay(day, new Date());
                  const isSelected = isSameDay(day, selectedDate);

                  return (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.01 }}
                      onClick={() => setSelectedDate(day)}
                      className={`aspect-square p-2 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-lime-500 bg-lime-50'
                          : isToday
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      } ${!isCurrentMonth && 'opacity-40'}`}
                    >
                      <div className={`text-sm font-medium ${
                        isSelected ? 'text-lime-700' : isToday ? 'text-blue-700' : 'text-slate-900'
                      }`}>
                        {format(day, 'd')}
                      </div>
                      
                      {dayEvents.length > 0 && (
                        <div className="flex gap-1 mt-1 flex-wrap justify-center">
                          {dayEvents.slice(0, 3).map((event, idx) => (
                            <div
                              key={idx}
                              className={`w-1.5 h-1.5 rounded-full ${categoryColors[event.category].bg}`}
                            />
                          ))}
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Events List */}
          <div>
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <CalendarIcon className="w-5 h-5 text-lime-600" />
                <h3 className="text-xl font-bold text-slate-900">
                  {format(selectedDate, 'MMM d, yyyy')}
                </h3>
              </div>

              {selectedDayEvents.length === 0 ? (
                <p className="text-center text-slate-500 py-8">No events for this day</p>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence>
                    {selectedDayEvents.map((event, i) => {
                      const colors = categoryColors[event.category];
                      return (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ delay: i * 0.05 }}
                          className={`p-4 rounded-xl border-2 ${colors.light} ${colors.border} group`}
                        >
                          <div className="flex items-start gap-3">
                            <button
                              onClick={() => toggleCompleteMutation.mutate({ 
                                id: event.id, 
                                completed: !event.completed 
                              })}
                              className="mt-1"
                            >
                              {event.completed ? (
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                              ) : (
                                <Circle className="w-5 h-5 text-slate-400" />
                              )}
                            </button>

                            <div className="flex-1">
                              <h4 className={`font-semibold mb-1 ${event.completed ? 'line-through text-slate-500' : colors.text}`}>
                                {event.title}
                              </h4>
                              
                              <Badge className={`${colors.bg} text-white border-0 mb-2`}>
                                {event.category}
                              </Badge>

                              {(event.start_time || event.end_time) && (
                                <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                                  <Clock className="w-4 h-4" />
                                  {event.start_time && format(new Date(`2000-01-01T${event.start_time}`), 'h:mm a')}
                                  {event.end_time && ` - ${format(new Date(`2000-01-01T${event.end_time}`), 'h:mm a')}`}
                                </div>
                              )}

                              {event.description && (
                                <p className="text-sm text-slate-600">{event.description}</p>
                              )}
                            </div>

                            <button
                              onClick={() => deleteMutation.mutate(event.id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </Card>

            {/* Legend */}
            <Card className="p-6 mt-6">
              <h4 className="font-semibold text-slate-900 mb-4">Categories</h4>
              <div className="space-y-2">
                {Object.entries(categoryColors).map(([category, colors]) => (
                  <div key={category} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${colors.bg}`} />
                    <span className="text-sm text-slate-600">{category}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}