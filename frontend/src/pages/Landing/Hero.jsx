import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, PlayCircle, Layers, TrendingUp, Users, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = ({ onOpenRegister }) => {
  return (
    <div className="relative overflow-hidden bg-white text-slate-900 font-sans">
      {/* Animated Background Gradients */}
      <motion.div 
        animate={{ 
          x: [0, 50, 0], 
          y: [0, 30, 0],
          scale: [1, 1.1, 1] 
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-fuchsia-300/40 rounded-full blur-[100px] pointer-events-none mix-blend-multiply"
      />
      <motion.div 
        animate={{ 
          x: [0, -40, 0], 
          y: [0, 50, 0],
          scale: [1, 1.2, 1] 
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-blue-300/40 rounded-full blur-[100px] pointer-events-none mix-blend-multiply"
      />
      <motion.div 
        animate={{ 
          x: [0, 30, 0], 
          y: [0, -30, 0],
          scale: [1, 1.1, 1] 
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[20%] left-[20%] w-[60%] h-[40%] bg-indigo-300/40 rounded-full blur-[100px] pointer-events-none mix-blend-multiply"
      />

      {/* Main Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto mb-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-8"
            >
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
              </span>
              <span className="text-sm font-bold text-slate-800 tracking-wide uppercase">Welcome to Zoox</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.1, ease: "easeOut" }}
              className="text-5xl md:text-7xl lg:text-[5.5rem] font-display font-black tracking-tight mb-8 leading-[1.1] text-slate-900"
            >
              The intelligent OS for <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600">
                modern hoteliers.
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
              className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed font-medium"
            >
              Unify your front desk, restaurant POS, and billing operations into one beautiful, lightning-fast platform designed to delight your guests and empower your staff.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/login" className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg flex items-center justify-center gap-3 transition-all transform hover:scale-105 shadow-xl shadow-blue-900/20">Log In <ArrowRight className="w-6 h-6" /></Link>
              <button className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-3 group backdrop-blur-md">
                <PlayCircle className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" /> Watch Demo
              </button>
            </motion.div>
          </div>

          {/* Floating Hero Mockup Collage */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.7, ease: "easeOut" }}
            className="relative max-w-6xl mx-auto perspective-1000 mt-16"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 h-[110%] w-full pointer-events-none -bottom-[10%]"></div>
            
            <div 
              className="relative w-full h-[600px] flex justify-center items-center transform rotateX-12 mt-12"
              style={{ perspective: '1200px' }}
            >
              {[
                "/images/dashboard_mockup_1784785381185.png",
                "/images/hotel_pos_1784785448234.png",
                "/images/dashboard.png",
                "/images/hotel_interior_1784785414856.png",
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
              ].map((src, index) => {
                const positions = [
                  { x: -400, y: -160, rotate: -12, scale: 1, z: 10 },
                  { x: -360, y: 180, rotate: -6, scale: 1, z: 20 },
                  { x: 0, y: 0, rotate: 0, scale: 1.1, z: 30 },
                  { x: 360, y: 180, rotate: 6, scale: 1, z: 40 },
                  { x: 400, y: -160, rotate: 12, scale: 1, z: 50 },
                ];
                
                // Shift array so each image cycles through all positions
                const shiftedPositions = [...positions.slice(index), ...positions.slice(0, index)];
                
                const animFrames = [];
                const times = [];
                const centerPos = { x: 0, y: 0, rotate: 0, scale: 1, z: 100 }; // Center stack position
                
                shiftedPositions.forEach((pos, i) => {
                  const baseTime = i * 0.2; 
                  
                  animFrames.push(centerPos); // Hold at center
                  times.push(baseTime + 0.0);
                  
                  animFrames.push(centerPos); // Start leaving center
                  times.push(baseTime + 0.02);
                  
                  animFrames.push(pos);       // Arrive at fanned out position
                  times.push(baseTime + 0.08);
                  
                  animFrames.push(pos);       // Hold fanned out position
                  times.push(baseTime + 0.16);
                });
                
                // Return to center to perfectly close the infinite loop
                animFrames.push(centerPos);
                times.push(1.0);
                
                return (
                  <motion.img 
                    key={index}
                    src={src}
                    alt={`Mockup ${index + 1}`}
                    className="absolute w-[280px] sm:w-[350px] md:w-[450px] object-cover rounded-2xl md:rounded-[2rem] shadow-[0_30px_60px_rgba(8,_112,_184,_0.3)] border-[4px] md:border-[8px] border-white/80 bg-white/60 backdrop-blur-md aspect-video"
                    animate={{ 
                      x: animFrames.map(p => p.x), 
                      y: animFrames.map(p => p.y), 
                      rotateZ: animFrames.map(p => p.rotate),
                      scale: animFrames.map(p => p.scale),
                      zIndex: animFrames.map(p => p.z)
                    }}
                    transition={{ 
                      duration: 25, // 5 seconds per full scatter cycle
                      repeat: Infinity, 
                      ease: "easeInOut",
                      times: times
                    }}
                  />
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Animated Trusted By Marquee */}
      <section className="py-12 border-y border-slate-100 bg-slate-50/80 backdrop-blur-xl relative z-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-10">
          <p className="text-center text-sm font-bold text-slate-400 uppercase tracking-widest font-display">
            Trusted by 5,000+ forward-thinking properties
          </p>
        </div>
        
            <div className="flex relative w-full overflow-hidden">
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 50, repeat: Infinity }}
            className="flex flex-none gap-24 pr-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-500"
          >
            {/* Duplicate set to make it seamless */}
            {[1, 2].map((set) => (
              <React.Fragment key={set}>
                <div className="flex items-center justify-center min-w-[200px]">
                  <h3 className="text-3xl font-black text-slate-800 tracking-tighter">GrandHyatt</h3>
                </div>
                <div className="flex items-center justify-center min-w-[200px]">
                  <h3 className="text-3xl font-serif italic text-slate-800">The Ritz</h3>
                </div>
                <div className="flex items-center justify-center min-w-[200px]">
                  <h3 className="text-3xl font-black text-slate-800 uppercase tracking-widest">Marriott</h3>
                </div>
                <div className="flex items-center justify-center min-w-[200px]">
                  <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <Layers className="w-8 h-8"/> Hilton
                  </h3>
                </div>
                <div className="flex items-center justify-center min-w-[200px]">
                  <h3 className="text-3xl font-black text-slate-800 tracking-tighter">Taj Hotels</h3>
                </div>
              </React.Fragment>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us / Stats Section */}
      <section className="py-24 bg-white relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-black text-slate-900 mb-6">Built for scale. Designed for speed.</h2>
            <p className="text-xl text-slate-600 font-medium">Why the world's best hotels are switching to Zoox.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <TrendingUp className="w-8 h-8"/>, value: "30%", label: "Average Increase in Revenue", desc: "Through smart upselling and tighter POS integration." },
              { icon: <Clock className="w-8 h-8"/>, value: "2.5x", label: "Faster Check-ins", desc: "Streamlined workflows get guests to their rooms quicker." },
              { icon: <Users className="w-8 h-8"/>, value: "98%", label: "Staff Satisfaction", desc: "An interface so intuitive, new hires learn it in a day." }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.3, duration: 1.0, type: "spring", bounce: 0.3 }}
                className="bg-slate-50 border border-slate-200 p-8 rounded-[2rem] text-center shadow-lg hover:bg-white hover:-translate-y-3 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 group"
              >
                <div className="w-16 h-16 mx-auto bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  {stat.icon}
                </div>
                <div className="text-5xl font-display font-black text-slate-900 mb-2">{stat.value}</div>
                <div className="text-lg font-bold text-slate-800 mb-3">{stat.label}</div>
                <div className="text-slate-600 font-medium">{stat.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-display font-black text-center mb-16"
          >
            Don't just take our word for it
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1.0, ease: "easeOut" }}
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-3xl hover:bg-white/10 transition-colors"
            >
              <div className="flex gap-1 text-amber-400 mb-6">
                {[1,2,3,4,5].map(star => <motion.div key={star} initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.8 }} transition={{ delay: 0.5 + (star * 0.2), duration: 0.6 }}><Star className="w-5 h-5 fill-current" /></motion.div>)}
              </div>
              <p className="text-xl leading-relaxed font-medium text-slate-200 mb-8">
                "Switching to Zoox was the best decision we made for our 120-room property. The Restaurant POS integration with room billing is completely flawless. It saved us countless hours of reconciliation."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center font-bold text-xl">SJ</div>
                <div>
                  <h4 className="font-bold text-white">Sarah Jenkins</h4>
                  <p className="text-slate-400 text-sm">General Manager, The Grand Azure</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1.0, ease: "easeOut" }}
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-3xl hover:bg-white/10 transition-colors"
            >
              <div className="flex gap-1 text-amber-400 mb-6">
                {[1,2,3,4,5].map(star => <motion.div key={star} initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.8 }} transition={{ delay: 0.5 + (star * 0.2), duration: 0.6 }}><Star className="w-5 h-5 fill-current" /></motion.div>)}
              </div>
              <p className="text-xl leading-relaxed font-medium text-slate-200 mb-8">
                "The interface is so intuitive. Our front desk staff picked it up on day one without any formal training. The live analytics dashboard gives me a perfect overview of my business anywhere I go."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-fuchsia-500 rounded-full flex items-center justify-center font-bold text-xl">MP</div>
                <div>
                  <h4 className="font-bold text-white">Michael Patel</h4>
                  <p className="text-slate-400 text-sm">Owner, Heritage Boutique</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Hero;


