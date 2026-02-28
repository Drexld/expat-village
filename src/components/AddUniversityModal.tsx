import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import type { StudentUniversityCreateInput } from '../services/api/types';

interface AddUniversityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: StudentUniversityCreateInput) => Promise<void>;
}

export function AddUniversityModal({ isOpen, onClose, onSubmit }: AddUniversityModalProps) {
  const [form, setForm] = useState<StudentUniversityCreateInput>({
    name: '',
    shortName: '',
    location: '',
    website: '',
    reason: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const name = form.name.trim();
    const shortName = form.shortName.trim();
    const location = form.location.trim();
    const website = (form.website || '').trim();
    const reason = (form.reason || '').trim();

    if (!name || !shortName || !location) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        name,
        shortName,
        location,
        website: website || undefined,
        reason: reason || undefined,
      });
      setForm({ name: '', shortName: '', location: '', website: '', reason: '' });
      onClose();

      if ('vibrate' in navigator) {
        navigator.vibrate([30, 50, 30]);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-end justify-center"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-t-[28px] p-[1px] bg-gradient-to-b from-white/30 to-white/10"
          >
            <div className="rounded-t-[28px] bg-gradient-to-b from-[#1a2642]/98 to-[#0f172a]/98 backdrop-blur-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Add a University</h3>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" strokeWidth={2} />
                </button>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <label className="text-xs text-white/70 mb-1 block">University Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Warsaw School of Economics"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 outline-none focus:border-[#3b9eff]/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs text-white/70 mb-1 block">Short Name / Abbreviation</label>
                  <input
                    type="text"
                    value={form.shortName}
                    onChange={(e) => setForm((prev) => ({ ...prev, shortName: e.target.value }))}
                    placeholder="e.g., SGH"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 outline-none focus:border-[#3b9eff]/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs text-white/70 mb-1 block">Location / Address</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g., al. Niepodleglosci 162"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 outline-none focus:border-[#3b9eff]/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs text-white/70 mb-1 block">Website (optional)</label>
                  <input
                    type="url"
                    value={form.website || ''}
                    onChange={(e) => setForm((prev) => ({ ...prev, website: e.target.value }))}
                    placeholder="e.g., sgh.waw.pl"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 outline-none focus:border-[#3b9eff]/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs text-white/70 mb-1 block">Why should this be added?</label>
                  <textarea
                    value={form.reason || ''}
                    onChange={(e) => setForm((prev) => ({ ...prev, reason: e.target.value }))}
                    placeholder="Help us understand why this university should be part of Student Hubs..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 outline-none focus:border-[#3b9eff]/50 transition-colors resize-none"
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#3b9eff]/10 border border-[#3b9eff]/20 mb-4">
                <p className="text-xs text-[#3b9eff] leading-relaxed">
                  <span className="font-semibold">AI will verify this submission</span> • You earn +25 points once approved • University appears after review
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => void handleSubmit()}
                  disabled={isSubmitting}
                  className="flex-1 py-3 rounded-lg bg-gradient-to-b from-[#3b9eff] to-[#2d7dd2] font-semibold shadow-[0_4px_16px_rgba(59,158,255,0.4)] hover:shadow-[0_6px_24px_rgba(59,158,255,0.5)] transition-all disabled:opacity-70"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/15 font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
