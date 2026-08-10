import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Menu, X, Mail, Phone, MapPin } from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

import RegisterModal from './RegisterModal';

const LandingLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/features' },
    
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500/30 flex flex-col">
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-white/40 backdrop-blur-xl border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" onClick={closeMobileMenu}>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black text-slate-900 tracking-tight">Zoox</span>
            </motion.div>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            {menuItems.map((item, i) => (
              <motion.div key={item.name} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Link
                  to={item.path}
                  className={`text-sm font-bold tracking-wide transition-colors ${
                    location.pathname === item.path 
                      ? 'text-blue-600' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:flex items-center gap-4"
          >
            <button 
              onClick={() => navigate('/login')}
              className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Log in
            </button>
            
          </motion.div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-600 hover:text-slate-900 focus:outline-none p-2"
            >
              {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden fixed top-20 left-0 w-full bg-slate-900 border-b border-white/10 z-40 overflow-hidden shadow-2xl"
          >
            <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={`block px-4 py-3 rounded-xl text-base font-bold transition-colors ${
                    location.pathname === item.path
                      ? 'bg-blue-500/10 text-cyan-400'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <div className="h-px bg-white/10 my-4 w-full"></div>
              <button 
                onClick={() => { closeMobileMenu(); navigate('/login'); }}
                className="w-full text-left px-4 py-3 rounded-xl text-base font-bold text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
              >
                Log in
              </button>
              <button 
                onClick={() => { closeMobileMenu(); navigate("/login"); }} className="w-full text-center px-4 py-4 mt-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-900 text-lg font-black hover:from-cyan-400 hover:to-blue-400 transition-all shadow-lg shadow-cyan-500/20">Log In</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Sections */}
      <main className="flex-grow">
        {React.cloneElement(children, { onOpenRegister: () => setRegisterModalOpen(true) })}
      </main>

      {/* Footer */}
      <footer className="relative bg-slate-950 text-slate-400 overflow-hidden pt-20 pb-10 border-t border-slate-900">
        {/* Footer Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            
            {/* Brand Column */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center">
                  <Layers className="w-5 h-5 text-slate-900" />
                </div>
                <span className="text-2xl font-black text-white tracking-tight">Zoox</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                The modern operating system for ambitious hoteliers. Streamline operations, boost revenue, and delight guests with our all-in-one platform.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-cyan-500 hover:text-slate-900 transition-colors font-bold text-xs">TW</a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-cyan-500 hover:text-slate-900 transition-colors font-bold text-xs">FB</a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-cyan-500 hover:text-slate-900 transition-colors font-bold text-xs">IG</a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-cyan-500 hover:text-slate-900 transition-colors font-bold text-xs">IN</a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-bold mb-6 tracking-wide">Product</h4>
              <ul className="space-y-3">
                {menuItems.map(item => (
                  <li key={item.name}>
                    <Link to={item.path} className="text-sm hover:text-cyan-400 transition-colors">{item.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-white font-bold mb-6 tracking-wide">Resources</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm hover:text-cyan-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="text-sm hover:text-cyan-400 transition-colors">API Documentation</a></li>
                <li><a href="#" className="text-sm hover:text-cyan-400 transition-colors">Community Forum</a></li>
                <li><a href="#" className="text-sm hover:text-cyan-400 transition-colors">Hotelier Blog</a></li>
                <li><a href="#" className="text-sm hover:text-cyan-400 transition-colors">Case Studies</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-bold mb-6 tracking-wide">Contact Us</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
                  <span className="text-sm">Plot No. 316, Rampur, Dumka Rampurhat Road,<br/>Dumka - 814119, Jharkhand</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-cyan-500 shrink-0" />
                  <span className="text-sm">+91 62993 82018</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-cyan-500 shrink-0" />
                  <span className="text-sm">info@grandportico.in</span>
                </li>
              </ul>
            </div>

          </div>
          
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} Zoox. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>


    </div>
  );
};

export default LandingLayout;


