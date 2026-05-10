import React from 'react';
import { motion } from 'motion/react';
import { Play, Info, Star, Clock, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FeaturedBanner: React.FC = () => {
  const navigate = useNavigate();

  // Static high-quality featured content
  const featured = {
    id: 'featured-1',
    title: 'Interstellar: The Final Frontier',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival. A cinematic masterpiece that explores the bond between a father and daughter across time and space.',
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=2072',
    rating: '9.8',
    match: '99%',
    year: '2024',
    duration: '2h 49m',
    genres: ['Sci-Fi', 'Drama', 'Adventure'],
    accent: '#8b5cf6'
  };

  const handlePlay = () => {
    navigate(`/watch?title=${encodeURIComponent(featured.title)}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full aspect-[21/9] md:aspect-[25/9] rounded-3xl overflow-hidden group shadow-2xl"
    >
      {/* Background Image with Parallax-like Zoom */}
      <div className="absolute inset-0">
        <img
          src={featured.image}
          alt={featured.title}
          className="w-full h-full object-cover transition-transform duration-[10s] ease-out group-hover:scale-110"
        />
        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/20 z-10" />
        
        {/* Animated Dust Particles or subtle overlay can go here */}
        <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] z-10" />
      </div>

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col justify-center px-8 md:px-16 max-w-3xl gap-4 md:gap-6">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2"
        >
          <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] md:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
            Featured Premiere
          </span>
          <span className="flex items-center gap-1 text-[#facc15] text-xs md:text-sm font-bold">
            <Star size={14} fill="currentColor" /> {featured.rating}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-6xl font-black text-white leading-tight drop-shadow-2xl"
        >
          {featured.title}
        </motion.h1>

        {/* Metadata */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-4 text-white/70 text-xs md:text-sm font-medium"
        >
          <span className="flex items-center gap-1.5"><Calendar size={14} /> {featured.year}</span>
          <span className="w-1 h-1 rounded-full bg-white/30" />
          <span className="flex items-center gap-1.5"><Clock size={14} /> {featured.duration}</span>
          <span className="w-1 h-1 rounded-full bg-white/30" />
          <div className="flex gap-2">
            {featured.genres.map(genre => (
              <span key={genre} className="px-2 py-0.5 bg-white/5 rounded border border-white/10">{genre}</span>
            ))}
          </div>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-white/60 text-sm md:text-lg leading-relaxed line-clamp-3 md:line-clamp-none max-w-2xl"
        >
          {featured.description}
        </motion.p>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex items-center gap-4 mt-2"
        >
          <button
            onClick={handlePlay}
            className="flex items-center gap-2 bg-white text-black px-6 md:px-8 py-3 rounded-xl font-bold hover:bg-white/90 transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          >
            <Play size={20} fill="currentColor" /> Play Now
          </button>
          <button className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 text-white px-6 md:px-8 py-3 rounded-xl font-bold hover:bg-white/20 transition-all active:scale-95">
            <Info size={20} /> More Info
          </button>
        </motion.div>
      </div>

      {/* Glossy Reflection Effect */}
      <div className="absolute inset-0 pointer-events-none z-30 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </motion.div>
  );
};

export default FeaturedBanner;