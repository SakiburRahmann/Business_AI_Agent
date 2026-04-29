"use client";

import { useEffect, useState } from "react";
import { Calendar, User, Clock, CheckCircle2, AlertCircle, RefreshCcw } from "lucide-react";
import Link from "next/link";

interface Booking {
  id: string;
  patient_type: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  appointment_type: string;
  date_preference: string;
  time_preference: string;
  source: string;
  status: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafb] text-[#2c3e50] p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-[#1e3a4f] font-[family-name:var(--font-playfair)]">North South Dental</h1>
            <p className="text-sm text-[#6b7b8d] mt-1">Staff Administration Dashboard</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={fetchBookings}
              className="p-2 bg-white border border-[#e8e4de] rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCcw className={`w-5 h-5 text-[#5a7a6a] ${loading ? 'animate-spin' : ''}`} />
            </button>
            <Link href="/" className="px-5 py-2 bg-[#1e3a4f] text-white text-sm font-medium rounded-lg hover:bg-[#152a39] transition-colors flex items-center gap-2">
              Back to Website
            </Link>
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl border border-[#e8e4de] shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-[#f0f7fc] rounded-lg text-[#1e3a4f]">
                <Calendar className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-[#27ae60] bg-[#eafaf1] px-2 py-1 rounded">Real-time</span>
            </div>
            <h3 className="text-2xl font-bold text-[#1e3a4f]">{bookings.length}</h3>
            <p className="text-sm text-[#6b7b8d]">Total Appointment Requests</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-[#e8e4de] shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-[#fdf2f2] rounded-lg text-[#e74c3c]">
                <AlertCircle className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-[#1e3a4f]">{bookings.filter(b => b.status === 'Pending').length}</h3>
            <p className="text-sm text-[#6b7b8d]">Pending Review</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-[#e8e4de] shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-[#eafaf1] rounded-lg text-[#27ae60]">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-[#1e3a4f]">{bookings.filter(b => b.source === 'AI').length}</h3>
            <p className="text-sm text-[#6b7b8d]">Autonomous AI Bookings</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-[#e8e4de] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#e8e4de] bg-[#fdfbf7]">
            <h2 className="text-lg font-bold text-[#3d5a4d]">Recent Appointment Requests</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-[#e8e4de]">
                  <th className="px-6 py-4 text-xs font-bold text-[#6b7b8d] uppercase tracking-wider">Patient Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-[#6b7b8d] uppercase tracking-wider">Appointment Type</th>
                  <th className="px-6 py-4 text-xs font-bold text-[#6b7b8d] uppercase tracking-wider">Preferred Date/Time</th>
                  <th className="px-6 py-4 text-xs font-bold text-[#6b7b8d] uppercase tracking-wider">Source</th>
                  <th className="px-6 py-4 text-xs font-bold text-[#6b7b8d] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-[#6b7b8d] uppercase tracking-wider">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8e4de]">
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={6} className="px-6 py-6 bg-gray-50/50"></td>
                    </tr>
                  ))
                ) : bookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-[#6b7b8d]">No bookings found.</td>
                  </tr>
                ) : (
                  bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#f0f7fc] flex items-center justify-center text-[#1e3a4f] text-xs font-bold uppercase">
                            {(booking.first_name?.[0] || '') + (booking.last_name?.[0] || '') || '?'}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-[#2c3e50]">{booking.first_name || 'Unknown'} {booking.last_name || ''}</div>
                            <div className="text-xs text-[#6b7b8d]">{booking.phone || 'No phone provided'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-gray-100 rounded text-[10px] font-bold text-[#1e3a4f] uppercase">
                          {booking.appointment_type || 'General'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-[#2c3e50] flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[#5a7a6a]" /> {booking.date_preference || 'ASAP'}
                          </span>
                          <span className="text-xs text-[#6b7b8d] flex items-center gap-1.5 mt-1">
                            <Clock className="w-3.5 h-3.5" /> {booking.time_preference || 'Any Time'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                          booking.source === 'AI' 
                            ? 'bg-[#eafaf1] text-[#27ae60] border border-[#27ae60]/20' 
                            : 'bg-gray-100 text-[#6b7b8d]'
                        }`}>
                          {booking.source}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${booking.status === 'Pending' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                          <span className="text-sm font-medium">{booking.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-[#6b7b8d]">
                        {new Date(booking.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
