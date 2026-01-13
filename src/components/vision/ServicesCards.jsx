import React from 'react';
import { motion } from 'framer-motion';
import { Globe, AppWindow, ShoppingCart, RefreshCw, Search, Wrench, Star } from 'lucide-react';

export default function ServicesCards() {
  const services = [
    { icon: Globe, title: 'Custom Websites', primary: true },
    { icon: AppWindow, title: 'Web Applications', primary: false },
    { icon: ShoppingCart, title: 'E-commerce Solutions', primary: false },
    { icon: RefreshCw, title: 'Website Redesigns', primary: false },
    { icon: Search, title: 'SEO & Performance', primary: false },
    { icon: Wrench, title: 'Maintenance & Hosting', primary: false }
  ];

  const advantages = [
    'Modern design + strong functionality',
    'Speed without sacrificing quality',
    'One developer, clear communication',
    'End-to-end delivery'
  ];

  return (
    <section className="px-6 py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-lime-400 font-medium text-sm uppercase tracking-widest">Core Services</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3">What we build</h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4 mb-16">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className={`rounded-2xl p-6 border transition-all duration-300 ${
                service.primary 
                  ? 'bg-lime-500 border-lime-400 shadow-lg shadow-lime-500/20' 
                  : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
              }`}
            >
              <service.icon className={`w-8 h-8 mb-4 ${service.primary ? 'text-slate-900' : 'text-lime-400'}`} />
              <h3 className={`text-lg font-semibold ${service.primary ? 'text-slate-900' : 'text-white'}`}>
                {service.title}
              </h3>
              {service.primary && (
                <span className="inline-flex items-center gap-1 mt-2 text-sm text-slate-800">
                  <Star className="w-3 h-3" /> Primary Focus
                </span>
              )}
            </motion.div>
          ))}
        </div>

        {/* Tech Advantage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-slate-800/50 rounded-3xl p-8 md:p-10 border border-slate-700"
        >
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h3 className="text-2xl font-bold mb-4">Tech Advantage</h3>
              <p className="text-slate-400 leading-relaxed">
                Using <span className="text-white font-medium">Base44</span> for rapid, high-quality frontend development 
                combined with custom backend solutions for scalability.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">Differentiation</h3>
              <ul className="space-y-3">
                {advantages.map((adv, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
                    className="flex items-center gap-3 text-slate-300"
                  >
                    <div className="w-2 h-2 rounded-full bg-lime-400" />
                    {adv}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}