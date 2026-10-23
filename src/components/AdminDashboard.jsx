import React, { useState } from 'react';
import {
  X,
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
  RefreshCw,
} from 'lucide-react';
import { useHotel } from '../context/HotelContext';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard({ isOpen, onClose }) {
  const { hotelData, updateHotelData, bookings, deleteBooking } = useHotel();
  const { currentUser, linkGoogleAccount, changePassword } = useAuth();

  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings', 'hotel', 'rooms', 'tourism', 'security'
  const [formData, setFormData] = useState({ ...hotelData });
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saveError, setSaveError] = useState('');

  // Keep formData in sync when hotelData updates
  React.useEffect(() => {
    setFormData({ ...hotelData });
  }, [hotelData]);

  // Security state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityMsg, setSecurityMsg] = useState('');
  const [googleEmailInput, setGoogleEmailInput] = useState(
    currentUser?.linkedGoogleEmail || currentUser?.email || ''
  );

  if (!isOpen) return null;

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
      name: 'New Jaipur Monument',
      distance: '5 km (15 mins)',
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
    setSaveError('');
    try {
      await updateHotelData(formData);
      setSaveSuccess('All changes saved successfully! Website updated in real-time.');
      setTimeout(() => setSaveSuccess(''), 4000);
    } catch (error) {
      console.error('Could not save hotel settings:', error);
      setSaveError('Could not save changes. Please check your connection and permissions.');
    }
  };

  const handleDeleteBooking = async (id) => {
    setSaveError('');
    try {
      await deleteBooking(id);
    } catch (error) {
      console.error('Could not delete booking:', error);
      setSaveError('Could not delete this booking. Please check your connection and permissions.');
    }
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden border border-gold-500/40 flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="bg-royal-950 text-white p-5 sm:p-6 flex items-center justify-between border-b border-gold-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400">
              <Hotel className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold font-serif text-white">
                  Hotel Owner Management Portal
                </h3>
                <span className="text-[10px] bg-gold-500/20 text-gold-300 border border-gold-500/40 px-2 py-0.5 rounded-full font-bold">
                  {currentUser?.role === 'superadmin' ? 'SuperAdmin Mode' : 'Hotel Owner CMS'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Logged in as: <span className="text-slate-200 font-semibold">{currentUser?.email}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {saveSuccess && (
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{saveSuccess}</span>
              </span>
            )}
            {saveError && <span role="alert" className="text-xs text-red-300">{saveError}</span>}
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-royal-900 border-b border-white/10 px-6 flex items-center gap-2 overflow-x-auto text-xs font-semibold text-slate-300 no-scrollbar">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === 'bookings'
                ? 'border-gold-400 text-gold-400 font-bold'
                : 'border-transparent hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Customer Bookings ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('hotel')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === 'hotel'
                ? 'border-gold-400 text-gold-400 font-bold'
                : 'border-transparent hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Hotel Profile & Contact</span>
          </button>

          <button
            onClick={() => setActiveTab('rooms')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === 'rooms'
                ? 'border-gold-400 text-gold-400 font-bold'
                : 'border-transparent hover:text-white'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Rooms, Pricing & Photos</span>
          </button>

          <button
            onClick={() => setActiveTab('tourism')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === 'tourism'
                ? 'border-gold-400 text-gold-400 font-bold'
                : 'border-transparent hover:text-white'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Nearby Tourism Places</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === 'security'
                ? 'border-gold-400 text-gold-400 font-bold'
                : 'border-transparent hover:text-white'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Account, Password & Google Link</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
          {/* TAB 1: Customer Bookings Table */}
          {activeTab === 'bookings' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-bold font-serif text-slate-900">
                    Incoming Guest Bookings
                  </h4>
                  <p className="text-xs text-slate-500">
                    All direct online reservations made by users on this website.
                  </p>
                </div>
                <div className="text-xs font-semibold px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                  Total Revenue: {hotelData.currency}
                  {bookings.reduce((sum, b) => sum + (b.grandTotal || 0), 0).toLocaleString('en-IN')}
                </div>
              </div>

              {bookings.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                  <Calendar className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                  <p className="font-semibold text-slate-700">No bookings yet</p>
                  <p className="text-xs text-slate-400">
                    Customer reservations will appear here automatically.
                  </p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                          <th className="py-3 px-4">Ref ID</th>
                          <th className="py-3 px-4">Guest Contact</th>
                          <th className="py-3 px-4">Room Booked</th>
                          <th className="py-3 px-4">Dates / Nights</th>
                          <th className="py-3 px-4">Total Amount</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {bookings.map((b) => (
                          <tr key={b.id} className="hover:bg-gold-50/40 transition">
                            <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                              {b.id}
                              <div className="text-[10px] text-slate-400 font-sans font-normal">
                                {b.bookingDate || 'Recent'}
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-slate-900 text-sm">{b.guestName}</div>
                              <div className="text-slate-500">{b.guestPhone}</div>
                              <div className="text-slate-400">{b.guestEmail}</div>
                            </td>
                            <td className="py-3.5 px-4 font-semibold text-slate-800">
                              <span className="bg-slate-100 px-2 py-0.5 rounded">
                                {b.roomName}
                              </span>
                              <div className="text-[11px] text-slate-400 mt-1">
                                {b.guestsCount} Guests
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-medium text-slate-800">
                                {b.checkIn} to {b.checkOut}
                              </div>
                              <div className="text-[11px] text-slate-500">
                                {b.nights} night(s)
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-bold font-serif text-slate-900 text-sm">
                                {hotelData.currency}{b.grandTotal?.toLocaleString('en-IN')}
                              </div>
                              <div className="text-[10px] text-emerald-600">Pay at Hotel</div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Confirmed</span>
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => handleDeleteBooking(b.id)}
                                className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                                title="Delete"
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
            <form onSubmit={handleSaveCMS} className="space-y-5 max-w-3xl">
              <div>
                <h4 className="text-lg font-bold font-serif text-slate-900">
                  Hotel Profile & Branding
                </h4>
                <p className="text-xs text-slate-500">
                  Update your hotel's name, description, address, and contact numbers.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
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
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      City / State
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleHotelChange}
                      required
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tagline
                  </label>
                  <input
                    type="text"
                    name="tagline"
                    value={formData.tagline || ''}
                    onChange={handleHotelChange}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:outline-none"
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
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:outline-none resize-none"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    This line is displayed prominently right under the hotel name on the main homepage banner.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Full Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleHotelChange}
                    required
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleHotelChange}
                      required
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:outline-none"
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
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:outline-none"
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
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="py-2.5 px-6 bg-gold-500 hover:bg-gold-600 text-royal-950 font-bold text-xs rounded-xl shadow transition flex items-center gap-2"
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
                <h4 className="text-lg font-bold font-serif text-slate-900">
                  Room Categories, Rates & Photos
                </h4>
                <p className="text-xs text-slate-500">
                  Update rates per day and upload or paste new room photos.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {formData.rooms.map((room, idx) => (
                  <div
                    key={room.id}
                    className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-[10px] font-bold text-gold-600 uppercase tracking-wider">
                          Room Category {idx + 1}
                        </span>
                        <h5 className="font-bold font-serif text-slate-900 text-lg">
                          {room.name}
                        </h5>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-royal-950 text-gold-300">
                        {room.badge}
                      </span>
                    </div>

                    {/* Room Image Preview & Uploader */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Room Picture
                      </label>
                      <div className="relative h-44 rounded-xl overflow-hidden border border-slate-200 mb-2 group">
                        <img
                          src={room.image}
                          alt={room.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs">
                          Change photo below
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={room.image}
                          onChange={(e) => handleRoomChange(idx, 'image', e.target.value)}
                          placeholder="Paste Image URL"
                          className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none"
                        />
                        <label className="cursor-pointer py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition">
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

                    {/* Rate & Size */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Rate Per Day (₹)
                        </label>
                        <input
                          type="number"
                          value={room.price}
                          onChange={(e) => handleRoomChange(idx, 'price', e.target.value)}
                          className="w-full px-3 py-2 text-sm font-bold text-slate-900 border border-slate-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:outline-none"
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
                          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:outline-none"
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
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Description
                      </label>
                      <textarea
                        rows="2"
                        value={room.description}
                        onChange={(e) => handleRoomChange(idx, 'description', e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:outline-none resize-none"
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
                  <span>Save Room Prices & Images</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: Nearby Tourism Places */}
          {activeTab === 'tourism' && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-bold font-serif text-slate-900">
                    Nearby Jaipur Sightseeing Attractions
                  </h4>
                  <p className="text-xs text-slate-500">
                    Add or modify monuments and distance recommendations shown to guests.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddSpot}
                  className="py-2 px-3.5 bg-royal-950 hover:bg-royal-900 text-gold-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Tourist Spot</span>
                </button>
              </div>

              <div className="space-y-4">
                {formData.nearbyAttractions.map((spot, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center gap-4 shadow-sm"
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
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
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
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
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
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
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
                <h4 className="text-lg font-bold font-serif text-slate-900">
                  Account Credentials & Google Login Linking
                </h4>
                <p className="text-xs text-slate-500">
                  Link your personal Google ID for 1-click access and change your temporary password.
                </p>
              </div>

              {securityMsg && (
                <div className="p-3 bg-gold-50 border border-gold-300 rounded-xl text-gold-950 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gold-600 flex-shrink-0" />
                  <span>{securityMsg}</span>
                </div>
              )}

              {/* 1. Google Link Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                    <LinkIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">Link Your Google Account</h5>
                    <p className="text-xs text-slate-500">
                      Link your Google email so you can log in directly without entering your username/password.
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
                        Your Google Email
                      </label>
                      <input
                        type="email"
                        required
                        value={googleEmailInput}
                        onChange={(e) => setGoogleEmailInput(e.target.value)}
                        placeholder="owner.hotel@gmail.com"
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:outline-none"
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
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">Change Password</h5>
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
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:outline-none"
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
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:outline-none"
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
        </div>
      </div>
    </div>
  );
}
