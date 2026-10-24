import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, MessageSquare, ChevronRight, Phone, Hotel, HelpCircle } from 'lucide-react';
import { useHotel } from '../context/HotelContext';

export default function HotelRobot({ onOpenBooking }) {
  const { hotelData } = useHotel();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: `Khamma Ghani! 🙏 I am your 24/7 Hotel Concierge Robot at ${hotelData.name}. How can I assist you with your stay today?`,
      time: 'Just now',
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Quick Chips (Always visible & accessible)
  const quickQuestions = [
    'What are the room rates?',
    'Is breakfast & pool included?',
    'Rooftop restaurant details?',
    'Check-in & Check-out timing?',
    `Nearby ${hotelData.city.split(',')[0]} tourist places?`,
    'Do I need to pay online right now?',
  ];

  const handleSend = (textToSend = null) => {
    const q = (textToSend || inputVal).trim();
    if (!q) return;

    // User message
    const userMsg = {
      sender: 'user',
      text: q,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = generateAnswer(q.toLowerCase());
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: botResponse,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTyping(false);
    }, 400);
  };

  const generateAnswer = (query) => {
    const execRoom = hotelData.rooms.find((r) => r.id === 'executive-room') || hotelData.rooms[0];
    const premRoom = hotelData.rooms.find((r) => r.id === 'premium-room') || hotelData.rooms[1] || hotelData.rooms[0];

    if (query.includes('rate') || query.includes('price') || query.includes('cost') || query.includes('room') || query.includes('pese') || query.includes('kitna')) {
      return `We have 2 luxurious room categories available:\n\n1. 🛏️ ${execRoom.name}: ${hotelData.currency}${execRoom.price.toLocaleString('en-IN')}/day (${execRoom.bed}, ${execRoom.capacity})\n2. 👑 ${premRoom.name}: ${hotelData.currency}${premRoom.price.toLocaleString('en-IN')}/day (${premRoom.bed}, Balcony View)\n\nBoth categories include free royal breakfast, swimming pool access, and free 200 Mbps Wi-Fi!`;
    }

    if (query.includes('breakfast') || query.includes('food') || query.includes('nashta')) {
      return `☕ Yes! Complimentary Royal Buffet Breakfast is 100% FREE with every room booking. It features authentic Rajasthani delicacies, fresh juices, and Continental options served from 7:30 AM to 10:30 AM daily.`;
    }

    if (query.includes('pool') || query.includes('swim') || query.includes('swimming')) {
      return `🏊 Yes! Our outdoor Royal Azure Swimming Pool is free for all staying guests. Fresh pool towels and sun loungers are provided. Timings: 6:00 AM to 8:00 PM.`;
    }

    if (query.includes('rooftop') || query.includes('terrace') || query.includes('sunset') || query.includes('sky')) {
      return `🌅 Our rooftop offers lovely views across ${hotelData.city.split(',')[0]}.`;
    }

    if (query.includes('check') || query.includes('timing') || query.includes('time') || query.includes('early')) {
      return `⏰ Standard Check-in is from ${hotelData.checkInTime || '02:00 PM'} and Check-out is until ${hotelData.checkOutTime || '11:00 AM'}. If you require early check-in or late check-out, simply mention it in the special requests while booking!`;
    }

    if (query.includes('pay') || query.includes('advance') || query.includes('card') || query.includes('upi') || query.includes('gateway')) {
      return `💳 Zero advance payment is required! You can reserve your room right now with 1-click on our website and pay directly at the hotel reception during check-in via Cash, UPI, or Credit/Debit Card.`;
    }

    if (query.includes('tourist') || query.includes('places') || query.includes('sightseeing') || query.includes('hawa mahal') || query.includes('fort') || query.includes('near')) {
      const spots = hotelData.nearbyAttractions.map((s) => `• ${s.name} (${s.distance})`).join('\n');
      return `📍 We are located in ${hotelData.city}! Popular places nearby:\n${spots}\n\nPlease contact the hotel for local sightseeing help.`;
    }

    if (query.includes('address') || query.includes('location') || query.includes('contact') || query.includes('phone') || query.includes('number')) {
      return `🏨 ${hotelData.name}\n📍 Address: ${hotelData.address}\n📞 Phone: ${hotelData.phone}\n💬 WhatsApp: ${hotelData.whatsapp}`;
    }

    if (query.includes('book') || query.includes('reservation')) {
      return `You can book directly by clicking the "Book Online" button! You will need to log in or sign up first, choose your dates, and your booking reference is generated instantly without any payment.`;
    }

    return `Thank you for asking! For immediate personal assistance or customized requests, please call our 24/7 reception desk at ${hotelData.phone} or chat with us on WhatsApp at ${hotelData.whatsapp}.`;
  };

  return (
    <>
      {/* Floating Robot Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
        {!isOpen && (
          <div
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 bg-royal-950 text-gold-300 text-xs font-semibold py-2 px-3.5 rounded-full shadow-2xl border border-gold-500/40 cursor-pointer animate-fade-in hover:scale-105 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-spin" />
            <span>Ask Hotel Robot 24/7</span>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-royal-950 via-royal-900 to-gold-600 text-gold-400 hover:text-white flex items-center justify-center shadow-2xl border-2 border-gold-400 hover:scale-110 active:scale-95 transition-all duration-300 relative group"
          title="Open Hotel AI Robot"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <>
              <Bot className="w-7 h-7" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-royal-950 rounded-full animate-ping"></span>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-royal-950 rounded-full"></span>
            </>
          )}
        </button>
      </div>

      {/* Robot Chat Window Drawer */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-[400px] h-[580px] max-h-[82vh] bg-white rounded-3xl shadow-2xl border border-gold-500/40 flex flex-col overflow-hidden animate-fade-in">
          {/* Header (Never Shrinks) */}
          <div className="flex-shrink-0 bg-royal-950 text-white p-4 border-b border-gold-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gold-500/20 border border-gold-400 flex items-center justify-center text-gold-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold font-serif text-white flex items-center gap-1.5">
                  <span>Raj-Bot Concierge</span>
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
                </h4>
                <p className="text-[10px] text-gold-300 font-medium">{hotelData.name}</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center text-xs"
            >
              ✕
            </button>
          </div>

          {/* Chat Messages (Only this scrolls! min-h-0 ensures it never squashes quick chips) */}
          <div className="flex-1 min-h-0 p-4 overflow-y-auto space-y-3 bg-[#faf8f5] text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl whitespace-pre-line leading-relaxed shadow-sm ${
                    m.sender === 'user'
                      ? 'bg-gradient-to-r from-gold-500 to-amber-500 text-royal-950 font-medium rounded-br-none'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[9px] text-slate-400 mt-1 px-1">{m.time}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 p-2.5 rounded-2xl w-16 text-gold-600">
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:0.4s]"></span>
              </div>
            )}
            <div ref={chatBottomRef}></div>
          </div>

          {/* Quick Question Chips - Locked Container (flex-shrink-0) - ALWAYS perfectly visible whether 1 or 50 messages */}
          <div className="flex-shrink-0 bg-slate-50 border-t border-slate-200 px-3 py-2.5">
            <div className="flex items-center justify-between mb-1.5 px-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <HelpCircle className="w-3 h-3 text-gold-600" />
                <span>Suggested Questions</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Swipe ➔</span>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q)}
                  className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white hover:bg-gold-500 hover:text-royal-950 text-slate-700 border border-slate-200 hover:border-gold-500 text-[11px] font-medium transition shadow-xs flex-shrink-0 active:scale-95"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Input Bar (Never Shrinks) */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex-shrink-0 p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything about our hotel..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-gold-500"
            />
            <button
              type="submit"
              className="p-2 bg-gold-500 hover:bg-gold-600 text-royal-950 rounded-xl transition shadow"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
