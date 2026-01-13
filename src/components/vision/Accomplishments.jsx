import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
// TODO: Replace with MongoDB API calls
import { Trophy, Plus, Calendar, Tag, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function Accomplishments({ progressData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    category: 'win'
  });

  const queryClient = useQueryClient();

  const addAccomplishmentMutation = useMutation({
    mutationFn: async (data) => {
      const accomplishments = progressData?.accomplishments || [];
      const newAccomplishments = [...accomplishments, data];
      
      // TODO: Replace with MongoDB API call
      return Promise.resolve({ accomplishments: newAccomplishments });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['visionProgress']);
      setIsOpen(false);
      setFormData({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        category: 'win'
      });
    }
  });

  const deleteAccomplishmentMutation = useMutation({
    mutationFn: async (index) => {
      const accomplishments = [...(progressData?.accomplishments || [])];
      accomplishments.splice(index, 1);
      // TODO: Replace with MongoDB API call
      return Promise.resolve({ accomplishments });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['visionProgress']);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addAccomplishmentMutation.mutate(formData);
  };

  const accomplishments = progressData?.accomplishments || [];

  const categoryColors = {
    win: 'bg-lime-100 text-lime-700 border-lime-300',
    client: 'bg-blue-100 text-blue-700 border-blue-300',
    milestone: 'bg-purple-100 text-purple-700 border-purple-300',
    learning: 'bg-amber-100 text-amber-700 border-amber-300'
  };

  return (
    <section className="px-6 py-24 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-lime-600 font-medium text-sm uppercase tracking-widest">Celebrate</span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mt-3">Your accomplishments</h2>
          </motion.div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-lime-600 hover:bg-lime-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Win
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Accomplishment</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Closed my first $5k project"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Details about this win..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Date</label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-slate-200"
                    >
                      <option value="win">Win</option>
                      <option value="client">Client</option>
                      <option value="milestone">Milestone</option>
                      <option value="learning">Learning</option>
                    </select>
                  </div>
                </div>
                <Button type="submit" className="w-full bg-lime-600 hover:bg-lime-700">
                  Add Accomplishment
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {accomplishments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Trophy className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">No accomplishments yet. Start tracking your wins!</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {accomplishments.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <Trophy className="w-6 h-6 text-lime-500 flex-shrink-0" />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                      onClick={() => deleteAccomplishmentMutation.mutate(i)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{item.title}</h3>
                  {item.description && (
                    <p className="text-slate-600 text-sm mb-4">{item.description}</p>
                  )}
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className={categoryColors[item.category] || categoryColors.win}>
                      <Tag className="w-3 h-3 mr-1" />
                      {item.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-slate-500">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(item.date), 'MMM d, yyyy')}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}