import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
// TODO: Replace with MongoDB API calls
import { ChevronRight, Check, Target, Trophy } from 'lucide-react';

export default function QuarterlyRoadmap({ progressData }) {
  const [activeQuarter, setActiveQuarter] = useState(0);
  const queryClient = useQueryClient();

  const toggleTaskMutation = useMutation({
    mutationFn: async ({ quarter, taskIndex }) => {
      const currentProgress = progressData?.quarter_progress || { Q1: [], Q2: [], Q3: [], Q4: [] };
      const quarterKey = quarters[quarter].id;
      const quarterProgress = [...(currentProgress[quarterKey] || [])];
      
      // Ensure array is long enough
      while (quarterProgress.length <= taskIndex) {
        quarterProgress.push(false);
      }
      
      quarterProgress[taskIndex] = !quarterProgress[taskIndex];
      currentProgress[quarterKey] = quarterProgress;
      
      // TODO: Replace with MongoDB API call
      return Promise.resolve({ quarter_progress: currentProgress });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['visionProgress']);
    }
  });

  const getTaskCompletion = (quarterIndex, taskIndex) => {
    const quarterKey = quarters[quarterIndex].id;
    return progressData?.quarter_progress?.[quarterKey]?.[taskIndex] || false;
  };

  const quarters = [
    {
      id: 'Q1',
      title: 'Foundation & Visibility',
      color: 'bg-blue-500',
      tasks: [
        'Finalize service packages & pricing',
        'Create strong personal/brand website',
        'Build outreach system (cold email, DMs, local)',
        'Publish 5–10 portfolio pieces'
      ]
    },
    {
      id: 'Q2',
      title: 'Client Acquisition & Proof',
      color: 'bg-purple-500',
      tasks: [
        'Close consistent one-off projects',
        'Collect testimonials & case studies',
        'Introduce maintenance/SEO retainers',
        'Raise prices slightly'
      ]
    },
    {
      id: 'Q3',
      title: 'Retainers & Scale',
      color: 'bg-lime-500',
      highlight: true,
      tasks: [
        'Focus on $2k–$5k projects',
        'Convert 30–40% clients to retainers',
        'Hit $100,000 revenue milestone',
        'Establish predictable income'
      ]
    },
    {
      id: 'Q4',
      title: 'Productized Services',
      color: 'bg-amber-500',
      tasks: [
        'Define repeatable website packages',
        'Reduce custom complexity',
        'Plan templates/tools for next year',
        'Systematize operations'
      ]
    }
  ];

  return (
    <section className="px-6 py-24 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-16"
      >
        <span className="text-lime-600 font-medium text-sm uppercase tracking-widest">12-Month Plan</span>
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mt-3">Quarterly focus</h2>
      </motion.div>

      {/* Quarter Selector */}
      <div className="flex flex-wrap gap-3 mb-10">
        {quarters.map((q, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            onClick={() => setActiveQuarter(i)}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              activeQuarter === i
                ? `${q.color} text-white shadow-lg`
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span className="flex items-center gap-2">
              {q.id}
              {q.highlight && <Trophy className="w-4 h-4" />}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Active Quarter Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeQuarter}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`rounded-3xl p-8 md:p-10 ${
            quarters[activeQuarter].highlight 
              ? 'bg-gradient-to-br from-lime-50 to-emerald-50 border-2 border-lime-200' 
              : 'bg-white border border-slate-200'
          } shadow-sm`}
        >
          <div className="flex items-start gap-4 mb-8">
            <div className={`${quarters[activeQuarter].color} w-14 h-14 rounded-2xl flex items-center justify-center`}>
              <Target className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">{quarters[activeQuarter].title}</h3>
              <p className="text-slate-500">{quarters[activeQuarter].id} Focus Area</p>
            </div>
            {quarters[activeQuarter].highlight && (
              <div className="ml-auto bg-lime-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                $100K Target
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {quarters[activeQuarter].tasks.map((task, i) => {
              const isCompleted = getTaskCompletion(activeQuarter, i);
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.3 }}
                  onClick={() => toggleTaskMutation.mutate({ quarter: activeQuarter, taskIndex: i })}
                  className={`flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all ${
                    isCompleted 
                      ? 'bg-lime-50 border-2 border-lime-200' 
                      : 'bg-slate-50/80 hover:bg-slate-100 border-2 border-transparent'
                  }`}
                >
                  <div className={`${isCompleted ? 'bg-lime-500' : quarters[activeQuarter].color} w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors`}>
                    <Check className={`w-4 h-4 text-white transition-opacity ${isCompleted ? 'opacity-100' : 'opacity-40'}`} />
                  </div>
                  <span className={`${isCompleted ? 'text-slate-900 font-medium' : 'text-slate-700'} transition-all`}>
                    {task}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress Line */}
      <div className="mt-10 flex items-center gap-2">
        {quarters.map((_, i) => (
          <React.Fragment key={i}>
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.3 }}
              className={`w-4 h-4 rounded-full ${i <= activeQuarter ? quarters[i].color : 'bg-slate-200'} transition-colors duration-300`}
            />
            {i < quarters.length - 1 && (
              <div className={`flex-1 h-1 rounded ${i < activeQuarter ? quarters[i].color : 'bg-slate-200'} transition-colors duration-300`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}