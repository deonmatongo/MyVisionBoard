import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { BookOpen, Plus, Calendar, TrendingUp, AlertCircle, Target, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';

export default function WeeklyReflections({ progressData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    week_of: new Date().toISOString().split('T')[0],
    wins: '',
    challenges: '',
    next_week_focus: ''
  });

  const queryClient = useQueryClient();

  const addReflectionMutation = useMutation({
    mutationFn: async (data) => {
      const weekly_notes = progressData?.weekly_notes || [];
      const newNotes = [data, ...weekly_notes];
      
      if (progressData?.id) {
        return await base44.entities.VisionProgress.update(progressData.id, {
          weekly_notes: newNotes
        });
      } else {
        return await base44.entities.VisionProgress.create({
          weekly_notes: newNotes,
          current_revenue: 0,
          active_clients: 0
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['visionProgress']);
      setIsOpen(false);
      setFormData({
        week_of: new Date().toISOString().split('T')[0],
        wins: '',
        challenges: '',
        next_week_focus: ''
      });
    }
  });

  const deleteReflectionMutation = useMutation({
    mutationFn: async (index) => {
      const weekly_notes = [...(progressData?.weekly_notes || [])];
      weekly_notes.splice(index, 1);
      return await base44.entities.VisionProgress.update(progressData.id, {
        weekly_notes
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['visionProgress']);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addReflectionMutation.mutate(formData);
  };

  const reflections = progressData?.weekly_notes || [];

  return (
    <section className="px-6 py-24 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-lime-600 font-medium text-sm uppercase tracking-widest">Reflection</span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mt-3">Weekly check-ins</h2>
          </motion.div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-lime-600 hover:bg-lime-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Reflection
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Weekly Reflection</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Week Of</label>
                  <input
                    type="date"
                    value={formData.week_of}
                    onChange={(e) => setFormData({ ...formData, week_of: e.target.value })}
                    className="w-full h-10 px-3 rounded-md border border-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    Wins This Week
                  </label>
                  <Textarea
                    value={formData.wins}
                    onChange={(e) => setFormData({ ...formData, wins: e.target.value })}
                    placeholder="What went well? What achievements did you have?"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    Challenges Faced
                  </label>
                  <Textarea
                    value={formData.challenges}
                    onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
                    placeholder="What obstacles did you encounter?"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-500" />
                    Next Week's Focus
                  </label>
                  <Textarea
                    value={formData.next_week_focus}
                    onChange={(e) => setFormData({ ...formData, next_week_focus: e.target.value })}
                    placeholder="What will you prioritize next week?"
                    rows={3}
                  />
                </div>
                <Button type="submit" className="w-full bg-lime-600 hover:bg-lime-700">
                  Save Reflection
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {reflections.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">No weekly reflections yet. Start documenting your journey!</p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {reflections.map((reflection, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-lime-500" />
                        <h3 className="text-lg font-semibold text-slate-900">
                          Week of {format(new Date(reflection.week_of), 'MMM d, yyyy')}
                        </h3>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                        onClick={() => deleteReflectionMutation.mutate(i)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {reflection.wins && (
                        <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-900">Wins</span>
                          </div>
                          <p className="text-slate-700 text-sm leading-relaxed">{reflection.wins}</p>
                        </div>
                      )}
                      
                      {reflection.challenges && (
                        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="w-4 h-4 text-amber-600" />
                            <span className="text-sm font-medium text-amber-900">Challenges</span>
                          </div>
                          <p className="text-slate-700 text-sm leading-relaxed">{reflection.challenges}</p>
                        </div>
                      )}
                      
                      {reflection.next_week_focus && (
                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-900">Next Week's Focus</span>
                          </div>
                          <p className="text-slate-700 text-sm leading-relaxed">{reflection.next_week_focus}</p>
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}