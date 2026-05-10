import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, BookOpen, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import axios from 'axios';
import { LineSkeleton } from '../ui/LoadingSkeleton';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export default function DestinationGuide({ cityName }) {
  const [guideData, setGuideData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedSection, setExpandedSection] = useState('Summary');

  useEffect(() => {
    if (!cityName) return;

    const fetchGuide = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await axios.get(`${API_BASE_URL}/cities/guide?city=${encodeURIComponent(cityName)}`);
        setGuideData(data);
        if (data && Object.keys(data).length > 0) {
          setExpandedSection(Object.keys(data)[0]);
        }
      } catch (err) {
        setError('Could not fetch destination guide. ' + (err.response?.data?.message || ''));
      } finally {
        setIsLoading(false);
      }
    };

    fetchGuide();
  }, [cityName]);

  // Icon mapping for sections
  const getSectionIcon = (section) => {
    const s = section.toLowerCase();
    if (s.includes('summary') || s.includes('understand')) return <BookOpen className="w-5 h-5 text-blue-500" />;
    if (s.includes('see')) return <MapPin className="w-5 h-5 text-emerald-500" />;
    if (s.includes('do')) return <BookOpen className="w-5 h-5 text-amber-500" />;
    if (s.includes('eat') || s.includes('drink')) return <Info className="w-5 h-5 text-rose-500" />;
    if (s.includes('sleep')) return <BookOpen className="w-5 h-5 text-indigo-500" />;
    if (s.includes('get in') || s.includes('around')) return <MapPin className="w-5 h-5 text-teal-500" />;
    return <Info className="w-5 h-5 text-neutral-500" />;
  };

  // Helper to format text with basic markdown-like list detection
  const formatContent = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      if (line.trim().startsWith('*') || line.trim().startsWith('-')) {
        return (
          <li key={idx} className="flex items-start gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-2 flex-shrink-0" />
            <span className="flex-1">{line.replace(/^[\*\-]\s*/, '')}</span>
          </li>
        );
      }
      if (line.trim() === '') return <br key={idx} />;
      return <p key={idx} className="mb-2">{line}</p>;
    });
  };

  if (!cityName) return null;

  return (
    <div className="mt-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-primary/20 text-white">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-display font-bold text-neutral-800 text-2xl">Travel Guide</h3>
          <p className="text-sm text-neutral-500">Curated insights from Wikivoyage for {cityName}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white/80 backdrop-blur-sm border border-neutral-200/50 rounded-3xl p-6 shadow-sm">
          <LineSkeleton count={6} />
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 flex items-center gap-3 text-sm">
          <Info className="w-5 h-5" /> {error}
        </div>
      ) : guideData && Object.keys(guideData).length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(guideData).map(([section, content]) => {
            if (section === 'Error') return null;
            const isSummary = section.toLowerCase().includes('summary') || section.toLowerCase().includes('understand');
            
            return (
              <motion.div 
                key={section}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white/80 backdrop-blur-sm border border-neutral-200/50 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow ${isSummary ? 'md:col-span-2' : ''}`}
              >
                <div className="p-5 border-b border-neutral-100/50 flex items-center gap-3 bg-neutral-50/30">
                  <div className="p-2 rounded-xl bg-white shadow-sm border border-neutral-100">
                    {getSectionIcon(section)}
                  </div>
                  <h4 className="font-display font-bold text-neutral-800 text-lg">{section}</h4>
                </div>
                <div className="p-5 text-sm text-neutral-600 leading-relaxed max-h-96 overflow-y-auto custom-scrollbar">
                  <ul className="space-y-1">
                    {formatContent(content)}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="bg-neutral-50 text-neutral-500 p-8 rounded-3xl border border-neutral-200/50 text-center italic">
          No detailed guide found for this destination.
        </div>
      )}
    </div>
  );
}
