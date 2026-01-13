import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Eye, Repeat, Award, Target } from 'lucide-react';

export default function DailyReminder() {
  const mantras = [
    { icon: Eye, text: 'Visibility creates opportunity' },
    { icon: Repeat, text: 'Consistency beats perfection' },
    { icon: Award, text: 'Every project is a marketing asset' }
  ];

  return (
    <section className="px-4 sm:px-6 py-16 sm:py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-lime-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-56 h-56 sm:w-80 sm:h-80 bg-amber-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 sm:mb-8">
            <Sparkles className="w-4 h-4 text-lime-400" />
            <span className="text-xs sm:text-sm font-medium text-slate-300">Daily Reminder</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-12">Stay focused</h2>
        </motion.div>

        <div className="space-y-4 sm:space-y-6 mb-12 sm:mb-16">
          {mantras.map((mantra, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.5 }}
              className="flex items-center justify-center gap-3 sm:gap-4"
            >
              <mantra.icon className="w-5 h-5 sm:w-6 sm:h-6 text-lime-400 flex-shrink-0" />
              <span className="text-base sm:text-xl md:text-2xl text-slate-200">{mantra.text}</span>
            </motion.div>
          ))}
        </div>

        {/* Core Focus */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="bg-gradient-to-r from-lime-500/20 via-lime-500/10 to-lime-500/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border border-lime-500/30"
        >
          <Target className="w-8 h-8 sm:w-10 sm:h-10 text-lime-400 mx-auto mb-4 sm:mb-6" />
          <p className="text-lg sm:text-2xl md:text-3xl font-semibold leading-relaxed">
            Build modern websites{' '}
            <span className="text-lime-400">→</span>{' '}
            Build trust{' '}
            <span className="text-lime-400">→</span>{' '}
            Build predictable income
          </p>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-12 sm:mt-16 text-slate-500 text-xs sm:text-sm"
        >
          © {new Date().getFullYear()} Decar Solutions — Building the future, one website at a time.
        </motion.p>
      </div>
    </section>
  );
}