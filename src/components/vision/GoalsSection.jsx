import React from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, Users, Shield } from 'lucide-react';

export default function GoalsSection() {
  const goals = [
    {
      icon: TrendingUp,
      title: 'Revenue',
      value: '$800,000+',
      subtitle: 'annually',
      color: 'bg-lime-500',
      lightColor: 'bg-lime-50'
    },
    {
      icon: Target,
      title: 'Position',
      value: 'Trusted Partner',
      subtitle: 'for ambitious organizations',
      color: 'bg-amber-500',
      lightColor: 'bg-amber-50'
    },
    {
      icon: Users,
      title: 'Work Style',
      value: 'Selective',
      subtitle: 'strong retainers, predictable income',
      color: 'bg-slate-700',
      lightColor: 'bg-slate-50'
    },
    {
      icon: Shield,
      title: 'Reputation',
      value: 'Excellence',
      subtitle: 'quality design + functionality + speed',
      color: 'bg-emerald-500',
      lightColor: 'bg-emerald-50'
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
        <span className="text-lime-600 font-medium text-sm uppercase tracking-widest">3-Year Vision</span>
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mt-3">Where we're headed</h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((goal, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className={`${goal.lightColor} rounded-3xl p-8 border border-white/50 shadow-sm hover:shadow-lg transition-all duration-300`}
          >
            <div className={`${goal.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-6`}>
              <goal.icon className="w-6 h-6 text-white" />
            </div>
            <div className="text-sm text-slate-500 uppercase tracking-wider mb-2">{goal.title}</div>
            <div className="text-3xl font-bold text-slate-900 mb-1">{goal.value}</div>
            <div className="text-slate-600">{goal.subtitle}</div>
          </motion.div>
        ))}
      </div>

      {/* Positioning Line */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-16 text-center"
      >
        <div className="inline-block bg-white rounded-2xl px-8 py-6 shadow-sm border border-slate-100">
          <p className="text-lg md:text-xl text-slate-700 italic">
            "I help growing businesses upgrade outdated websites into{' '}
            <span className="text-slate-900 font-semibold not-italic">modern, high-performing platforms</span>{' '}
            that actually convert."
          </p>
        </div>
      </motion.div>
    </section>
  );
}