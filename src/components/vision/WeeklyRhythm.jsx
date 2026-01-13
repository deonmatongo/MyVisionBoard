import React from 'react';
import { motion } from 'framer-motion';
import { Send, Code, FileText, BookOpen, BarChart3 } from 'lucide-react';

export default function WeeklyRhythm() {
  const days = [
    {
      day: 'Monday',
      icon: Send,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50',
      tasks: ['Sales outreach', 'Follow-ups', 'New leads']
    },
    {
      day: 'Tue–Wed',
      icon: Code,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50',
      tasks: ['Client work', 'Deep focus', 'Building']
    },
    {
      day: 'Thursday',
      icon: FileText,
      color: 'bg-pink-500',
      lightColor: 'bg-pink-50',
      tasks: ['Content updates', 'Portfolio', 'Case studies']
    },
    {
      day: 'Friday',
      icon: BookOpen,
      color: 'bg-amber-500',
      lightColor: 'bg-amber-50',
      tasks: ['Learning', 'System improvements', 'Review metrics']
    }
  ];

  return (
    <section className="px-6 py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-lime-600 font-medium text-sm uppercase tracking-widest">Weekly Operating Rhythm</span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mt-3">Structured success</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {days.map((day, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="relative"
            >
              <div className={`${day.lightColor} rounded-3xl p-6 border border-white shadow-sm hover:shadow-xl transition-all duration-300 h-full`}>
                <div className={`${day.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-5`}>
                  <day.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{day.day}</h3>
                <ul className="space-y-2">
                  {day.tasks.map((task, j) => (
                    <li key={j} className="flex items-center gap-2 text-slate-600 text-sm">
                      <div className={`w-1.5 h-1.5 rounded-full ${day.color}`} />
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Metrics Callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-12 flex items-center justify-center gap-4 text-slate-500"
        >
          <BarChart3 className="w-5 h-5" />
          <span>Review pipeline & metrics every Friday</span>
        </motion.div>
      </div>
    </section>
  );
}