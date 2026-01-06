import { MapPin, Bell, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { currentUser } from '@/data/mockData';

export function Header() {
  return (
    <header className="px-4 pt-4 pb-2">
      <div className="flex items-center justify-between mb-4">
        <div>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-muted-foreground text-sm"
          >
            Good afternoon 👋
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl font-bold"
          >
            {currentUser.name.split(' ')[0]}
          </motion.h1>
        </div>
        
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
        >
          <Bell className="w-5 h-5 text-foreground" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-primary rounded-full" />
        </motion.button>
      </div>

      {/* Location */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-2 mb-4"
      >
        <MapPin className="w-4 h-4 text-primary" />
        <p className="text-sm text-muted-foreground">
          Deliver to <span className="font-semibold text-foreground">Wilson Hall, Room 312</span>
        </p>
      </motion.div>

      {/* Search bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative"
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search restaurants or food..."
          className="w-full h-12 pl-12 pr-4 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
        />
      </motion.div>
    </header>
  );
}
