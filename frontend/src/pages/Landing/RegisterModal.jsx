import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Users, CheckCircle2, X, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

const RegisterModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    hotelName: '',
    hotelEmail: '',
    hotelContact: '',
    hotelAddress: '',
    gstNo: '',
    cinNo: '',
    adminName: '',
    adminEmail: '',
    adminPassword: '',
    adminMobile: '',
    adminAge: '',
    adminAddress: ''
  });
  const [logoFile, setLogoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    let logoUrl = '';
    try {
      if (logoFile) {
        const uploadData = new FormData();
        uploadData.append('files', logoFile);
        const uploadRes = await api.post('/api/upload/public-upload', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (uploadRes.data.success && uploadRes.data.urls.length > 0) {
          logoUrl = uploadRes.data.urls[0];
        }
      }

      const submitData = { ...formData, logo: logoUrl };
      const response = await api.post('/api/auth/register-hotel', submitData);
      if (response.data.success) {
        setSuccessData({
          email: response.data.adminUser.email,
          hotelName: response.data.hotel.name
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register hotel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-md z-10">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Register Your Hotel</h2>
                <p className="text-slate-500 text-sm mt-1">Get started with your dedicated admin panel</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-slate-400 hover:text-slate-600" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar">
              {successData ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-emerald-100">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Registration Successful!</h3>
                  <p className="text-slate-600 mb-8">Welcome to Secure Billing Pro, <span className="font-semibold text-slate-900">{successData.hotelName}</span>.</p>
                  
                  <div className="bg-slate-50 rounded-xl p-6 mb-8 max-w-md mx-auto text-left border border-slate-200 shadow-sm">
                    <p className="text-sm text-slate-600 mb-4 font-medium">Please save these credentials to login to your admin panel:</p>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-slate-500 uppercase tracking-wider font-bold">Admin Email (ID)</label>
                        <div className="font-mono text-lg text-slate-900 mt-1 bg-white px-3 py-1.5 rounded-lg border border-slate-200 inline-block">{successData.email}</div>
                      </div>
                      <div>
                        <label className="text-xs text-slate-500 uppercase tracking-wider font-bold">Password</label>
                        <div className="font-mono text-lg text-slate-900 mt-1 bg-white px-3 py-1.5 rounded-lg border border-slate-200 inline-block">The password you entered</div>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => navigate('/login')}
                    className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-lg shadow-blue-600/20"
                  >
                    Go to Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRegister} className="space-y-8">
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
                      {error}
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-blue-600" /> Hotel Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input name="hotelName" placeholder="Hotel Name" required onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium" />
                      <input name="hotelEmail" type="email" placeholder="Hotel Email" required onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium" />
                      <input name="hotelContact" placeholder="Contact Number" required onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium" />
                      <input name="hotelAddress" placeholder="Full Address" required onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium" />
                      
                      {/* Optional Fields */}
                      <input name="gstNo" placeholder="GST Number (Optional)" onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium" />
                      <input name="cinNo" placeholder="CIN Number (Optional)" onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium" />
                      
                      <div className="w-full col-span-1 md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">Hotel Logo (Optional)</label>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleFileChange} 
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-slate-100 w-full" />

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-600" /> Admin Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input name="adminName" placeholder="Admin Full Name" required onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium" />
                      <input name="adminEmail" type="email" placeholder="Admin Login Email" required onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium" />
                      
                      <div className="relative w-full">
                        <input 
                          name="adminPassword" 
                          type={showPassword ? "text" : "password"} 
                          placeholder="Create Password" 
                          required 
                          onChange={handleInputChange} 
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-12 py-3 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium" 
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>

                      <input name="adminMobile" placeholder="Admin Mobile" required onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium" />
                      <input name="adminAge" type="number" placeholder="Age" required onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium" />
                      <input name="adminAddress" placeholder="Admin Address" required onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium" />
                    </div>
                  </div>

                  <div className="pt-4 sticky bottom-0 bg-white pb-4">
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                    >
                      {loading ? 'Creating your workspace...' : 'Complete Registration'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default RegisterModal;
