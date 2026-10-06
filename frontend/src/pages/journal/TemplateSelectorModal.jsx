import React from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../../components/common/Modal';
import { TEMPLATES } from '../../utils/moodConstants';
import {
  BookOpen,
  Sparkles,
  CheckSquare,
  Heart,
  Sun,
  Feather,
  Compass,
  GraduationCap,
  Briefcase,
  Moon,
  ArrowRight,
} from 'lucide-react';

const ICON_MAP = {
  BookOpen,
  Sparkles,
  CheckSquare,
  Heart,
  Sun,
  Feather,
  Compass,
  GraduationCap,
  Briefcase,
  Moon,
};

export default function TemplateSelectorModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  const handleSelectTemplate = (typeId) => {
    onClose();
    navigate(`/journals/new/${typeId}`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Choose Your Journal Style"
      subtitle="Select a page layout designed specifically for what you want to write today."
      maxWidth="max-w-4xl"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2 pb-1">
        {TEMPLATES.map((tmpl) => {
          const Icon = ICON_MAP[tmpl.icon] || BookOpen;

          return (
            <div
              key={tmpl.id}
              onClick={() => handleSelectTemplate(tmpl.id)}
              className="group relative flex flex-col justify-between p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/80 hover:border-stone-400 dark:hover:border-stone-600 hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              <div>
                {/* Icon & Badge */}
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-100 flex items-center justify-center group-hover:scale-105 transition-transform shadow-2xs">
                    <Icon className="w-5 h-5 text-stone-700 dark:text-stone-300" />
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${tmpl.badgeColor}`}>
                    {tmpl.id.replace('_', ' ')}
                  </span>
                </div>

                {/* Name & Tagline */}
                <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                  {tmpl.name}
                </h4>
                <p className="text-[11px] font-medium text-amber-700/80 dark:text-amber-400/80 mt-0.5 mb-1.5">
                  {tmpl.tagline}
                </p>

                {/* Description */}
                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed mb-4">
                  {tmpl.description}
                </p>
              </div>

              {/* Action row */}
              <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs font-semibold text-stone-700 dark:text-stone-300 group-hover:text-stone-900 dark:group-hover:text-white">
                <span>Select Style</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}

