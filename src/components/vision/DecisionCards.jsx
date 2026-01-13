import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, ThumbsUp, ThumbsDown } from 'lucide-react';

export default function DecisionCards() {
  const yesItems = [
    'Projects aligned with modern websites & redesigns',
    'Clients who value speed and quality',
    'Retainers & recurring revenue',
    'Clear scopes & budgets'
  ];

  const noItems = [
    'Low-budget, high-effort projects',
    'Clients without decision power',
    'Custom features that don\'t scale',
    'Projects with unclear goals'
  ];

  return (
    <section className="px-6 py-24 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <span className="text-lime-600 font-medium text-sm uppercase tracking-widest">Decision Framework</span>
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mt-3">Clear boundaries</h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Say YES */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-emerald-50 to-lime-50 rounded-3xl p-8 border-2 border-emerald-200"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-emerald-500 w-12 h-12 rounded-2xl flex items-center justify-center">
              <ThumbsUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-emerald-700">Say YES To</h3>
          </div>

          <ul className="space-y-4">
            {yesItems.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.1, duration: 0.4 }}
                className="flex items-start gap-3"
              >
                <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700">{item}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Say NO */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-red-50 to-rose-50 rounded-3xl p-8 border-2 border-red-200"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-red-500 w-12 h-12 rounded-2xl flex items-center justify-center">
              <ThumbsDown className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-red-700">Say NO To</h3>
          </div>

          <ul className="space-y-4">
            {noItems.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.1, duration: 0.4 }}
                className="flex items-start gap-3"
              >
                <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700">{item}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}