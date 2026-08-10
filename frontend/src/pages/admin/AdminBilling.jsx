import React, { useState, useEffect } from "react";
import { CreditCard, Check, Zap, Shield, Crown, Receipt, Printer } from "lucide-react";
import api, { authAPI } from "../../api";
import Swal from "sweetalert2";
import PremiumSubscriptionInvoice from "../../components/PremiumSubscriptionInvoice";

export default function AdminBilling() {
  const [currentPlan, setCurrentPlan] = useState("none");
  const [currentUser, setCurrentUser] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [printingInvoice, setPrintingInvoice] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setCurrentUser(user);
      if (user.subscriptionPlan) {
        setCurrentPlan(user.subscriptionPlan);
      }
    }

    // Check URL for payment status
    const params = new URLSearchParams(window.location.search);
    const paymentStatus = params.get('payment');
    
    if (paymentStatus === 'success') {
      Swal.fire({
        icon: "success",
        title: "Payment Successful!",
        text: `Your premium subscription has been activated.`,
        background: '#ffffff',
        color: '#1e293b',
        customClass: { confirmButton: 'bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded border-none shadow' },
      });
      // Optionally fetch latest user data from backend to refresh local state, 
      // but we assume user needs to re-login or we just update local state manually:
      if (user) {
        const updatedUser = { ...user, subscriptionPlan: 'premium', subscriptionStatus: 'active' };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
        setCurrentPlan('premium');
        window.dispatchEvent(new Event("user-updated"));
      }
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (paymentStatus === 'failed') {
      Swal.fire({
        icon: "error",
        title: "Payment Failed",
        text: "There was an issue with your payment. Please try again.",
        background: '#ffffff',
        color: '#1e293b',
        customClass: { confirmButton: 'bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded border-none shadow' },
      });
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const fetchInvoices = async () => {
      try {
        const res = await api.get('/api/payment/my-invoices');
        setInvoices(res.data);
      } catch (err) {
        console.error('Failed to fetch invoices:', err);
      }
    };
    if (user) fetchInvoices();
  }, []);

  // Calculate days left
  const calculateDaysLeft = () => {
    if (!currentUser?.subscriptionExpiresAt) return 0;
    const expiry = new Date(currentUser.subscriptionExpiresAt);
    const diff = expiry - new Date();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };
  const daysLeft = calculateDaysLeft();

  const handleActivatePlan = async (planName) => {
    if (planName === 'free') {
      // Free plan logic (mocked)
      Swal.fire('Success', 'Free plan activated', 'success');
      return;
    }

    if (planName === 'premium') {
      try {
        const txnid = 'TXN' + new Date().getTime();
        const baseAmount = 1499;
        const platformFee = baseAmount * 0.02;
        const amount = (baseAmount + platformFee).toFixed(2); // 1528.98
        const productinfo = 'Premium Plan Subscription';
        const firstname = currentUser?.name || 'Admin';
        const email = currentUser?.email || 'admin@gmail.com';

        // 1. Get Hash from backend
        const response = await api.post('/api/payment/hash', { 
          txnid, amount, productinfo, firstname, email, udf1: planName
        });
        
        const data = response.data;

        // 2. Create dynamic form and submit to PayU
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = data.url;

        const params = {
          key: data.key,
          txnid: txnid,
          amount: amount,
          productinfo: productinfo,
          firstname: firstname,
          email: email,
          phone: currentUser?.contact || '9999999999',
          // Dynamically get the base URL from the api instance so it works in both local and production
          surl: `${api.defaults.baseURL.replace(/\/$/, '')}/api/payment/success`,
          furl: `${api.defaults.baseURL.replace(/\/$/, '')}/api/payment/failure`,
          udf1: planName,
          hash: data.hash
        };

        for (const key in params) {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = params[key];
          form.appendChild(input);
        }

        document.body.appendChild(form);
        form.submit();

      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: err.message || "Failed to initialize payment gateway",
          background: '#0f172a',
          color: '#f8fafc',
          customClass: { confirmButton: 'bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded' },
          buttonsStyling: false
        });
      }
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto min-h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-amber-500 flex items-center gap-3">
            <CreditCard className="w-8 h-8" />
            Subscription & Billing
          </h1>
          <p className="text-slate-400 mt-1">Manage your SAAS billing plans and upgrades</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-12">
        {/* Free Tier */}
        <div className={`glass border rounded-3xl p-8 relative flex flex-col ${currentPlan === 'free' ? 'border-amber-500/50 shadow-lg shadow-amber-500/10' : 'border-slate-800/50'}`}>
          {currentPlan === 'free' && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 font-bold px-4 py-1 rounded-full text-sm">
              Current Plan
            </div>
          )}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-slate-200 mb-2">Free Tier</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-white">₹0</span>
              <span className="text-slate-400">/ forever</span>
            </div>
            <p className="text-sm text-slate-400 mt-4">Perfect for getting started and testing the system.</p>
          </div>

          <div className="flex-1">
            <ul className="space-y-4">
              {[
                "Basic Restaurant Billing",
                "Up to 50 Receipts / day",
                "1 Admin Account",
                "Basic Reporting",
                "Standard Email Support"
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300 text-sm">
                  <Check className="w-5 h-5 text-amber-500 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <button 
            disabled={currentPlan === 'free'}
            onClick={() => handleActivatePlan('free')}
            className={`mt-8 w-full py-3 px-6 rounded-xl font-semibold transition-all ${
              currentPlan === 'free' 
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-amber-600 hover:bg-amber-500 text-white'
            }`}
          >
            {currentPlan === 'free' ? 'Active' : 'Activate Free Tier'}
          </button>
        </div>

        {/* Pro Tier */}
        <div className={`glass border rounded-3xl p-8 relative flex flex-col ${currentPlan === 'pro' ? 'border-amber-500/50 shadow-lg shadow-amber-500/10' : 'border-gold-800/30'}`}>
          <div className="absolute -top-4 right-8 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold px-4 py-1 rounded-full text-sm flex items-center gap-1 shadow-lg shadow-amber-500/20">
            <Crown className="w-4 h-4" /> Recommended
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-slate-200 mb-2 flex items-center gap-2">
              Premium Plan <Zap className="w-5 h-5 text-amber-500" />
            </h3>
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-4xl font-bold text-white">₹1,499</span>
              <span className="text-slate-400">/ 28 days</span>
            </div>
            <p className="text-xs text-amber-500 font-bold mt-1">+ 2% Platform Fee (Total: ₹1,528.98)</p>
            <p className="text-sm text-slate-400 mt-4">Unlimited access to all features to grow your business.</p>
          </div>

          <div className="flex-1">
            <ul className="space-y-4">
              {[
                "Unlimited Restaurant Billing",
                "Room & Advance Bookings",
                "Unlimited Staff Accounts",
                "Advanced Analytics & Exports",
                "24/7 Priority WhatsApp Support",
                "Custom Branding & Logo"
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300 text-sm">
                  <Check className="w-5 h-5 text-amber-500 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <button 
            disabled={currentPlan === 'premium'}
            className={`mt-8 w-full py-3 px-6 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
              currentPlan === 'premium'
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-slate-950 shadow-lg shadow-amber-600/20 active:scale-95'
            }`}
            onClick={() => handleActivatePlan('premium')}
          >
            {currentPlan === 'premium' ? `Active (${daysLeft} Days Left)` : 'Upgrade Now'}
          </button>
        </div>
      </div>
      
      {/* Billing History Section */}
      <div className="mt-12 max-w-4xl mx-auto glass p-6 sm:p-8 rounded-3xl border border-slate-800/50">
        <h3 className="text-xl font-bold text-slate-200 mb-6 flex items-center gap-2">
          <Receipt className="w-6 h-6 text-amber-500" /> Billing History
        </h3>
        
        {invoices.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-400">No past transactions found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-sm">
                  <th className="pb-3 px-4 font-semibold">Date</th>
                  <th className="pb-3 px-4 font-semibold">Transaction ID</th>
                  <th className="pb-3 px-4 font-semibold">Plan</th>
                  <th className="pb-3 px-4 font-semibold">Amount</th>
                  <th className="pb-3 px-4 font-semibold">Status</th>
                  <th className="pb-3 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {invoices.map((inv) => (
                  <tr key={inv._id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="py-4 px-4 text-sm text-slate-300">
                      {new Date(inv.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-sm text-slate-300 font-mono">
                      {inv.txnid}
                    </td>
                    <td className="py-4 px-4 text-sm text-slate-300 capitalize">
                      {inv.planName}
                    </td>
                    <td className="py-4 px-4 text-sm text-slate-300 font-bold">
                      ₹{inv.amount}
                    </td>
                    <td className="py-4 px-4 text-sm">
                      {inv.status === 'success' ? (
                        <span className="text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded text-xs">Success</span>
                      ) : (
                        <span className="text-red-500 bg-red-500/10 px-2 py-1 rounded text-xs">Failed</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      {inv.status === 'success' && (
                        <button 
                          onClick={() => setPrintingInvoice(inv)}
                          className="inline-flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <Printer className="w-4 h-4" /> Print
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {printingInvoice && (
        <PremiumSubscriptionInvoice 
          invoice={printingInvoice} 
          onClose={() => setPrintingInvoice(null)} 
        />
      )}

      <div className="mt-12 text-center max-w-2xl mx-auto glass p-6 rounded-2xl border border-slate-800/50">
        <Shield className="w-8 h-8 text-slate-400 mx-auto mb-3" />
        <h4 className="text-slate-200 font-medium mb-2">Secure Payments</h4>
        <p className="text-sm text-slate-500">
          All transactions are secure and encrypted. You can cancel your subscription at any time. For enterprise volume pricing, please contact our sales team.
        </p>
      </div>
    </div>
  );
}
