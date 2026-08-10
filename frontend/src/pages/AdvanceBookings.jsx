import React, { useState, useEffect } from "react";
import { BookOpen, Image as ImageIcon, Search, CheckCircle, FileText, Trash2, Edit } from "lucide-react";
import api from "../api";
import Swal from "sweetalert2";
import { showError, showSuccess, showConfirm, showAlert, getSwalConfig } from "../utils/alerts";

export default function AdvanceBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState(""); 
  
  // Pagination & Filtering state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterType, setFilterType] = useState("all");
  const [selectedRoomFilter, setSelectedRoomFilter] = useState("all");
  const [roomsList, setRoomsList] = useState([]);
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  // Guest Details Modal
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [selectedGuestBooking, setSelectedGuestBooking] = useState(null);

  // Edit Modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editBooking, setEditBooking] = useState(null);
  const [editAdvanceAmount, setEditAdvanceAmount] = useState(0);
  const [editExpectedCheckInDate, setEditExpectedCheckInDate] = useState("");
  const [editExpectedCheckOutDate, setEditExpectedCheckOutDate] = useState("");
  const [editNumGuests, setEditNumGuests] = useState(1);
  const [editGuests, setEditGuests] = useState([]);
  const [editHasGST, setEditHasGST] = useState(false);
  const [editGstNumber, setEditGstNumber] = useState("");
  const [editCompanyName, setEditCompanyName] = useState("");
  const [editCompanyAddress, setEditCompanyAddress] = useState("");
  const [submittingEdit, setSubmittingEdit] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [page, filterType, selectedRoomFilter, searchTerm]);

  useEffect(() => {
    if (filterType === 'custom' && customStartDate && customEndDate) {
      fetchBookings();
    }
  }, [customStartDate, customEndDate]);

  const fetchRooms = async () => {
    try {
      const res = await api.get("/api/rooms");
      if (res.data.success) {
        setRoomsList(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch rooms for filter");
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/room-bookings", {
        params: {
          page,
          limit: 10,
          status: 'Advance-Booked',
          filter: filterType === 'all' ? undefined : filterType,
          roomId: selectedRoomFilter === 'all' ? undefined : selectedRoomFilter,
          startDate: filterType === 'custom' ? customStartDate : undefined,
          endDate: filterType === 'custom' ? customEndDate : undefined,
          search: searchTerm || undefined
        }
      });
      setBookings(res.data.data);
      if (res.data.pagination) {
        setTotalPages(res.data.pagination.pages);
      }
    } catch (error) {
      console.error(error);
      showError("Error", "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleConvertToCheckIn = async (booking) => {
    showConfirm(
      "Convert to Check-In?",
      `Guest: ${booking.guests[0]?.name}. Do you want to check them in now?`,
      "Yes, Check In"
    ).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true);
          const convRes = await api.put(`/api/room-bookings/convert/${booking._id}`);
          if (convRes.data.success) {
            showSuccess("Checked In", "Room successfully converted to Check-In!");
            fetchBookings();
          }
        } catch (err) {
          showError("Error", err.response?.data?.message || "Failed to convert booking");
          setLoading(false);
        }
      }
    });
  };

  const handleViewImage = (url, title = 'Customer Document') => {
    if (!url) {
      showAlert("Info", `No ${title.toLowerCase()} uploaded for this booking.`, "info");
      return;
    }
    Swal.fire({
      ...getSwalConfig(),
      title: title,
      imageUrl: url,
      imageAlt: title,
      width: 600,
      padding: '1em'
    });
  };

  const handleSearch = () => {
    setPage(1);
    setSearchTerm(searchInput);
  };

  const handleRowClick = (booking, e) => {
    // Prevent modal if clicking on buttons
    if (e.target.closest('button')) return;
    setSelectedGuestBooking(booking);
    setShowGuestModal(true);
  };

  const handleDeleteBooking = async (id) => {
    showConfirm("Delete Booking?", "Are you sure you want to delete this advance booking? This action cannot be undone.", "Yes, Delete", "No", "#ef4444").then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await api.delete(`/api/room-bookings/advance/${id}`);
          if (res.data.success) {
            showSuccess("Deleted", "Booking deleted successfully!");
            fetchBookings();
          }
        } catch (err) {
          showError("Error", err.response?.data?.message || "Failed to delete booking");
        }
      }
    });
  };

  const openEditModal = (booking) => {
    setEditBooking(booking);
    setEditAdvanceAmount(booking.advanceAmount || 0);
    
    // Format dates for datetime-local input (YYYY-MM-DDThh:mm)
    const formatForInput = (dateStr) => {
      if (!dateStr) return "";
      const d = new Date(dateStr);
      // Adjust to local timezone format
      d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
      return d.toISOString().slice(0, 16);
    };

    setEditExpectedCheckInDate(formatForInput(booking.expectedCheckInDate));
    setEditExpectedCheckOutDate(formatForInput(booking.expectedCheckOutDate));
    
    // Setup full form data
    setEditNumGuests(booking.guests?.length || 1);
    setEditGuests(booking.guests?.length ? [...booking.guests] : [{ name: "", age: "", phone: "", idType: "Aadhar", idNumber: "", documentImage: null, personPhoto: null }]);
    setEditHasGST(booking.hasGST || false);
    setEditGstNumber(booking.gstNumber || "");
    setEditCompanyName(booking.companyName || "");
    setEditCompanyAddress(booking.companyAddress || "");

    setShowEditModal(true);
  };

  const updateEditGuestField = (index, field, value) => {
    const updated = [...editGuests];
    updated[index][field] = value;
    setEditGuests(updated);
  };

  const submitEditBooking = async (e) => {
    e.preventDefault();
    setSubmittingEdit(true);
    try {
      const res = await api.put(`/api/room-bookings/advance/${editBooking._id}`, {
        advanceAmount: editAdvanceAmount,
        expectedCheckInDate: editExpectedCheckInDate,
        expectedCheckOutDate: editExpectedCheckOutDate,
        guests: editGuests,
        hasGST: editHasGST,
        gstNumber: editHasGST ? editGstNumber : "",
        companyName: editHasGST ? editCompanyName : "",
        companyAddress: editHasGST ? editCompanyAddress : ""
      });
      if (res.data.success) {
        showSuccess("Success", "Advance booking updated successfully!");
        setShowEditModal(false);
        fetchBookings();
      }
    } catch (err) {
      showError("Error", err.response?.data?.message || "Failed to update booking");
    } finally {
      setSubmittingEdit(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-amber-500 flex items-center gap-2">
            <BookOpen className="w-7 h-7" />
            Advance Bookings
          </h2>
          <p className="text-slate-400 text-sm mt-1">View and manage advance room bookings</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          {/* Filters */}
          <select
            value={selectedRoomFilter}
            onChange={(e) => {
              setSelectedRoomFilter(e.target.value);
              setPage(1);
            }}
            className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Rooms</option>
            {roomsList.map(r => (
              <option key={r._id} value={r._id}>Room {r.roomNumber} ({r.type})</option>
            ))}
          </select>

          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setPage(1);
            }}
            className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Time</option>
            <option value="today">Check-In Today</option>
            <option value="tomorrow">Check-In Tomorrow</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="custom">Custom Date</option>
          </select>

          {filterType === 'custom' && (
            <div className="flex gap-2">
              <input type="date" value={customStartDate} onChange={(e) => setCustomStartDate(e.target.value)} className="bg-slate-900 border border-slate-700 rounded-xl px-2 py-2 text-white text-sm" />
              <span className="text-slate-500 self-center">to</span>
              <input type="date" value={customEndDate} onChange={(e) => setCustomEndDate(e.target.value)} className="bg-slate-900 border border-slate-700 rounded-xl px-2 py-2 text-white text-sm" />
            </div>
          )}

          {/* Search */}
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search by Guest Name or Room..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full md:w-64 bg-slate-900 border border-slate-700 rounded-l-xl pl-4 pr-4 py-2 text-white focus:outline-none focus:border-amber-500"
            />
            <button onClick={handleSearch} className="bg-amber-500 text-slate-900 p-2.5 rounded-r-xl border border-amber-500 hover:bg-amber-400">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl border border-gold-800/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-900/50 border-b border-gold-800/20">
              <tr>
                <th className="px-6 py-4 text-slate-300 font-semibold text-sm">Guest</th>
                <th className="px-6 py-4 text-slate-300 font-semibold text-sm">Room</th>
                <th className="px-6 py-4 text-slate-300 font-semibold text-sm">Expected Check-In/Out</th>
                <th className="px-6 py-4 text-slate-300 font-semibold text-sm">Advance Paid</th>
                <th className="px-6 py-4 text-slate-300 font-semibold text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-800/10">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-400">Loading bookings...</td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-400">No advance bookings found.</td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr 
                    key={booking._id} 
                    onClick={(e) => handleRowClick(booking, e)}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      {booking.guests && booking.guests.length > 0 ? (
                        <>
                          <p className="font-semibold text-slate-200">{booking.guests[0].name} <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-amber-500">+{booking.guests.length - 1} more</span></p>
                          <p className="text-xs text-slate-400">{booking.guests[0].phone}</p>
                        </>
                      ) : (
                        <p className="font-semibold text-slate-200">N/A</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-200">{booking.room?.roomNumber}</p>
                      <p className="text-xs text-slate-400">{booking.room?.type}</p>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <p className="text-blue-400">In: {booking.expectedCheckInDate ? new Date(booking.expectedCheckInDate).toLocaleString("en-IN", { dateStyle: 'short', timeStyle: 'short' }) : 'N/A'}</p>
                      <p className="text-amber-500 mt-1">Out: {booking.expectedCheckOutDate ? new Date(booking.expectedCheckOutDate).toLocaleString("en-IN", { dateStyle: 'short', timeStyle: 'short' }) : 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-emerald-400">₹{booking.advanceAmount || 0}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleConvertToCheckIn(booking)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors shadow-lg border border-emerald-500"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Check In
                        </button>
                        <button
                          onClick={() => openEditModal(booking)}
                          className="p-1.5 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all border border-transparent hover:border-blue-500/25"
                          title="Edit Booking"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBooking(booking._id)}
                          className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-all border border-transparent hover:border-red-500/25"
                          title="Delete Booking"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (booking.guests && booking.guests[0]?.documentImage) {
                              handleViewImage(booking.guests[0].documentImage, 'Customer Document');
                            } else {
                              handleViewImage(null, 'Customer Document');
                            }
                          }}
                          className="p-1.5 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all border border-transparent hover:border-blue-500/25"
                          title="View Document"
                        >
                          <ImageIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-slate-400">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-slate-800 text-white rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-slate-800 text-white rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Premium Guest Details Modal */}
      {showGuestModal && selectedGuestBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-gold-800/40 p-0 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden relative">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6 border-b border-slate-200 dark:border-gold-800/30 relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 dark:from-amber-500 dark:via-yellow-300 dark:to-amber-500"></div>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-black text-amber-600 dark:text-amber-500 flex items-center gap-3">
                    <BookOpen className="w-6 h-6 text-amber-500 dark:text-amber-400" />
                    Advance Booking Details
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 font-medium">
                    Room <span className="text-slate-900 dark:text-white font-bold">{selectedGuestBooking.room?.roomNumber}</span> ({selectedGuestBooking.room?.type})
                  </p>
                </div>
                <button 
                  onClick={() => setShowGuestModal(false)} 
                  className="bg-slate-100 hover:bg-red-100 dark:bg-slate-800/50 dark:hover:bg-red-500/20 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 p-2 rounded-full transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800/80 p-4 rounded-2xl shadow-sm dark:shadow-inner">
                  <p className="text-xs text-slate-500 dark:text-slate-500 uppercase tracking-widest font-bold mb-1">Expected Check-In</p>
                  <p className="font-medium text-blue-600 dark:text-blue-400 font-mono text-sm">{selectedGuestBooking.expectedCheckInDate ? new Date(selectedGuestBooking.expectedCheckInDate).toLocaleDateString("en-IN") : 'N/A'}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800/80 p-4 rounded-2xl shadow-sm dark:shadow-inner">
                  <p className="text-xs text-slate-500 dark:text-slate-500 uppercase tracking-widest font-bold mb-1">Expected Check-Out</p>
                  <p className="font-medium text-amber-600 dark:text-amber-500 font-mono text-sm">
                    {selectedGuestBooking.expectedCheckOutDate 
                      ? new Date(selectedGuestBooking.expectedCheckOutDate).toLocaleDateString("en-IN")
                      : "N/A"}
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800/80 p-4 rounded-2xl shadow-sm dark:shadow-inner flex flex-col justify-center">
                  <p className="text-xs text-slate-500 dark:text-slate-500 uppercase tracking-widest font-bold mb-1">Advance Amount</p>
                  <p className="font-medium text-emerald-600 dark:text-emerald-400 font-mono text-lg font-bold">
                    ₹{selectedGuestBooking.advanceAmount || 0}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
                <h4 className="text-lg font-black text-slate-800 dark:text-slate-300 uppercase tracking-widest">Guest Information</h4>
                <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedGuestBooking.guests && selectedGuestBooking.guests.map((g, idx) => (
                  <div key={idx} className="bg-gradient-to-b from-white to-slate-50 dark:from-slate-800/40 dark:to-slate-900/40 p-5 rounded-2xl border border-slate-200 dark:border-gold-800/20 relative group hover:border-amber-500/50 dark:hover:border-gold-800/50 transition-colors shadow-md dark:shadow-lg">
                    <div className="absolute top-0 right-0 bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-500 px-3 py-1 rounded-bl-2xl rounded-tr-2xl text-xs font-bold border-b border-l border-amber-200 dark:border-gold-800/20">
                      Guest {idx + 1}
                    </div>
                    
                    <div className="mb-4 pr-16">
                      <p className="font-black text-slate-900 dark:text-white text-lg tracking-wide">{g.name}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Age: <span className="text-amber-600 dark:text-amber-400">{g.age}</span></p>
                        <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Ph: <span className="text-amber-600 dark:text-amber-400">{g.phone}</span></p>
                      </div>
                      <p className="text-slate-500 dark:text-slate-500 text-xs mt-2 uppercase tracking-wider font-bold">
                        {g.idType}: <span className="text-slate-800 dark:text-slate-300">{g.idNumber}</span>
                      </p>
                    </div>
                    
                    <div className="flex gap-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-800/80">
                      {g.personPhoto && (
                        <button 
                          onClick={() => handleViewImage(g.personPhoto, 'Live Photo')}
                          className="flex-1 bg-amber-100 hover:bg-amber-200 dark:bg-amber-500/10 dark:hover:bg-amber-500/20 text-amber-700 dark:text-amber-500 py-2 rounded-xl text-xs font-bold transition-all border border-amber-200 hover:border-amber-400 dark:border-amber-500/20 dark:hover:border-amber-500/50 flex items-center justify-center gap-1.5 shadow-sm dark:shadow-inner"
                        >
                          <ImageIcon className="w-3.5 h-3.5" />
                          Live Photo
                        </button>
                      )}
                      {g.documentImage && (
                        <button 
                          onClick={() => handleViewImage(g.documentImage, 'ID Document')}
                          className="flex-1 bg-blue-100 hover:bg-blue-200 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 text-blue-700 dark:text-blue-400 py-2 rounded-xl text-xs font-bold transition-all border border-blue-200 hover:border-blue-400 dark:border-blue-500/20 dark:hover:border-blue-500/50 flex items-center justify-center gap-1.5 shadow-sm dark:shadow-inner"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          View ID
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        </div>
      )}

      {/* Edit Advance Booking Modal (Full Form) */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-gold-800/30 p-6 rounded-2xl w-full max-w-5xl shadow-2xl relative flex flex-col max-h-[90vh]">
            <h3 className="text-xl font-bold text-amber-500 mb-4 border-b border-slate-700 pb-2">
              Edit Advance Booking: Room {editBooking?.room?.roomNumber}
            </h3>
            <form onSubmit={submitEditBooking} className="flex flex-col overflow-y-auto pr-2 custom-scrollbar flex-1">
              {/* Primary Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Expected Check-In</label>
                  <input
                    type="datetime-local"
                    required
                    value={editExpectedCheckInDate}
                    onChange={(e) => setEditExpectedCheckInDate(e.target.value)}
                    className="w-full bg-slate-950 border border-amber-500/50 rounded-xl px-4 py-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Expected Check-Out</label>
                  <input
                    type="datetime-local"
                    required
                    value={editExpectedCheckOutDate}
                    onChange={(e) => setEditExpectedCheckOutDate(e.target.value)}
                    className="w-full bg-slate-950 border border-amber-500/50 rounded-xl px-4 py-2.5 text-white"
                  />
                </div>
              </div>

              {/* Guest Details */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-bold text-slate-300">Guest Details</h4>
                  <div className="flex items-center gap-3">
                    <label className="text-xs text-slate-400">Number of Guests</label>
                    <select
                      value={editNumGuests}
                      onChange={(e) => {
                        const count = parseInt(e.target.value);
                        setEditNumGuests(count);
                        const updated = [...editGuests];
                        if (count > updated.length) {
                          for (let i = updated.length; i < count; i++) {
                            updated.push({ name: "", age: "", phone: "", idType: "Aadhar", idNumber: "", documentImage: null, personPhoto: null });
                          }
                        } else {
                          updated.length = count;
                        }
                        setEditGuests(updated);
                      }}
                      className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-white text-sm"
                    >
                      {[1, 2, 3, 4, 5, 6].map(n => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  {editGuests.map((guest, index) => (
                    <div key={index} className="p-4 rounded-xl border border-slate-800 bg-slate-950/50 relative">
                      <h5 className="text-xs font-bold text-amber-500/70 mb-3 uppercase tracking-wider">Guest {index + 1} {index === 0 && '(Primary)'}</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Name</label>
                          <input
                            type="text"
                            required={index === 0}
                            value={guest.name}
                            onChange={(e) => updateEditGuestField(index, "name", e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Phone {index === 0 && '*'}</label>
                          <input
                            type="tel"
                            required={index === 0}
                            value={guest.phone}
                            onChange={(e) => updateEditGuestField(index, "phone", e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Age</label>
                          <input
                            type="number"
                            value={guest.age}
                            onChange={(e) => updateEditGuestField(index, "age", e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                          />
                        </div>
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <label className="block text-xs text-slate-400 mb-1">ID Type</label>
                            <select
                              value={guest.idType}
                              onChange={(e) => updateEditGuestField(index, "idType", e.target.value)}
                              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                            >
                              <option value="Aadhar">Aadhar</option>
                              <option value="PAN">PAN</option>
                              <option value="Passport">Passport</option>
                              <option value="Driving License">Driving License</option>
                              <option value="Voter ID">Voter ID</option>
                            </select>
                          </div>
                          <div className="flex-[2]">
                            <label className="block text-xs text-slate-400 mb-1">ID Number</label>
                            <input
                              type="text"
                              value={guest.idNumber}
                              onChange={(e) => updateEditGuestField(index, "idNumber", e.target.value.toUpperCase())}
                              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Sticky Section */}
              <div className="sticky bottom-0 bg-slate-900 pt-4 pb-2 z-10 mt-auto border-t border-slate-700 shadow-[0_-10px_15px_-3px_rgba(15,23,42,0.8)]">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="w-full md:w-1/3">
                    <label className="block text-sm text-slate-300 mb-1">Advance Amount (₹)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={editAdvanceAmount}
                      onChange={(e) => setEditAdvanceAmount(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white"
                    />
                  </div>
                  <div className="w-full md:w-1/3 flex flex-col">
                    <label className="flex items-center gap-2 text-sm text-slate-300 mb-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editHasGST}
                        onChange={(e) => setEditHasGST(e.target.checked)}
                        className="rounded border-slate-600 bg-slate-900 text-amber-500 focus:ring-amber-500"
                      />
                      Add GST Details
                    </label>
                    
                    {editHasGST ? (
                      <div className="flex flex-col gap-2 mt-1">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="15-digit GSTIN"
                            value={editGstNumber}
                            onChange={(e) => setEditGstNumber(e.target.value.toUpperCase())}
                            className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-xs"
                            maxLength={15}
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <input
                            type="text"
                            placeholder="Company Name"
                            value={editCompanyName}
                            onChange={(e) => setEditCompanyName(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-xs"
                          />
                          <input
                            type="text"
                            placeholder="Company Address"
                            value={editCompanyAddress}
                            onChange={(e) => setEditCompanyAddress(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-xs"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="h-[46px]"></div>
                    )}
                  </div>
                  <div className="w-full md:w-1/3 flex gap-3 self-end">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="flex-1 py-3 mt-1 text-slate-300 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submittingEdit}
                      className="flex-1 py-3 mt-1 text-slate-900 bg-amber-500 rounded-xl hover:bg-amber-400 font-bold transition-colors disabled:opacity-50"
                    >
                      {submittingEdit ? "Updating..." : "Update Booking"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
