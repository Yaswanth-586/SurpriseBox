import { motion } from 'framer-motion';
import { Gift, Clock, Share2, PartyPopper } from 'lucide-react';

const steps = [
  {
    icon: Gift,
    title: 'Create your surprise',
    description: 'Choose an occasion, add a personal message, photos, and more.',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: Clock,
    title: 'Set when it unlocks',
    description: 'Pick the perfect moment — a birthday, anniversary, or any special date.',
    color: 'from-cyan-500 to-cyan-600',
  },
  {
    icon: Share2,
    title: 'Share the secret link',
    description: 'Send the unique link to your special person via any channel.',
    color: 'from-teal-500 to-teal-600',
  },
  {
    icon: PartyPopper,
    title: 'Watch it unfold',
    description: 'When the time comes, the box opens with a magical reveal.',
    color: 'from-indigo-500 to-indigo-600',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Four simple steps to create something unforgettable.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              className="glass rounded-2xl p-6 text-center hover:bg-white/10 transition-all group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                <step.icon className="w-7 h-7 text-white" />
              </div>
              <div className="text-white/30 text-sm font-medium mb-2">Step {i + 1}</div>
              <h3 className="text-white font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
