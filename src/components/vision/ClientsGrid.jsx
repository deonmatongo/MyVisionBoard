import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Rocket, Palette, Heart, Zap } from 'lucide-react';

export default function ClientsGrid() {
  const clients = [
    {
      icon: Building2,
      title: 'Local Businesses',
      description: 'Without modern websites',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      icon: Rocket,
      title: 'Startups',
      description: 'Launching or rebranding',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      icon: Palette,
      title: 'Creators',
      description: 'Monetizing audiences',
      gradient: 'from-pink-500 to-pink-600'
    },
    {
      icon: Heart,
      title: 'Nonprofits',
      description: 'Needing credibility & donations',
      gradient: 'from-rose-500 to-rose-600'
    },
    {
      icon: Zap,
      title: 'Fast Founders',
      description: 'Who value speed and results',
      gradient: 'from-amber-500 to-amber-600'
    }
  ];

  return (
    <section className="px-6 py-24 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-lime-600 font-medium text-sm uppercase tracking-widest">Ideal Clients</span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mt-3">Who we serve</h2>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4">
          {clients.map((client, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              className="group relative"
            >
              <div className="bg-slate-50 hover:bg-white rounded-2xl p-6 border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 w-56">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${client.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <client.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">{client.title}</h3>
                <p className="text-slate-500 text-sm">{client.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}