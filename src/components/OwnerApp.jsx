import React, { useState } from 'react';
import {
  Hotel,
  Calendar,
  Settings,
  Image as ImageIcon,
  MapPin,
  Lock,
  Link as LinkIcon,
  CheckCircle2,
  Trash2,
  Plus,
  Save,
  Phone,
  Mail,
  Upload,
  UserCheck,
  Eye,
  LogOut,
  TrendingUp,
  Clock,
  BedDouble,
  DollarSign,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useHotel } from '../context/HotelContext';
import { useAuth } from '../context/AuthContext';

export default function OwnerApp({ onPreviewLiveSite }) {
  const { hotelData, updateHotelData, bookings, deleteBooking } = useHotel();
  const { currentUser, logout, linkGoogleAccount, changePassword } = useAuth();

  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings', 'hotel', 'rooms', 'tourism', 'security'
  const [formData, setFormData] = useState({ ...hotelData });
  const [saveSuccess, setSaveSuccess] = useState('');

  // Keep formData in sync when hotelData updates
  React.useEffect(() => {
    setFormData({ ...hotelData });
  }, [hotelData]);

  // Security tab state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityMsg, setSecurityMsg] = useState('');
  const [googleEmailInput, setGoogleEmailInput] = useState(
    currentUser?.linkedGoogleEmail || currentUser?.email || ''
  );

  // Stats calculations
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.grandTotal || 0), 0);
  const pendingCheckins = bookings.filter((b) => b.status?.includes('Confirmed')).length;

  // Handle generic hotel text changes
  const handleHotelChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Room changes
  const handleRoomChange = (index, field, value) => {
    const updatedRooms = [...formData.rooms];
    updatedRooms[index] = {
      ...updatedRooms[index],
      [field]: field === 'price' ? Number(value) : value,
    };
    setFormData((prev) => ({ ...prev, rooms: updatedRooms }));
  };

  // Handle Room Image File Upload (converts to base64 data URL)
  const handleImageFileUpload = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleRoomChange(index, 'image', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Tourist Attraction changes
  const handleSpotChange = (index, field, value) => {
    const updated = [...formData.nearbyAttractions];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, nearbyAttractions: updated }));
  };

  const handleAddSpot = () => {
    const newSpot = {
      name: 'New Monument / Spot',
      distance: '4.5 km (15 mins)',
      image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=400&q=80',
    };
    setFormData((prev) => ({
      ...prev,
      nearbyAttractions: [...prev.nearbyAttractions, newSpot],
    }));
  };

  const handleDeleteSpot = (index) => {
    const updated = formData.nearbyAttractions.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, nearbyAttractions: updated }));
  };

  // Save all CMS changes to database/context
  const handleSaveCMS = async (e) => {
    e?.preventDefault();
    await updateHotelData(formData);
    setSaveSuccess('Website details updated successfully! Changes are live.');
    setTimeout(() => setSaveSuccess(''), 4000);
  };

  // Handle Password Change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setSecurityMsg('');
    if (newPassword.length < 5) {
      setSecurityMsg('Password must be at least 5 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setSecurityMsg('Passwords do not match');
      return;
    }

    const res = await changePassword(newPassword);
    setSecurityMsg(res.message);
    setNewPassword('');
    setConfirmPassword('');
  };

  // Handle Link Google Account
  const handleLinkGoogle = async (e) => {
    e.preventDefault();
    if (!googleEmailInput) return;
    const res = await linkGoogleAccount(googleEmailInput);
    setSecurityMsg(res.message);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col antialiased text-slate-800">
      {/* Top Admin Header Bar */}
      <header className="bg-royal-950 text-white border-b border-gold-500/30 sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-gold-600 via-gold-500 to-amber-300 p-0.5 flex items-center justify-center shadow">
            <div className="w-full h-full bg-royal-950 rounded-[10px] flex items-center justify-center">
              <Hotel className="w-5 h-5 text-gold-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold font-serif text-white tracking-wide">
                {hotelData.name}
              </h1>
              <span className="text-[10px] bg-gold-500/20 text-gold-300 border border-gold-500/40 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Owner Dashboard
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Admin: <span className="text-slate-200 font-semibold">{currentUser?.fullName}</span> ({currentUser?.email})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/80 px-3 py-1.5 rounded-lg border border-emerald-500/30 animate-fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>{saveSuccess}</span>
            </span>
          )}

          {/* Preview Live Website */}
          <button
            onClick={onPreviewLiveSite}
            className="text-xs px-3.5 py-2 rounded-xl bg-royal-800 hover:bg-royal-700 text-gold-300 border border-gold-500/30 transition flex items-center gap-2 font-medium"
            title="Preview how visitors see the website"
          >
            <Eye className="w-4 h-4 text-gold-400" />
            <span>View Live Website</span>
          </button>

          {/* Logout */}
          <button
            onClick={logout}
            className="text-xs px-3.5 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 transition flex items-center gap-1.5 font-medium"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </header>

      {/* Main Layout (Sidebar + Content) */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 sm:p-6 gap-6">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 bg-white rounded-3xl border border-slate-200 p-4 shadow-sm flex-shrink-0 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Management Menu
            </div>

            <button
              onClick={() => setActiveTab('bookings')}
              className={`w-full text-left px-3.5 py-3 rounded-2xl flex items-center justify-between text-xs font-semibold transition ${
                activeTab === 'bookings'
                  ? 'bg-royal-950 text-gold-300 shadow-md font-bold'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4" />
                <span>Customer Bookings</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold-500 text-royal-950 font-bold">
                {bookings.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('hotel')}
              className={`w-full text-left px-3.5 py-3 rounded-2xl flex items-center gap-2.5 text-xs font-semibold transition ${
                activeTab === 'hotel'
                  ? 'bg-royal-950 text-gold-300 shadow-md font-bold'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Hotel Details & Info</span>
            </button>

            <button
              onClick={() => setActiveTab('rooms')}
              className={`w-full text-left px-3.5 py-3 rounded-2xl flex items-center gap-2.5 text-xs font-semibold transition ${
                activeTab === 'rooms'
                  ? 'bg-royal-950 text-gold-300 shadow-md font-bold'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Rooms, Pricing & Photos</span>
            </button>

            <button
              onClick={() => setActiveTab('tourism')}
              className={`w-full text-left px-3.5 py-3 rounded-2xl flex items-center gap-2.5 text-xs font-semibold transition ${
                activeTab === 'tourism'
                  ? 'bg-royal-950 text-gold-300 shadow-md font-bold'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Nearby Attractions</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`w-full text-left px-3.5 py-3 rounded-2xl flex items-center gap-2.5 text-xs font-semibold transition ${
                activeTab === 'security'
                  ? 'bg-royal-950 text-gold-300 shadow-md font-bold'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>Account & Security</span>
            </button>
          </div>

          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 text-center">
            Hotel Admin Dashboard v2.0
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col">
          {/* TAB 1: Customer Bookings Table */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold font-serif text-slate-900">
                  Guest Bookings & Reservations
                </h2>
                <p className="text-xs text-slate-500">
                  All customer bookings made on your website appear here automatically.
                </p>
              </div>

              {/* Stats Overview Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gold-100 flex items-center justify-center text-gold-700">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">Total Direct Bookings</span>
                    <span className="text-2xl font-bold text-slate-900">{bookings.length}</span>
                  </div>
                </div>

                <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-emerald-800 block">Total Expected Revenue</span>
                    <span className="text-2xl font-bold font-serif text-emerald-900">
                      {hotelData.currency}{totalRevenue.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-blue-800 block">Confirmed Stays</span>
                    <span className="text-2xl font-bold text-blue-900">{pendingCheckins}</span>
                  </div>
                </div>
              </div>

              {/* Bookings Table */}
              {bookings.length === 0 ? (
                <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                  <Calendar className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                  <p className="font-semibold text-slate-700 text-sm">No reservations received yet</p>
                  <p className="text-xs text-slate-400 mt-1">
                    When someone books a room on your website, it will show up here immediately.
                  </p>
                </div>
              ) : (
                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                          <th className="py-3.5 px-4">Ref ID</th>
                          <th className="py-3.5 px-4">Guest Information</th>
                          <th className="py-3.5 px-4">Room Booked</th>
                          <th className="py-3.5 px-4">Check-In / Out</th>
                          <th className="py-3.5 px-4">Amount</th>
                          <th className="py-3.5 px-4">Status</th>
                          <th className="py-3.5 px-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {bookings.map((b) => (
                          <tr key={b.id} className="hover:bg-gold-50/40 transition">
                            <td className="py-4 px-4 font-mono font-bold text-slate-900">
                              {b.id}
                              <div className="text-[10px] text-slate-400 font-sans font-normal">
                                {b.bookingDate || 'Recent'}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="font-bold text-slate-900 text-sm">{b.guestName}</div>
                              <div className="text-slate-500 flex items-center gap-1 mt-0.5">
                                <Phone className="w-3 h-3 text-gold-600" />
                                <span>{b.guestPhone}</span>
                              </div>
                              <div className="text-slate-400 flex items-center gap-1">
                                <Mail className="w-3 h-3 text-slate-400" />
                                <span>{b.guestEmail}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4 font-semibold text-slate-800">
                              <span className="bg-slate-100 px-2 py-1 rounded-md">
                                {b.roomName}
                              </span>
                              <div className="text-[11px] text-slate-400 mt-1">
                                {b.guestsCount} Guests • {b.roomsCount || 1} Room
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="font-medium text-slate-800">
                                {b.checkIn} to {b.checkOut}
                              </div>
                              <div className="text-[11px] text-slate-500 font-medium">
                                {b.nights} night(s)
                              </div>
                              {b.specialRequest && b.specialRequest !== 'None' && (
                                <div className="text-[10px] text-amber-700 italic mt-0.5">
                                  Req: "{b.specialRequest}"
                                </div>
                              )}
                            </td>
                            <td className="py-4 px-4">
                              <div className="font-bold font-serif text-slate-900 text-sm">
                                {hotelData.currency}{b.grandTotal?.toLocaleString('en-IN')}
                              </div>
                              <div className="text-[10px] text-emerald-600 font-semibold">Pay at Hotel</div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Confirmed</span>
                              </span>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <button
                                onClick={() => deleteBooking(b.id)}
                                className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                                title="Remove booking"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Hotel Details Editor */}
          {activeTab === 'hotel' && (
            <form onSubmit={handleSaveCMS} className="space-y-6 max-w-3xl">
              <div>
                <h2 className="text-2xl font-bold font-serif text-slate-900">
                  Hotel Profile & Contact Info
                </h2>
                <p className="text-xs text-slate-500">
                  Update your hotel's name, city, address, phone number, and tagline.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Hotel Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleHotelChange}
                      required
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      City / Location
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleHotelChange}
                      required
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tagline (Shown on Website)
                  </label>
                  <input
                    type="text"
                    name="tagline"
                    value={formData.tagline || ''}
                    onChange={handleHotelChange}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Hero Subtitle / Description ("...Pink City" Line)
                  </label>
                  <textarea
                    rows="2"
                    name="subTagline"
                    value={formData.subTagline || ''}
                    onChange={handleHotelChange}
                    placeholder="e.g. A majestic oasis of Rajputana grandeur, modern luxury, and warm royal hospitality in the heart of Jodhpur."
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:outline-none resize-none"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    This line is displayed prominently right under the hotel name on the main homepage banner.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Full Hotel Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleHotelChange}
                    required
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Reception Phone
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleHotelChange}
                      required
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      WhatsApp Number
                    </label>
                    <input
                      type="text"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleHotelChange}
                      required
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleHotelChange}
                      required
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="py-3 px-8 bg-gold-500 hover:bg-gold-600 text-royal-950 font-bold text-sm rounded-xl shadow-lg transition flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Hotel Details</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* TAB 3: Rooms, Pricing & Photos */}
          {activeTab === 'rooms' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold font-serif text-slate-900">
                  Rooms, Pricing & Photos
                </h2>
                <p className="text-xs text-slate-500">
                  Change rate per day, room specifications, and upload new room photos.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {formData.rooms.map((room, idx) => (
                  <div
                    key={room.id}
                    className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <div>
                        <span className="text-[10px] font-bold text-gold-600 uppercase tracking-wider">
                          Category {idx + 1}
                        </span>
                        <h3 className="font-bold font-serif text-slate-900 text-lg">
                          {room.name}
                        </h3>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-royal-950 text-gold-300">
                        {room.badge}
                      </span>
                    </div>

                    {/* Room Image Preview & Uploader */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Room Photo Preview
                      </label>
                      <div className="relative h-44 rounded-xl overflow-hidden border border-slate-200 mb-2">
                        <img
                          src={room.image}
                          alt={room.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={room.image}
                          onChange={(e) => handleRoomChange(idx, 'image', e.target.value)}
                          placeholder="Paste Image URL"
                          className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:outline-none"
                        />
                        <label className="cursor-pointer py-2 px-3 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition border border-slate-300 flex-shrink-0">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload File</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageFileUpload(idx, e)}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Rate & Specs */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Rate Per Day (₹)
                        </label>
                        <input
                          type="number"
                          value={room.price}
                          onChange={(e) => handleRoomChange(idx, 'price', e.target.value)}
                          className="w-full px-3 py-2 text-sm font-bold text-slate-900 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-gold-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Room Size
                        </label>
                        <input
                          type="text"
                          value={room.size}
                          onChange={(e) => handleRoomChange(idx, 'size', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-gold-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        View / Bed Type
                      </label>
                      <input
                        type="text"
                        value={room.view}
                        onChange={(e) => handleRoomChange(idx, 'view', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-gold-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Room Description
                      </label>
                      <textarea
                        rows="2"
                        value={room.description}
                        onChange={(e) => handleRoomChange(idx, 'description', e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-gold-500 focus:outline-none resize-none"
                      ></textarea>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSaveCMS}
                  className="py-3 px-8 bg-gold-500 hover:bg-gold-600 text-royal-950 font-bold text-sm rounded-xl shadow-lg transition flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Room Prices & Photos</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: Nearby Tourism Places */}
          {activeTab === 'tourism' && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold font-serif text-slate-900">
                    Nearby Tourist Attractions
                  </h2>
                  <p className="text-xs text-slate-500">
                    Add or modify monuments and distance recommendations shown to guests.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddSpot}
                  className="py-2.5 px-4 bg-royal-950 hover:bg-royal-900 text-gold-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Tourist Spot</span>
                </button>
              </div>

              <div className="space-y-4">
                {formData.nearbyAttractions.map((spot, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center gap-4"
                  >
                    <img
                      src={spot.image}
                      alt={spot.name}
                      className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                    />

                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                          Monument Name
                        </label>
                        <input
                          type="text"
                          value={spot.name}
                          onChange={(e) => handleSpotChange(idx, 'name', e.target.value)}
                          className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                          Distance / Drive Time
                        </label>
                        <input
                          type="text"
                          value={spot.distance}
                          onChange={(e) => handleSpotChange(idx, 'distance', e.target.value)}
                          className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                          Photo URL
                        </label>
                        <input
                          type="text"
                          value={spot.image}
                          onChange={(e) => handleSpotChange(idx, 'image', e.target.value)}
                          className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteSpot(idx)}
                      className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                      title="Delete attraction"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSaveCMS}
                  className="py-3 px-8 bg-gold-500 hover:bg-gold-600 text-royal-950 font-bold text-sm rounded-xl shadow-lg transition flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Tourism Places</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: Account Security & Google Link */}
          {activeTab === 'security' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h2 className="text-2xl font-bold font-serif text-slate-900">
                  Account Credentials & Security
                </h2>
                <p className="text-xs text-slate-500">
                  Link your personal Google ID for 1-click access and change your temporary password.
                </p>
              </div>

              {securityMsg && (
                <div className="p-3.5 bg-gold-50 border border-gold-300 rounded-xl text-gold-950 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gold-600 flex-shrink-0" />
                  <span>{securityMsg}</span>
                </div>
              )}

              {/* 1. Google Link Card */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                    <LinkIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Link Your Google Account</h3>
                    <p className="text-xs text-slate-500">
                      Link your Google email so you can log in directly using "Continue with Google".
                    </p>
                  </div>
                </div>

                {currentUser?.isGoogleLinked ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>
                      Linked with: <strong>{currentUser.linkedGoogleEmail || currentUser.email}</strong>.
                      You can now log in using the "Continue with Google" button!
                    </span>
                  </div>
                ) : (
                  <form onSubmit={handleLinkGoogle} className="space-y-3 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Your Personal Gmail
                      </label>
                      <input
                        type="email"
                        required
                        value={googleEmailInput}
                        onChange={(e) => setGoogleEmailInput(e.target.value)}
                        placeholder="owner.hotel@gmail.com"
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-gold-500 focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="py-2.5 px-5 bg-royal-950 hover:bg-black text-gold-400 font-bold text-xs rounded-xl transition flex items-center gap-2"
                    >
                      <LinkIcon className="w-3.5 h-3.5" />
                      <span>Link Google Account Now</span>
                    </button>
                  </form>
                )}
              </div>

              {/* 2. Change Password Card */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Update Password</h3>
                    <p className="text-xs text-slate-500">
                      Replace the temporary password provided by your agency.
                    </p>
                  </div>
                </div>

                <form onSubmit={handlePasswordSubmit} className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-gold-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-gold-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="py-2.5 px-5 bg-gold-500 hover:bg-gold-600 text-royal-950 font-bold text-xs rounded-xl shadow transition"
                  >
                    Update Password
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
