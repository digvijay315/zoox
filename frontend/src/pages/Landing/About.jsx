import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Globe2, Sparkles, Target, Award, Users, Zap, Shield } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-white relative overflow-hidden">
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 relative z-10 min-h-[70vh] flex flex-col justify-center items-center text-center px-6">
        <div className="absolute inset-0 bg-blue-900/5"></div>
        <div className="absolute inset-0">
          <img src="/images/hotel.png" alt="Luxury Hotel Interior" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/80 to-white"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-5 py-2 rounded-full border border-blue-200 bg-white/80 backdrop-blur-sm text-blue-700 text-sm font-bold mb-8 shadow-sm"
          >
            Our Story
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black mb-8 text-slate-900 tracking-tight leading-tight"
          >
            Reimagining the future of <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">hospitality.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-700 max-w-3xl mx-auto leading-relaxed font-medium"
          >
            Secure Billing Pro was founded on a simple premise: hoteliers should spend their time taking care of guests, not wrestling with clunky software.
          </motion.p>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-slate-50 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4">Our Core Values</h2>
            <p className="text-lg text-slate-600">The principles that guide everything we build.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <Heart className="w-6 h-6" />, title: 'Built with Empathy', desc: 'We listen to our users. Every feature is designed to solve a real pain point experienced by hotel staff on the ground.' },
              { icon: <Zap className="w-6 h-6" />, title: 'Relentless Speed', desc: 'In a busy hotel lobby, every second counts. We engineer our systems to be lightning fast and incredibly responsive.' },
              { icon: <Shield className="w-6 h-6" />, title: 'Uncompromising Security', desc: 'Guest data is sacred. We utilize enterprise-grade encryption and strict access controls to keep your data safe.' },
              { icon: <Globe2 className="w-6 h-6" />, title: 'Global Standard', desc: 'From boutique guesthouses to international resorts, we build tools that scale with your ambitions.' },
              { icon: <Users className="w-6 h-6" />, title: 'Community Driven', desc: 'We actively collaborate with a community of hospitality experts to shape the future of our product roadmap.' },
              { icon: <Award className="w-6 h-6" />, title: 'Excellence in Design', desc: 'Enterprise software doesn\'t have to be ugly. We believe beautiful design leads to faster training and happier staff.' }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/40 hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-blue-600 mb-6 border border-blue-100">
                  {item.icon}
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h4>
                <p className="text-slate-600 leading-relaxed font-medium">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Journey */}
      <section className="py-32 bg-white relative z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-50 rounded-full blur-3xl -z-10"></div>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-12">The Secure Billing Pro Journey</h2>
          <div className="space-y-12">
            {[
              { year: '2023', title: 'The Lightbulb Moment', desc: 'After witnessing the chaos of a busy hotel lobby using outdated systems, our founders set out to build a modern alternative.' },
              { year: '2024', title: 'The First Property', desc: 'Secure Billing Pro v1.0 was deployed at a 50-room boutique hotel, completely transforming their front desk operations.' },
              { year: '2025', title: 'Scaling Up', desc: 'We introduced the Restaurant POS module and scaled to over 1,000 properties nationwide.' },
              { year: '2026', title: 'The Future', desc: 'Today, Secure Billing Pro is the operating system for thousands of modern hoteliers globally, and we are just getting started.' }
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="bg-white/60 backdrop-blur-md border border-slate-200 p-8 rounded-3xl shadow-xl shadow-slate-200/50 flex flex-col md:flex-row items-center gap-8 text-left"
              >
                <div className="text-4xl font-black text-blue-600 md:w-32 shrink-0">{step.year}</div>
                <div>
                  <h4 className="text-2xl font-bold text-slate-900 mb-2">{step.title}</h4>
                  <p className="text-slate-600 text-lg leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
