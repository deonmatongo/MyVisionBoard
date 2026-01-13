import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// TODO: Replace with MongoDB API calls
import { 
  DollarSign, 
  Plus, 
  TrendingDown,
  Calendar,
  Trash2,
  PieChart,
  Receipt
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, startOfMonth, endOfMonth } from 'date-fns';

export default function CostTracker() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Software & Tools',
    date: new Date().toISOString().split('T')[0],
    recurring: false,
    notes: ''
  });

  const queryClient = useQueryClient();

  const { data: expenses = [], isLoading } = useQuery({
    queryKey: ['expenses'],
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
      queryClient.invalidateQueries(['expenses']);
      setIsAddOpen(false);
      setFormData({
        description: '',
        amount: '',
        category: 'Software & Tools',
        date: new Date().toISOString().split('T')[0],
        recurring: false,
        notes: ''
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => {
      // TODO: Replace with MongoDB API call
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['expenses']);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate({
      ...formData,
      amount: parseFloat(formData.amount)
    });
  };

  const categoryColors = {
    'Software & Tools': { bg: 'bg-blue-500', light: 'bg-blue-100', text: 'text-blue-700' },
    'Marketing & Ads': { bg: 'bg-pink-500', light: 'bg-pink-100', text: 'text-pink-700' },
    'Education & Training': { bg: 'bg-purple-500', light: 'bg-purple-100', text: 'text-purple-700' },
    'Hardware & Equipment': { bg: 'bg-slate-500', light: 'bg-slate-100', text: 'text-slate-700' },
    'Hosting & Infrastructure': { bg: 'bg-cyan-500', light: 'bg-cyan-100', text: 'text-cyan-700' },
    'Subscriptions': { bg: 'bg-indigo-500', light: 'bg-indigo-100', text: 'text-indigo-700' },
    'Freelancers & Contractors': { bg: 'bg-amber-500', light: 'bg-amber-100', text: 'text-amber-700' },
    'Office & Supplies': { bg: 'bg-green-500', light: 'bg-green-100', text: 'text-green-700' },
    'Other': { bg: 'bg-slate-400', light: 'bg-slate-100', text: 'text-slate-600' }
  };

  // Filter by period
  const now = new Date();
  const filteredExpenses = expenses.filter(expense => {
    if (selectedPeriod === 'all') return true;
    const expenseDate = new Date(expense.date);
    if (selectedPeriod === 'month') {
      return expenseDate >= startOfMonth(now) && expenseDate <= endOfMonth(now);
    }
    if (selectedPeriod === 'year') {
      return expenseDate.getFullYear() === now.getFullYear();
    }
    return true;
  });

  // Calculate totals
  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const recurringExpenses = filteredExpenses.filter(e => e.recurring);
  const totalRecurring = recurringExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);

  // Category breakdown
  const categoryTotals = {};
  filteredExpenses.forEach(expense => {
    if (!categoryTotals[expense.category]) {
      categoryTotals[expense.category] = 0;
    }
    categoryTotals[expense.category] += expense.amount || 0;
  });

  const sortedCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <section className="px-6 py-24 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-lime-600 font-medium text-sm uppercase tracking-widest">Financial Tracking</span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mt-3">Costs & Expenses</h2>
          </motion.div>

          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="bg-lime-600 hover:bg-lime-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Expense</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Description *</label>
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Adobe Creative Cloud"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Amount ($) *</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      placeholder="99.99"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Date *</label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                </div>

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

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.recurring}
                    onChange={(e) => setFormData({ ...formData, recurring: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label className="text-sm font-medium">Recurring expense</label>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Notes</label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional details..."
                    rows={2}
                  />
                </div>

                <Button type="submit" className="w-full bg-lime-600 hover:bg-lime-700">
                  Add Expense
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Period Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { value: 'all', label: 'All Time' },
            { value: 'month', label: 'This Month' },
            { value: 'year', label: 'This Year' }
          ].map((period) => (
            <Button
              key={period.value}
              variant={selectedPeriod === period.value ? 'default' : 'outline'}
              onClick={() => setSelectedPeriod(period.value)}
              className={selectedPeriod === period.value ? 'bg-lime-600 hover:bg-lime-700' : ''}
            >
              {period.label}
            </Button>
          ))}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <Card className="bg-gradient-to-br from-red-50 to-red-100 p-6 border-red-200">
            <div className="flex items-center gap-3 mb-2">
              <TrendingDown className="w-5 h-5 text-red-600" />
              <span className="text-sm text-red-900 font-medium">Total Expenses</span>
            </div>
            <div className="text-3xl font-bold text-red-900">${totalExpenses.toLocaleString()}</div>
            <div className="text-sm text-red-700 mt-1">{filteredExpenses.length} transactions</div>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 border-amber-200">
            <div className="flex items-center gap-3 mb-2">
              <Receipt className="w-5 h-5 text-amber-600" />
              <span className="text-sm text-amber-900 font-medium">Recurring</span>
            </div>
            <div className="text-3xl font-bold text-amber-900">${totalRecurring.toLocaleString()}</div>
            <div className="text-sm text-amber-700 mt-1">{recurringExpenses.length} subscriptions</div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 border-purple-200">
            <div className="flex items-center gap-3 mb-2">
              <PieChart className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-purple-900 font-medium">Avg per Month</span>
            </div>
            <div className="text-3xl font-bold text-purple-900">
              ${selectedPeriod === 'year' 
                ? Math.round(totalExpenses / 12).toLocaleString() 
                : Math.round(totalExpenses).toLocaleString()}
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-slate-600" />
              <span className="text-sm text-slate-900 font-medium">Categories</span>
            </div>
            <div className="text-3xl font-bold text-slate-900">{Object.keys(categoryTotals).length}</div>
            <div className="text-sm text-slate-700 mt-1">expense types</div>
          </Card>
        </div>

        {/* Category Breakdown */}
        {sortedCategories.length > 0 && (
          <Card className="p-6 mb-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Top Categories</h3>
            <div className="space-y-4">
              {sortedCategories.map(([category, amount]) => {
                const percentage = (amount / totalExpenses) * 100;
                const colors = categoryColors[category];
                return (
                  <div key={category}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">{category}</span>
                      <span className="text-sm font-bold text-slate-900">${amount.toLocaleString()}</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${percentage}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className={`h-full ${colors.bg}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Expenses List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filteredExpenses.length === 0 ? (
          <div className="text-center py-16">
            <Receipt className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">No expenses tracked yet. Add your first expense!</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filteredExpenses.map((expense, i) => {
                const colors = categoryColors[expense.category];
                return (
                  <motion.div
                    key={expense.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.02 }}
                    className="group"
                  >
                    <Card className={`p-4 hover:shadow-md transition-all border-l-4`} style={{ borderLeftColor: colors.bg.replace('bg-', '#') }}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h3 className="font-semibold text-slate-900">{expense.description}</h3>
                            <Badge className={`${colors.light} ${colors.text} border-0`}>
                              {expense.category}
                            </Badge>
                            {expense.recurring && (
                              <Badge variant="outline" className="border-slate-300">
                                Recurring
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-slate-500 flex-wrap">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {format(new Date(expense.date), 'MMM d, yyyy')}
                            </div>
                            {expense.notes && (
                              <span className="truncate">{expense.notes}</span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="text-xl font-bold text-red-600 whitespace-nowrap">
                            ${expense.amount.toLocaleString()}
                          </span>
                          <button
                            onClick={() => deleteMutation.mutate(expense.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </div>
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