// Hotel Configuration Data - Easily customizable for any hotel or client!
export const hotelConfig = {
  name: "The Royal Grand Palace",
  tagline: "Experience the Royal Heritage of Jaipur",
  subTagline: "A majestic oasis of Rajputana grandeur, modern luxury, and warm royal hospitality in the heart of the Pink City.",
  city: "Jaipur, Rajasthan",
  address: "Palace Road, Near C-Scheme & MI Road, Jaipur, Rajasthan 302001",
  phone: "+91 141 238 9000",
  whatsapp: "+91 98290 12345",
  email: "reservations@royalgrandpalacejaipur.com",
  rating: 4.9,
  reviewsCount: 384,
  currency: "₹",
  checkInTime: "02:00 PM",
  checkOutTime: "11:00 AM",
  
  heroImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80",
  gallery: [
    {
      title: "Royal Courtyard & Pool",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
      description: "Crystal clear waters surrounded by authentic Rajasthani jharokhas."
    },
    {
      title: "Rooftop Sky Lounge",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
      description: "Panoramic sunset view of the Aravalli hills and Pink City."
    },
    {
      title: "Royal Dining Hall",
      image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80",
      description: "Authentic Dal Baati Churma & royal Mughlai culinary delights."
    },
    {
      title: "Heritage Architecture",
      image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80",
      description: "Handcrafted marble carvings and vibrant courtyards."
    }
  ],

  // Key Amenities requested: Free Breakfast, Rooftop, Free Wi-Fi, Swimming Pool
  amenities: [
    {
      id: "breakfast",
      name: "Complimentary Royal Breakfast",
      description: "Lavish daily morning buffet with Rajasthani delicacies, fresh juices, fruits & Continental choices.",
      icon: "Coffee",
      badge: "Free"
    },
    {
      id: "rooftop",
      name: "Rooftop Sunset Lounge & Dining",
      description: "Dine under starry skies with candlelit tables, live folk music, and 360° views of Jaipur.",
      icon: "UtensilsCrossed",
      badge: "Highlight"
    },
    {
      id: "wifi",
      name: "High-Speed Free Wi-Fi",
      description: "Blazing 200 Mbps wireless connectivity available throughout all rooms, gardens, and lobby.",
      icon: "Wifi",
      badge: "Free"
    },
    {
      id: "pool",
      name: "Royal Swimming Pool",
      description: "Sparkling azure outdoor pool with sun loungers, cabanas, and poolside refreshment bar.",
      icon: "Waves",
      badge: "Included"
    },
    {
      id: "parking",
      name: "Free Valet Parking",
      description: "Secure 24x7 gated premises with complimentary valet service for all hotel guests.",
      icon: "Car",
      badge: "Free"
    },
    {
      id: "roomservice",
      name: "24/7 Room Service & Concierge",
      description: "Our royal hospitality team is at your disposal round the clock for travel help & in-room dining.",
      icon: "BellRing",
      badge: "24/7"
    }
  ],

  // 2 Types of Rooms requested:
  // 1. Executive Room: 2k per day
  // 2. Premium Room: 3k per day
  rooms: [
    {
      id: "executive-room",
      name: "Executive Room",
      badge: "Best Value",
      price: 2000,
      pricePeriod: "per day / night",
      size: "320 sq.ft",
      capacity: "2 Adults + 1 Child",
      bed: "King Bed or Twin Beds",
      view: "City / Courtyard View",
      image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=80",
      description: "Tastefully designed with classic Rajputana aesthetic and modern comfort. Ideal for business travelers, couples, or short leisure trips.",
      features: [
        "Complimentary Royal Breakfast",
        "High-Speed Free Wi-Fi (200 Mbps)",
        "Air Conditioning with Climate Control",
        "43\" Smart HD TV with OTT Apps",
        "Electric Kettle & Tea/Coffee Station",
        "En-suite Bathroom with Rain Shower",
        "Daily Housekeeping & Toiletries",
        "Access to Swimming Pool & Rooftop"
      ],
      maxGuests: 3
    },
    {
      id: "premium-room",
      name: "Premium Room",
      badge: "Most Popular",
      price: 3000,
      pricePeriod: "per day / night",
      size: "460 sq.ft",
      capacity: "3 Adults or 2 Adults + 2 Children",
      bed: "Grand Royal King Bed",
      view: "Heritage Garden / Palace View",
      image: "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1000&q=80",
      description: "Spacious luxury room featuring traditional hand-painted motifs, a private sitting jharokha balcony, and upgraded premium amenities.",
      features: [
        "Complimentary Royal Breakfast Buffet",
        "High-Speed Free Wi-Fi (200 Mbps)",
        "Private Balcony / Jharokha Seating",
        "Swimming Pool & Rooftop Sunset Access",
        "50\" 4K Ultra HD Smart TV",
        "Luxury Marble Bathroom with Soaking Tub",
        "Mini-Bar & Premium Snack Bar",
        "Complimentary Welcome Drink on Arrival",
        "Priority Early Check-in (Subject to availability)"
      ],
      maxGuests: 4
    }
  ],

  // Attractions nearby in Jaipur
  nearbyAttractions: [
    { name: "Hawa Mahal", distance: "3.2 km (10 mins)", image: "https://images.unsplash.com/photo-1609137144822-44161b96a928?auto=format&fit=crop&w=400&q=80" },
    { name: "City Palace", distance: "3.8 km (12 mins)", image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=400&q=80" },
    { name: "Amer Fort", distance: "11 km (25 mins)", image: "https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?auto=format&fit=crop&w=400&q=80" },
    { name: "Jantar Mantar", distance: "3.5 km (11 mins)", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=400&q=80" }
  ],

  // Frequently Asked Questions
  faqs: [
    {
      q: "Do I need to pay online right now to confirm booking?",
      a: "No! For your convenience, you can book online instantly with zero advance payment. You can pay directly at the hotel reception during check-in via Cash, UPI, or Card."
    },
    {
      q: "Is breakfast really complimentary?",
      a: "Yes, every booking made directly on our website includes complimentary royal breakfast for all registered room guests."
    },
    {
      q: "Are the swimming pool and rooftop lounge accessible to all guests?",
      a: "Yes, all our in-house guests get full access to the outdoor swimming pool and our rooftop restaurant & lounge."
    },
    {
      q: "What are the check-in and check-out timings?",
      a: "Our standard check-in time is 02:00 PM and check-out time is 11:00 AM. Early check-in or late check-out can be requested upon booking."
    },
    {
      q: "Is parking available for private cars?",
      a: "Yes, we provide 100% free secure valet parking on the hotel premises."
    }
  ]
};
