import React from 'react';
import { motion } from 'framer-motion';
import { Building2, ChefHat, Receipt, Users, Shield, Zap, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Features = () => {
  const quickFeatures = [
    { icon: <Building2 className="w-6 h-6" />, title: 'Room Management' },
    { icon: <ChefHat className="w-6 h-6" />, title: 'Restaurant POS (KOT)' },
    { icon: <Receipt className="w-6 h-6" />, title: 'Smart Billing' },
    { icon: <Users className="w-6 h-6" />, title: 'Staff Access' },
    { icon: <Shield className="w-6 h-6" />, title: 'Enterprise Security' },
    { icon: <Zap className="w-6 h-6" />, title: 'Live Analytics' }
  ];

  return (
    <div className="bg-slate-50 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-blue-400/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply"></div>
      <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-indigo-400/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply"></div>

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-5 py-2 rounded-full border border-blue-200 bg-white/80 backdrop-blur-sm text-blue-700 text-sm font-bold mb-8 shadow-sm"
          >
            A Complete Ecosystem
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 text-slate-900 tracking-tight leading-tight"
          >
            Everything you need. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Nothing you don't.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium"
          >
            We've meticulously crafted every feature to eliminate friction, reduce manual errors, and give you complete control over your hotel operations.
          </motion.p>
        </div>
      </section>

      {/* Quick Grid */}
      <section className="pb-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickFeatures.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + (i * 0.1) }}
                className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center gap-3 hover:border-blue-300 hover:shadow-lg transition-all group cursor-default"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {f.icon}
                </div>
                <span className="font-bold text-slate-800 text-sm">{f.title}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Deep Dive Sections */}
      <section className="py-24 relative z-10 bg-white">
        <div className="max-w-7xl mx-auto px-6 space-y-32">
          
          {/* Feature 1: Front Desk */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
            >
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                <Building2 className="w-8 h-8" />
              </div>
              <h2 className="text-4xl font-black text-slate-900 mb-6 leading-tight">Master your <br/>Front Desk operations.</h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Say goodbye to double bookings and chaotic check-ins. Our intuitive timeline view gives you absolute visibility over your property's status in real-time.
              </p>
              <ul className="space-y-4">
                {['Drag & drop room assignments', 'One-click check-in & check-out', 'Automated guest folios', 'Digital Guest Registration Cards (GRC)'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full"></div>
              <img src="/images/dashboard.png" alt="Front Desk Dashboard" className="relative rounded-3xl shadow-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition-transform duration-500" />
            </motion.div>
          </div>

          {/* Feature 2: POS */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className="relative order-2 lg:order-1"
            >
              <div className="absolute inset-0 bg-fuchsia-500/10 blur-3xl rounded-full"></div>
              <img src="/images/pos.png" alt="Restaurant POS" className="relative rounded-3xl shadow-2xl border-4 border-white transform -rotate-2 hover:rotate-0 transition-transform duration-500" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className="order-1 lg:order-2"
            >
              <div className="w-16 h-16 bg-fuchsia-100 rounded-2xl flex items-center justify-center text-fuchsia-600 mb-6">
                <ChefHat className="w-8 h-8" />
              </div>
              <h2 className="text-4xl font-black text-slate-900 mb-6 leading-tight">Lightning-fast <br/>Restaurant POS.</h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Connect your restaurant directly to guest rooms. Send orders to the kitchen instantly, manage tables visually, and route bills to room folios with zero friction.
              </p>
              <ul className="space-y-4">
                {['Visual table management layout', 'Instant Kitchen Order Tickets (KOT)', 'Direct room folio billing', 'Inventory & recipe management'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/30 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-fuchsia-600/30 blur-[100px] rounded-full"></div>
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-8">Ready to transform your property?</h2>
          <p className="text-xl text-slate-300 mb-10">Join thousands of hoteliers who have already upgraded their operations.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/pricing" className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg transition-all shadow-lg shadow-blue-600/20">
              View Pricing Plans
            </Link>
            <button className="px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-lg transition-all backdrop-blur-sm border border-white/10">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Features;
