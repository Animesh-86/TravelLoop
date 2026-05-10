/* ────────────────────────────────────────────
   LandingPage — First page of the app
   Full-screen hero, glassmorphism, destination cards
   ──────────────────────────────────────────── */

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin, Plane, Hotel, Car, Calendar, Star, Heart,
  Wifi, UtensilsCrossed, BedDouble, Waves, ChevronRight,
  Sparkles, Shield, Clock, Users,
} from 'lucide-react';
import { useState } from 'react';

/* ── Destination data ── */
const DESTINATIONS = [
  {
    name: 'Romantic Paris Getaway',
    location: 'Paris, France',
    image: '/images/paris.png',
    rating: 4.8,
    description:
      'Explore the city of love with its iconic landmarks, charming cafés, and world-class art museums. Perfect for couples and culture enthusiasts.',
    tags: ['Culture', 'Food', 'Art'],
    amenities: ['Free Wi-Fi', 'Kitchen', '4 Beds'],
    price: 180,
    duration: '5 Days',
  },
  {
    name: 'Tropical Bali Retreat',
    location: 'Bali, Indonesia',
    image: '/images/bali.png',
    rating: 4.6,
    description:
      'Discover lush rice terraces, ancient temples, and pristine beaches. A tropical paradise offering relaxation and adventure in equal measure.',
    tags: ['Beach', 'Spa', 'Adventure'],
    amenities: ['Pool', 'Massage', 'Central'],
    price: 95,
    duration: '7 Days',
  },
  {
    name: 'Santorini Island Escape',
    location: 'Santorini, Greece',
    image: '/images/santorini.png',
    rating: 4.7,
    description:
      'Wander through whitewashed villages, watch spectacular sunsets over the caldera, and savor exquisite Mediterranean cuisine by the sea.',
    tags: ['Sunset', 'Romantic', 'Cruise'],
    amenities: ['Free Wi-Fi', 'Restaurant', '2 Beds'],
    price: 205,
    duration: '4 Days',
  },
  {
    name: 'Neon Tokyo Adventure',
    location: 'Tokyo, Japan',
    image: '/images/tokyo.png',
    rating: 4.9,
    description:
      'Immerse yourself in the electrifying blend of ancient tradition and cutting-edge modernity. From temples to tech, Tokyo has it all.',
    tags: ['Culture', 'Food', 'Nightlife'],
    amenities: ['Free Wi-Fi', 'Room', 'Central'],
    price: 150,
    duration: '6 Days',
  },
];

const CATEGORIES = [
  { name: 'Destinations', icon: MapPin },
  { name: 'Experiences', icon: Sparkles },
  { name: 'Events', icon: Calendar },
];

