import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const occasions = [
  { emoji: '🎂', label: 'Birthdays' },
  { emoji: '💍', label: 'Anniversaries' },
  { emoji: '❤️', label: "Valentine's Day" },
  { emoji: '🎄', label: 'Christmas' },
  { emoji: '🪔', label: 'Diwali' },
  { emoji: '🎆', label: 'New Year' },
  { emoji: '🌸', label: 'Festivals' },
  { emoji: '🎓', label: 'Graduation' },
  { emoji: '🤝', label: 'Friendship' },
  { emoji: '💌', label: 'Personal Messages' },
  { emoji: '📦', label: 'Time Capsules' },
  { emoji: '✨', label: 'Custom Occasions' },
];

export default function PerfectFor() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Perfect For Every Occasion
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Whatever the moment, make it magical.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {occasions.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Link
                to="/create"
                className="glass rounded-xl p-5 text-center hover:bg-white/10 transition-all block group cursor-pointer"
              >
                <span className="text-3xl block mb-2 group-hover:scale-125 transition-transform inline-block">
                  {item.emoji}
                </span>
                <span className="text-white/70 text-sm font-medium group-hover:text-white transition-colors">
                  {item.label}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
