import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowDown } from 'lucide-react';

export default function VisionHero({ progressData }) {
  const yearOneProgress = progressData?.current_revenue 
    ? Math.round((progressData.current_revenue / 100000) * 100)
    : 0;
  const retainerPercentage = progressData?.retainer_clients && progressData?.active_clients
    ? Math.round((progressData.retainer_clients / progressData.active_clients) * 100)
    : 0;
  return (
    <section className="min-h-screen flex flex-col justify-center items-center px-6 py-20 relative">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-4xl"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-slate-200 mb-8 shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-lime-500" />
          <span className="text-sm font-medium text-slate-600">Vision Board 2025</span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight leading-tight mb-6"
        >
          Decar
          <span className="relative inline-block ml-3">
            Solutions
            <motion.div
              className="absolute -bottom-2 left-0 right-0 h-3 bg-lime-400/40 -z-10 rounded"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            />
          </span>
        </motion.h1>

        {/* Vision Statement */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-xl md:text-2xl text-slate-600 leading-relaxed max-w-3xl mx-auto mb-12"
        >
          Transforming outdated websites into modern, high-performing digital experiences that drive{' '}
          <span className="text-slate-900 font-semibold">credibility</span>,{' '}
          <span className="text-slate-900 font-semibold">growth</span>, and{' '}
          <span className="text-slate-900 font-semibold">results</span>.
        </motion.p>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-2xl mx-auto"
        >
          {[
            { value: '$800K+', label: '3-Year Revenue Goal', sublabel: null },
            { value: `${yearOneProgress}%`, label: 'Year 1 Progress', sublabel: `$${progressData?.current_revenue?.toLocaleString() || 0} / $100K` },
            { value: `${retainerPercentage}%`, label: 'Retainer Rate', sublabel: progressData ? `${progressData.retainer_clients || 0} of ${progressData.active_clients || 0} clients` : null }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-slate-900">{stat.value}</div>
              <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
              {stat.sublabel && (
                <div className="text-xs text-slate-400 mt-0.5">{stat.sublabel}</div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute bottom-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-slate-400"
        >
          <span className="text-xs uppercase tracking-widest">Explore</span>
          <ArrowDown className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}