const FEATURES = [
  { icon: Sparkles, title: 'AI-Powered Planning', desc: 'Let our AI craft your perfect itinerary in seconds' },
  { icon: Shield, title: 'Budget Tracking', desc: 'Keep your spending in check with real-time budget tools' },
  { icon: Clock, title: 'Smart Scheduling', desc: 'Day-by-day itineraries optimized for your travel style' },
  { icon: Users, title: 'Collaborate Live', desc: 'Plan together with friends using real-time editing' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Destinations');
  const [liked, setLiked] = useState({});

  const toggleLike = (i) => setLiked((p) => ({ ...p, [i]: !p[i] }));

  return (
    <div className="min-h-screen bg-[#0a0a0a] overflow-x-hidden">
      {/* ═══════════════════════════════════════════════
          HERO SECTION
         ═══════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/images/hero-bg.png"
            alt="Travel destination"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-[#0a0a0a]" />
        </div>

        {/* ── Navbar ── */}
        <nav className="relative z-20 px-6 lg:px-12 py-5">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Plane className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-xl font-bold text-white tracking-tight">
                TravelLoop
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="hidden md:flex items-center gap-8 text-sm text-white/80"
            >
              <a href="#destinations" className="hover:text-white transition-colors">Destinations</a>
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#community" className="hover:text-white transition-colors">Community</a>
              <a href="#about" className="hover:text-white transition-colors">About</a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3"
            >
              <button
                onClick={() => navigate('/login')}
                className="text-sm text-white/80 hover:text-white transition-colors hidden sm:block"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="px-5 py-2.5 rounded-full bg-white text-neutral-900 text-sm font-semibold
                           hover:bg-white/90 transition-colors shadow-lg"
              >
                Register
              </button>
            </motion.div>
          </div>
        </nav>

        {/* ── Hero Content (glassmorphism card) ── */}
        <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="max-w-3xl text-center"
          >
            {/* Glass card */}
            <div className="p-10 lg:p-14 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20
                            shadow-[0_8px_64px_rgba(0,0,0,0.3)]">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
              >
                Start Your Journey to Your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F4A261] to-[#E8956F]">
                  Dream Destination
                </span>{' '}
                Here.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="text-white/70 text-sm md:text-base leading-relaxed max-w-xl mx-auto mb-8"
              >
                Discover stunning locations, plan with ease, and create memories that last a lifetime.
                Whether it's a relaxing escape or an exciting adventure, your perfect getaway begins right here.
              </motion.p>

              {/* Category pills */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap items-center justify-center gap-3"
              >
                {CATEGORIES.map(({ name, icon: Icon }) => (
                  <button
                    key={name}
                    onClick={() => setActiveCategory(name)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium
                               transition-all duration-300
                               ${activeCategory === name
                                 ? 'bg-white text-neutral-900 shadow-lg'
                                 : 'bg-white/10 text-white/80 hover:bg-white/20 border border-white/20'
                               }`}
                  >
                    <Icon className="w-4 h-4" />
                    {name}
                  </button>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* ── Scroll indicator ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="relative z-10 flex justify-center pb-8"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center pt-1.5"
          >
            <div className="w-1.5 h-3 rounded-full bg-white/50" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════
          DESTINATIONS SECTION
         ═══════════════════════════════════════════════ */}
      <section id="destinations" className="relative px-6 lg:px-12 py-20">
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-10"
          >
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-1">
                Best destinations in{' '}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-base">
                  <MapPin className="w-4 h-4 text-[#E8956F]" /> World
                </span>
              </h2>
              <p className="text-white/50 text-sm mt-2">Curated experiences for every kind of traveler</p>
            </div>
            <button
              onClick={() => navigate('/signup')}
              className="hidden md:flex items-center gap-1 text-sm text-[#E8956F] hover:text-[#F4A261] transition-colors"
            >
              View all <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>

          {/* Destination Cards — horizontal scroll */}
          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide
                          -mx-6 px-6 lg:-mx-0 lg:px-0">
            {DESTINATIONS.map((dest, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex-shrink-0 w-[300px] rounded-2xl bg-white/[0.07] backdrop-blur-sm
                           border border-white/10 overflow-hidden snap-start
                           hover:bg-white/[0.12] transition-all duration-300 group"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Rating badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full
                                  bg-black/40 backdrop-blur-md text-xs">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-white font-medium">{dest.rating}/5</span>
                  </div>
                  {/* Heart */}
                  <button
                    onClick={() => toggleLike(i)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 backdrop-blur-md
                               flex items-center justify-center hover:bg-black/50 transition-colors"
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${
                        liked[i] ? 'text-red-400 fill-red-400' : 'text-white/80'
                      }`}
                    />
                  </button>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-display text-lg font-bold text-white mb-1 truncate">
                    {dest.name}
                  </h3>
                  <p className="text-white/50 text-xs mb-3 line-clamp-3 leading-relaxed">
                    {dest.description}
                  </p>

                  {/* Amenity tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {dest.amenities.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/[0.08]
                                   text-[11px] text-white/70 border border-white/10"
                      >
                        {tag === 'Free Wi-Fi' && <Wifi className="w-3 h-3" />}
                        {tag === 'Kitchen' && <UtensilsCrossed className="w-3 h-3" />}
                        {tag === '4 Beds' && <BedDouble className="w-3 h-3" />}
                        {tag === '2 Beds' && <BedDouble className="w-3 h-3" />}
                        {tag === 'Pool' && <Waves className="w-3 h-3" />}
                        {tag === 'Restaurant' && <UtensilsCrossed className="w-3 h-3" />}
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* More tags */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {dest.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-full bg-white/[0.06] text-[11px]
                                   text-white/60 border border-white/[0.08]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Price */}
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-2xl font-bold text-white">${dest.price}</span>
                      <span className="text-white/40 text-sm">/night</span>
                    </div>
                    <span className="text-xs text-white/40">{dest.duration}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          FEATURES SECTION
         ═══════════════════════════════════════════════ */}
      <section id="features" className="px-6 lg:px-12 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-3">
              Why <span className="text-[#E8956F]">TravelLoop</span>?
            </h2>
            <p className="text-white/50 text-sm max-w-md mx-auto">
              Everything you need to plan, track, and share your perfect trip
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-white/[0.05] border border-white/10
                           hover:bg-white/[0.08] transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2D5F5D] to-[#1a4a48]
                                flex items-center justify-center mb-4 shadow-lg
                                group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display font-bold text-white mb-2">{title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CTA SECTION
         ═══════════════════════════════════════════════ */}
      <section className="px-6 lg:px-12 py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative p-10 lg:p-16 rounded-3xl bg-gradient-to-br from-[#2D5F5D] to-[#1a4a48]
                        overflow-hidden text-center"
          >
            {/* Decorative shapes */}
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/5" />
            <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-white/5" />

            <div className="relative z-10">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Explore the World?
              </h2>
              <p className="text-white/70 text-sm md:text-base mb-8 max-w-lg mx-auto">
                Join thousands of travelers who plan smarter, spend less, and experience more with TravelLoop.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => navigate('/signup')}
                  className="px-8 py-4 rounded-full bg-white text-neutral-900 font-bold
                             hover:bg-white/90 transition-colors shadow-xl text-sm"
                >
                  Get Started — It's Free
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="px-8 py-4 rounded-full border border-white/30 text-white font-semibold
                             hover:bg-white/10 transition-colors text-sm"
                >
                  Sign In
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          PARTNER LOGOS
         ═══════════════════════════════════════════════ */}
      <section className="px-6 lg:px-12 py-12 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-white/30 text-xs mb-6 tracking-widest uppercase">
            Trusted by top travel platforms
          </p>
          <div className="flex items-center justify-center gap-10 md:gap-16 flex-wrap opacity-40">
            {['Booking.com', 'Airbnb', 'Expedia', 'Tripadvisor', 'Outdoorsy'].map((name) => (
              <span
                key={name}
                className="font-display text-lg md:text-xl font-bold text-white whitespace-nowrap"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          FOOTER
         ═══════════════════════════════════════════════ */}
      <footer id="about" className="px-6 lg:px-12 py-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#2D5F5D] flex items-center justify-center">
              <Plane className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-lg font-bold text-white">TravelLoop</span>
          </div>

          <div className="flex items-center gap-8 text-sm text-white/40">
            <a href="#" className="hover:text-white/70 transition-colors">Privacy</a>
            <a href="#" className="hover:text-white/70 transition-colors">Terms</a>
            <a href="#" className="hover:text-white/70 transition-colors">Contact</a>
          </div>

          <p className="text-xs text-white/30">
            © 2026 TravelLoop. Built with ❤️ for travelers.
          </p>
        </div>
      </footer>
    </div>
  );
}
