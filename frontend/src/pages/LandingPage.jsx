/* ────────────────────────────────────────────
   LandingPage — First page of the app
   Full-screen hero, glassmorphism, destination cards
   ──────────────────────────────────────────── */

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin, Plane, Hotel, Car, Calendar, Star, Heart,
  Wifi, UtensilsCrossed, BedDouble, Waves, ChevronRight,
  Sparkles, Shield, Clock, Users, MessageSquare, Briefcase
} from 'lucide-react';
import { useState } from 'react';
import useAuthStore from '../store/authStore';

/* ── Real Destination data (Indian Focused) ── */
const DESTINATIONS = [
  {
    name: 'Goa Beach Paradise',
    location: 'Goa, India',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1074&auto=format&fit=crop',
    rating: 4.9,
    description: 'Golden sands, vibrant shacks, and non-stop energy. The ultimate beach escape for relaxation and parties.',
    tags: ['Beach', 'Nightlife', 'Seafood'],
    amenities: ['Free Wi-Fi', 'Pool', 'Near Beach'],
    price: 4500,
    duration: '4 Days',
  },
  {
    name: 'Jaipur Pink City Tour',
    location: 'Jaipur, Rajasthan',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1074&auto=format&fit=crop',
    rating: 4.8,
    description: 'Explore the majestic forts, palaces, and colorful bazaars of Rajasthans historic capital.',
    tags: ['History', 'Forts', 'Culture'],
    amenities: ['Breakfast', 'City View', 'Guided Tour'],
    price: 3200,
    duration: '3 Days',
  },
  {
    name: 'Manali Snow Escape',
    location: 'Manali, Himachal',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1074&auto=format&fit=crop',
    rating: 4.7,
    description: 'Breathtaking mountains, adventure sports, and cozy cafes in the heart of the Himalayas.',
    tags: ['Mountains', 'Adventure', 'Snow'],
    amenities: ['Mountain View', 'Heating', 'Balcony'],
    price: 2800,
    duration: '5 Days',
  },
  {
    name: 'Mumbai City Lights',
    location: 'Mumbai, Maharashtra',
    image: 'https://images.unsplash.com/photo-1570160897040-3227d190ed47?q=80&w=1074&auto=format&fit=crop',
    rating: 4.6,
    description: 'Experience the city that never sleeps. From Marine Drive to Bollywood, the energy is unmatched.',
    tags: ['Urban', 'Food', 'Business'],
    amenities: ['Fast Wi-Fi', 'AC', 'Central'],
    price: 5500,
    duration: '2 Days',
  },
];

