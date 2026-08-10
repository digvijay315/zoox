import React, { useState, useEffect } from "react";
import { Settings, Shield, LayoutGrid, Check, X, AlertCircle, Database } from "lucide-react";
import AdminLookups from "./AdminLookups";
import { authAPI } from "../../api";
import Swal from "sweetalert2";

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("security");
  const [currentUser, setCurrentUser] = useState(null);

  // Security Form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Permissions Form
  const [permissions, setPermissions] = useState({
    restaurant: true,
    roomBooking: true,
    kot: true,
    advanceBooking: true,
    grc: true,
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setCurrentUser(user);
      if (user.staffPermissions) {
        setPermissions(user.staffPermissions);
      }
    }
  }, []);

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      Swal.fire({ 
        icon: "error", 
        title: "Oops...", 
        text: "New passwords do not match!",
        background: '#ffffff',
        color: '#1e293b',
        customClass: { confirmButton: 'bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded border-none shadow' },
      });
      return;
    }
    try {
      const res = await authAPI.updatePassword({ currentPassword, newPassword });
      if (res.data.success) {
        Swal.fire({ 
          icon: "success", 
          title: "Success", 
          text: "Password updated successfully!",
          background: '#ffffff',
          color: '#1e293b',
          customClass: { confirmButton: 'bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded border-none shadow' },
        });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: err.response?.data?.message || "Failed to update password",
        background: '#ffffff',
        color: '#1e293b',
        customClass: { confirmButton: 'bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded border-none shadow' },
      });
    }
  };

  const handlePermissionToggle = (key) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const savePermissions = async () => {
    try {
      const res = await authAPI.updateStaffPermissions({ permissions });
      if (res.data.success) {
        Swal.fire({ 
          icon: "success", 
          title: "Success", 
          text: "Staff permissions updated!",
          background: '#ffffff',
          color: '#1e293b',
          customClass: { confirmButton: 'bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded border-none shadow' },
        });
        // Update local storage
        if (currentUser) {
          const updatedUser = { ...currentUser, staffPermissions: res.data.staffPermissions };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          setCurrentUser(updatedUser);
          // dispatch a custom event to update Navbar without reload
          window.dispatchEvent(new Event("user-updated"));
        }
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: err.response?.data?.message || "Failed to update permissions",
        background: '#ffffff',
        color: '#1e293b',
        customClass: { confirmButton: 'bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded border-none shadow' },
      });
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto min-h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-amber-500 flex items-center gap-3">
            <Settings className="w-8 h-8" />
            Settings
          </h1>
          <p className="text-slate-400 mt-1">Manage security and panel preferences</p>
        </div>
      </div>

      <div className="glass border border-gold-800/20 rounded-2xl overflow-hidden flex flex-col md:flex-row min-h-[500px]">
        {/* Tabs Sidebar */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-amber-500/10 bg-slate-800/30 p-4 flex flex-row md:flex-col gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("security")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${
              activeTab === "security"
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 font-semibold shadow-lg shadow-amber-500/10"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
            }`}
          >
            <Shield className="w-5 h-5" />
            Security
          </button>
          <button
            onClick={() => setActiveTab("staff")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${
              activeTab === "staff"
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 font-semibold shadow-lg shadow-amber-500/10"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
            }`}
          >
            <LayoutGrid className="w-5 h-5" />
            Staff Panel
          </button>
          <button
            onClick={() => setActiveTab("lookups")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${
              activeTab === "lookups"
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 font-semibold shadow-lg shadow-amber-500/10"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
            }`}
          >
            <Database className="w-5 h-5" />
            Lookups Master
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          {activeTab === "security" && (
            <div className="animate-fade-in max-w-md">
              <h2 className="text-xl font-semibold text-slate-100 mb-6">Change Password</h2>
              <form onSubmit={handlePasswordUpdate} className="flex flex-col gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Current Password</label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500/50 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="mt-2 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-semibold py-3 px-6 rounded-xl transition-all active:scale-95"
                >
                  Update Password
                </button>
              </form>
            </div>
          )}

          {activeTab === "staff" && (
            <div className="animate-fade-in max-w-2xl">
              <h2 className="text-xl font-semibold text-slate-100 mb-2">Staff Panel Modules</h2>
              <p className="text-sm text-slate-400 mb-6 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                Select which menus should be visible to staff members.
              </p>

              <div className="flex flex-col gap-4 mb-8">
                {[
                  { key: "restaurant", label: "Restaurant Billing" },
                  { key: "roomBooking", label: "Room Booking" },
                  { key: "kot", label: "KOT Billing" },
                  { key: "advanceBooking", label: "Advance Bookings" },
                  { key: "grc", label: "Print GRC" },
                ].map((mod) => (
                  <div key={mod.key} className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
                    <span className="font-medium text-slate-200">{mod.label}</span>
                    <button
                      onClick={() => handlePermissionToggle(mod.key)}
                      className={`relative w-14 h-7 rounded-full transition-colors ${
                        permissions[mod.key] ? "bg-amber-500" : "bg-slate-700"
                      }`}
                    >
                      <div
                        className={`absolute top-1 flex items-center justify-center w-5 h-5 rounded-full bg-white transition-transform ${
                          permissions[mod.key] ? "translate-x-8" : "translate-x-1"
                        }`}
                      >
                        {permissions[mod.key] ? (
                          <Check className="w-3 h-3 text-amber-500" />
                        ) : (
                          <X className="w-3 h-3 text-slate-400" />
                        )}
                      </div>
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={savePermissions}
                className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-semibold py-3 px-8 rounded-xl transition-all active:scale-95"
              >
                Save Preferences
              </button>
            </div>
          )}

          {activeTab === "lookups" && (
            <div className="animate-fade-in h-full">
              <AdminLookups isComponent={true} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
