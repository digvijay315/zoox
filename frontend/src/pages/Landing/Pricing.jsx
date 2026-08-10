import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Plus, Minus } from 'lucide-react';

const Pricing = ({ onOpenRegister }) => {
  const [openFaq, setOpenFaq] = useState(0);

  const plans = [
    {
      name: "Free Tier",
      desc: "Perfect for small boutique hotels & guesthouses.",
      price: "Free",
      period: "/month",
      features: [
        "Up to 20 Rooms",
        "Basic POS & Billing",
        "Standard Analytics",
        "Email Support",
        "2 Staff Accounts"
      ],
      popular: false
    },
    {
      name: "Professional",
      desc: "Ideal for mid-sized hotels with a restaurant.",
      price: "₹1,499",
      period: "/month",
      features: [
        "Up to 100 Rooms",
        "Advanced POS & KOT",
        "Advanced Analytics & Reports",
        "Priority 24/7 Support",
        "Unlimited Staff Accounts",
        "GST Invoicing"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      desc: "For large hotel chains and luxury resorts.",
      price: "Custom",
      period: "",
      features: [
        "Unlimited Rooms",
        "Multi-Property Management",
        "Custom API Integrations",
        "Dedicated Account Manager",
        "Custom Feature Requests",
        "On-premise Deployment Option"
      ],
      popular: false
    }
  ];

  const faqs = [
    { q: "Is there a free trial available?", a: "Yes, we offer a 14-day free trial on all plans. No credit card required." },
    { q: "Can I upgrade or downgrade my plan later?", a: "Absolutely. You can change your plan at any time from your admin dashboard. Pro-rated charges will apply." },
    { q: "What kind of support do you offer?", a: "Starter plans get email support (24h response). Professional and Enterprise plans get priority 24/7 phone and chat support." },
    { q: "Do you charge setup fees?", a: "No, there are no hidden setup fees. You only pay the monthly subscription price." }
  ];

  return (
    <div className="bg-slate-50 relative overflow-hidden pt-32 pb-24">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-300/20 rounded-full blur-[120px] pointer-events-none mix-blend-multiply"></div>
      
      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        <div className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black mb-6 text-slate-900 tracking-tight"
          >
            Simple, transparent pricing
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-600 max-w-xl mx-auto text-xl font-medium"
          >
            No hidden fees. No surprise charges. Just powerful software to grow your business.
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 items-center max-w-6xl mx-auto mb-32">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className={`relative p-8 rounded-3xl ${
                plan.popular 
                  ? 'bg-gradient-to-b from-blue-600 to-indigo-700 border-none shadow-2xl shadow-blue-600/30 md:-translate-y-4 text-white transform hover:scale-105' 
                  : 'bg-white/80 backdrop-blur-md border border-slate-200 shadow-xl shadow-slate-200/50 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-500/10 text-slate-900'
              } transition-all duration-300`}
            >
              {plan.popular && (
                <div className="absolute top-0 inset-x-0 transform -translate-y-1/2 flex justify-center">
                  <span className="bg-gradient-to-r from-amber-400 to-orange-400 text-amber-950 text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-amber-400/20">
                    Most Popular
                  </span>
                </div>
              )}
              
              <h3 className={`text-2xl font-black mb-2 ${plan.popular ? 'text-white' : 'text-slate-900'}`}>{plan.name}</h3>
              <p className={`text-sm mb-8 h-10 font-medium ${plan.popular ? 'text-blue-100' : 'text-slate-500'}`}>{plan.desc}</p>
              
              <div className="mb-8 flex items-baseline gap-1">
                <span className={`text-5xl font-black tracking-tight ${plan.popular ? 'text-white' : 'text-slate-900'}`}>{plan.price}</span>
                <span className={`font-semibold ${plan.popular ? 'text-blue-200' : 'text-slate-500'}`}>{plan.period}</span>
              </div>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <Check className={`w-5 h-5 shrink-0 ${plan.popular ? 'text-amber-400' : 'text-blue-600'}`} />
                    <span className={`text-sm font-medium ${plan.popular ? 'text-blue-50' : 'text-slate-700'}`}>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button 
                onClick={onOpenRegister}
                className={`w-full py-4 rounded-xl font-bold transition-all duration-300 ${
                  plan.popular 
                    ? 'bg-white hover:bg-slate-50 text-blue-700 shadow-xl' 
                    : 'bg-blue-50 hover:bg-blue-100 text-blue-700'
                }`}
              >
                Get Started
              </button>
            </motion.div>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <div className="max-w-5xl mx-auto mb-32">
          <h2 className="text-3xl font-black text-center mb-12 text-slate-900">Compare Plans</h2>
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-6 font-bold text-slate-900">Features</th>
                  <th className="p-6 font-bold text-slate-900 text-center">Starter</th>
                  <th className="p-6 font-bold text-blue-600 text-center bg-blue-50/50">Professional</th>
                  <th className="p-6 font-bold text-slate-900 text-center">Enterprise</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  { name: "Max Rooms", s: "20", p: "100", e: "Unlimited" },
                  { name: "Staff Accounts", s: "2", p: "Unlimited", e: "Unlimited" },
                  { name: "Front Desk POS", s: true, p: true, e: true },
                  { name: "Restaurant KOT", s: false, p: true, e: true },
                  { name: "GST Invoicing", s: false, p: true, e: true },
                  { name: "Custom API", s: false, p: false, e: true },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="p-6 font-medium text-slate-700">{row.name}</td>
                    <td className="p-6 text-center text-slate-600">
                      {typeof row.s === 'boolean' ? (row.s ? <Check className="w-5 h-5 text-emerald-500 mx-auto" /> : <X className="w-5 h-5 text-slate-300 mx-auto" />) : row.s}
                    </td>
                    <td className="p-6 text-center font-semibold text-blue-700 bg-blue-50/20">
                      {typeof row.p === 'boolean' ? (row.p ? <Check className="w-5 h-5 text-blue-600 mx-auto" /> : <X className="w-5 h-5 text-slate-300 mx-auto" />) : row.p}
                    </td>
                    <td className="p-6 text-center text-slate-600">
                      {typeof row.e === 'boolean' ? (row.e ? <Check className="w-5 h-5 text-emerald-500 mx-auto" /> : <X className="w-5 h-5 text-slate-300 mx-auto" />) : row.e}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12 text-slate-900">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                <button 
                  className="w-full p-6 text-left flex justify-between items-center focus:outline-none"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-bold text-slate-900">{faq.q}</span>
                  {openFaq === i ? <Minus className="w-5 h-5 text-blue-600 shrink-0" /> : <Plus className="w-5 h-5 text-slate-400 shrink-0" />}
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 pb-6 text-slate-600 font-medium leading-relaxed"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Pricing;