const FEATURES = [
  { icon: Sparkles, title: 'AI Genie Planner', desc: 'Our smart AI Genie crafts your perfect itinerary with packing tips in seconds.' },
  { icon: MessageSquare, title: 'Community Chat', desc: 'Connect with fellow travelers in real-time and share your experiences globally.' },
  { icon: Shield, title: 'Smart Budgeting', desc: 'Track every rupee spent with automated cost breakdowns and receipt scanning.' },
  { icon: Users, title: 'Real-time Collab', desc: 'Plan trips together with friends. See their changes live as they happen.' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [liked, setLiked] = useState({});

  const toggleLike = (i) => setLiked((p) => ({ ...p, [i]: !p[i] }));

  return (
    <div className="min-h-screen bg-[#0a0a0a] overflow-x-hidden">
      {/* ═══════════════════════════════════════════════
          HERO SECTION
         ═══════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col">
        {/* Background Image with Parallax effect */}
        <motion.div 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
            className="absolute inset-0"
        >
          <img
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop"
            alt="Travel destination"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-[#0a0a0a]" />
        </motion.div>

        {/* ── Navbar ── */}
        <nav className="relative z-20 px-6 lg:px-12 py-5">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
              onClick={() => navigate('/')}
              style={{ cursor: 'pointer' }}
            >
              <div className="w-10 h-10 rounded-xl bg-primary/80 backdrop-blur-md flex items-center justify-center shadow-lg shadow-primary/20">
                <Plane className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-2xl font-bold text-white tracking-tight">
                Travel<span className="text-primary">Loop</span>
              </span>
            </motion.div>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
              <a href="#destinations" className="hover:text-white transition-colors">Destinations</a>
              <a href="#features" className="hover:text-white transition-colors">AI Features</a>
              <a href="#community" className="hover:text-white transition-colors">Community</a>
            </div>

            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-1.5 pr-4 rounded-full border border-white/20">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs">
                        {user.fullName.charAt(0)}
                    </div>
                    <span className="text-white text-sm font-medium hidden sm:block">{user.fullName}</span>
                    <button onClick={() => navigate('/dashboard')} className="text-[10px] bg-primary px-2 py-1 rounded-full text-white font-bold uppercase tracking-wider">Dashboard</button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/login')}
                    className="text-sm text-white/80 hover:text-white transition-colors hidden sm:block"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => navigate('/signup')}
                    className="px-6 py-2.5 rounded-full bg-primary text-white text-sm font-bold
                               hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 active:scale-95"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        </nav>

        {/* ── Hero Content ── */}
        <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl text-center"
          >
            <div className="p-10 lg:p-16 rounded-[2.5rem] bg-black/40 backdrop-blur-2xl border border-white/10
                            shadow-[0_20px_80px_rgba(0,0,0,0.5)] relative overflow-hidden">
              
              {/* Animated sparkles background */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-20">
                  <motion.div animate={{ y: [0, -100] }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }} className="absolute top-0 left-1/4 w-1 h-1 bg-white rounded-full shadow-[0_0_10px_white]" />
                  <motion.div animate={{ y: [0, -150] }} transition={{ duration: 7, repeat: Infinity, ease: 'linear', delay: 2 }} className="absolute bottom-0 right-1/4 w-1 h-1 bg-primary rounded-full shadow-[0_0_10px_primary]" />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-8"
              >
                <Sparkles className="w-3 h-3" />
                AI-Powered Travel Experience
              </motion.div>

              <h1 className="font-display text-5xl md:text-7xl font-black text-white leading-[1.1] mb-6">
                Your Next Trip,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  Intelligently Planned.
                </span>
              </h1>

              <p className="text-white/60 text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-10">
                Stop juggling tabs. Use AI to craft itineraries, track budgets, and collaborate with friends in one seamless loop.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => navigate(isAuthenticated ? '/dashboard' : '/signup')}
                  className="w-full sm:w-auto px-10 py-4 rounded-full bg-primary text-white font-black
                             hover:bg-primary-dark transition-all shadow-2xl shadow-primary/30 flex items-center justify-center gap-2"
                >
                  {isAuthenticated ? 'Go to Dashboard' : 'Start Planning Free'}
                  <ChevronRight className="w-5 h-5" />
                </button>
                {!isAuthenticated && (
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full sm:w-auto px-10 py-4 rounded-full bg-white/5 border border-white/10 text-white font-bold
                                   hover:bg-white/10 transition-all backdrop-blur-md"
                    >
                        Sign in with Google
                    </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          DESTINATIONS SECTION
         ═══════════════════════════════════════════════ */}
      <section id="destinations" className="relative px-6 lg:px-12 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-black text-white mb-3">
                Explore <span className="text-primary">Popular</span> In India
              </h2>
              <p className="text-white/40 text-sm max-w-md">Trending destinations carefully curated for your next adventure.</p>
            </div>
            <button
              onClick={() => navigate('/search')}
              className="flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all"
            >
              Explore all destinations <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {DESTINATIONS.map((dest, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className="group relative rounded-[2rem] bg-white/[0.03] border border-white/5 overflow-hidden transition-all duration-500"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60" />
                  
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full
                                  bg-black/60 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    {dest.rating}
                  </div>
                </div>

                <div className="p-6 relative">
                  <div className="flex items-center gap-1.5 text-primary text-[10px] font-bold uppercase tracking-widest mb-2">
                    <MapPin className="w-3 h-3" />
                    {dest.location}
                  </div>
                  <h3 className="font-display text-xl font-black text-white mb-2 group-hover:text-primary transition-colors">
                    {dest.name}
                  </h3>
                  <p className="text-white/40 text-xs leading-relaxed mb-6 line-clamp-2">
                    {dest.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-white font-black text-lg">₹{dest.price}</span>
                        <span className="text-[10px] text-white/30 uppercase font-bold">Avg. / person</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-white/50 bg-white/5 px-2 py-1 rounded-lg">
                        <Clock className="w-3 h-3" />
                        {dest.duration}
                    </div>
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
      <section id="features" className="px-6 lg:px-12 py-24 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.span 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="text-primary font-black text-xs uppercase tracking-[0.3em]"
            >
                Powerful Ecosystem
            </motion.span>
            <h2 className="font-display text-4xl md:text-5xl font-black text-white mt-4 mb-4">
              Everything in One <span className="text-primary">Loop</span>.
            </h2>
            <p className="text-white/40 text-base max-w-xl mx-auto leading-relaxed">
              We replaced your spreadsheet, your notes app, and your group chat with one intelligent dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-[2rem] bg-white/[0.03] border border-white/5 hover:border-primary/30 transition-all group"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-dark
                                flex items-center justify-center mb-6 shadow-xl shadow-primary/20
                                group-hover:rotate-6 transition-transform">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-3">{title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CTA SECTION
         ═══════════════════════════════════════════════ */}
      <section className="px-6 lg:px-12 py-32">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative p-12 lg:p-24 rounded-[3rem] bg-gradient-to-br from-primary to-primary-dark
                        overflow-hidden text-center shadow-[0_32px_128px_rgba(45,95,93,0.3)]"
          >
            {/* Massive decorative background text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/5 font-black text-[20vw] whitespace-nowrap pointer-events-none select-none">
                TRAVELLOOP
            </div>

            <div className="relative z-10">
              <h2 className="font-display text-4xl md:text-6xl font-black text-white mb-6">
                Ready to plan <br className="hidden md:block" /> like a pro?
              </h2>
              <p className="text-white/70 text-base md:text-lg mb-10 max-w-xl mx-auto font-medium">
                Join our community of 50,000+ travelers today. No credit card required.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => navigate(isAuthenticated ? '/dashboard' : '/signup')}
                  className="w-full sm:w-auto px-12 py-5 rounded-full bg-white text-primary font-black
                             hover:scale-105 transition-all shadow-2xl shadow-black/20 text-lg"
                >
                  {isAuthenticated ? 'Enter Dashboard' : 'Get Started Now'}
                </button>
                {!isAuthenticated && (
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full sm:w-auto px-12 py-5 rounded-full border-2 border-white/30 text-white font-bold
                                   hover:bg-white/10 transition-all text-lg backdrop-blur-md"
                    >
                        Sign In
                    </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          FOOTER
         ═══════════════════════════════════════════════ */}
      <footer id="about" className="px-6 lg:px-12 py-16 border-t border-white/5 bg-black/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                        <Plane className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-display text-2xl font-bold text-white">TravelLoop</span>
                </div>
                <p className="text-white/40 text-sm max-w-sm leading-relaxed mb-8">
                    The world's first AI-integrated travel planning platform designed for modern explorers. Plan, budget, and collaborate with ease.
                </p>
                <div className="flex items-center gap-4">
                    {/* Social icons placeholder */}
                    {[1, 2, 3, 4].map(i => <div key={i} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10" />)}
                </div>
            </div>
            
            <div>
                <h4 className="text-white font-bold mb-6">Platform</h4>
                <ul className="space-y-4 text-white/40 text-sm font-medium">
                    <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">AI Planner</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Community</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                </ul>
            </div>

            <div>
                <h4 className="text-white font-bold mb-6">Support</h4>
                <ul className="space-y-4 text-white/40 text-sm font-medium">
                    <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">FAQs</a></li>
                </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-10 border-t border-white/5">
            <p className="text-xs text-white/30 font-medium">
              © 2026 TravelLoop. All rights reserved. Made in India 🇮🇳
            </p>
            <div className="flex items-center gap-8 text-xs text-white/30 font-medium tracking-widest uppercase">
                <span>Reliable</span>
                <span>Secure</span>
                <span>AI-Driven</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
