import React from 'react';
import {
  Moon,
  Sparkles,
  Users,
  MapPin,
  Heart,
  Eye,
  Brain,
  Calendar,
} from 'lucide-react';
import RichEditor from '../components/editor/RichEditor';

export default function DreamJournal({
  entry,
  onChange,
  readOnly = false,
}) {
  const data = entry.data || {};

  const handleFieldChange = (key, val) => {
    onChange('data', {
      ...data,
      [key]: val,
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Dreamy Hero Header Container */}
      <div className="dream-glow bg-gradient-to-br from-purple-950 via-indigo-950 to-stone-900 border border-purple-800/40 text-stone-100 rounded-3xl p-6 sm:p-8 shadow-md space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-purple-800/40">
          <div className="flex items-center gap-2 text-purple-300 text-xs font-bold uppercase tracking-wider">
            <Moon className="w-4 h-4 text-purple-400 animate-pulse" />
            <span>Subconscious & Dream Realm</span>
          </div>

          <div className="flex items-center gap-2 text-purple-200">
            <Calendar className="w-4 h-4 text-purple-400" />
            <input
              type="date"
              value={entry.journal_date || ''}
              onChange={(e) => onChange('journal_date', e.target.value)}
              disabled={readOnly}
              className="text-xs font-semibold bg-transparent border-none focus:outline-none cursor-pointer text-purple-200"
            />
          </div>
        </div>

        <div>
          <input
            type="text"
            value={entry.title || ''}
            onChange={(e) => onChange('title', e.target.value)}
            disabled={readOnly}
            placeholder="Dream Title (e.g. The Floating Celestial Library)..."
            className="w-full text-2xl sm:text-3xl font-serif font-bold text-white placeholder-purple-300/40 bg-transparent border-none focus:outline-none"
          />
        </div>
      </div>

      {/* Dream Narrative Section */}
      <div className="bg-white dark:bg-stone-900/90 border border-purple-200/50 dark:border-purple-950/60 rounded-3xl p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400">
          <Sparkles className="w-4 h-4" />
          <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
            Dream Narrative & Memory
          </h4>
        </div>
        <p className="text-xs text-stone-400 italic">
          Write down every detail you remember right after waking up before the memory fades...
        </p>
        <RichEditor
          value={entry.content || ''}
          onChange={(html) => onChange('content', html)}
          readOnly={readOnly}
          placeholder="I was floating above a calm landscape, colors were inverted, and..."
          minHeight="min-h-[260px]"
        />
      </div>

      {/* Dream Elements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* People in the dream */}
        <div className="bg-white dark:bg-stone-900 border border-purple-200/40 dark:border-purple-950/40 rounded-3xl p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
            <Users className="w-4 h-4" />
            <h5 className="text-xs font-bold uppercase tracking-wider">
              People & Entities
            </h5>
          </div>
          <textarea
            rows={3}
            value={data.people || ''}
            onChange={(e) => handleFieldChange('people', e.target.value)}
            disabled={readOnly}
            placeholder="Familiar friends, strangers, mystical figures, animals..."
            className="w-full text-xs sm:text-sm bg-purple-50/40 dark:bg-stone-800/60 rounded-xl p-3 border border-purple-100 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
          />
        </div>

        {/* Location & Setting */}
        <div className="bg-white dark:bg-stone-900 border border-purple-200/40 dark:border-purple-950/40 rounded-3xl p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <MapPin className="w-4 h-4" />
            <h5 className="text-xs font-bold uppercase tracking-wider">
              Location & Setting
            </h5>
          </div>
          <textarea
            rows={3}
            value={data.location || ''}
            onChange={(e) => handleFieldChange('location', e.target.value)}
            disabled={readOnly}
            placeholder="Childhood home, futuristic city, underwater train, floating island..."
            className="w-full text-xs sm:text-sm bg-purple-50/40 dark:bg-stone-800/60 rounded-xl p-3 border border-purple-100 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
          />
        </div>

        {/* Emotions Felt */}
        <div className="bg-white dark:bg-stone-900 border border-purple-200/40 dark:border-purple-950/40 rounded-3xl p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-rose-500 dark:text-rose-400">
            <Heart className="w-4 h-4" />
            <h5 className="text-xs font-bold uppercase tracking-wider">
              Emotions & Sensations
            </h5>
          </div>
          <textarea
            rows={3}
            value={data.emotions || ''}
            onChange={(e) => handleFieldChange('emotions', e.target.value)}
            disabled={readOnly}
            placeholder="Awe, lightness, anxiety, peace, confusion, flying sensation..."
            className="w-full text-xs sm:text-sm bg-purple-50/40 dark:bg-stone-800/60 rounded-xl p-3 border border-purple-100 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
          />
        </div>

        {/* Interesting Details & Symbols */}
        <div className="bg-white dark:bg-stone-900 border border-purple-200/40 dark:border-purple-950/40 rounded-3xl p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-amber-500 dark:text-amber-400">
            <Eye className="w-4 h-4" />
            <h5 className="text-xs font-bold uppercase tracking-wider">
              Interesting Details & Symbols
            </h5>
          </div>
          <textarea
            rows={3}
            value={data.interesting_details || ''}
            onChange={(e) => handleFieldChange('interesting_details', e.target.value)}
            disabled={readOnly}
            placeholder="Specific objects, clocks, symbols, colors, unusual physics..."
            className="w-full text-xs sm:text-sm bg-purple-50/40 dark:bg-stone-800/60 rounded-xl p-3 border border-purple-100 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
          />
        </div>
      </div>

      {/* Interpretation & Subconscious Thoughts */}
      <div className="bg-white dark:bg-stone-900 border border-purple-200/50 dark:border-purple-950/60 rounded-3xl p-6 shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-fuchsia-600 dark:text-fuchsia-400">
          <Brain className="w-4 h-4" />
          <h5 className="text-xs font-bold uppercase tracking-wider">
            Personal Interpretation & Meanings
          </h5>
        </div>
        <p className="text-[11px] text-stone-400 italic">
          What might your subconscious mind be processing? How does this connect to waking life?
        </p>
        <textarea
          rows={3}
          value={data.interpretation || ''}
          onChange={(e) => handleFieldChange('interpretation', e.target.value)}
          disabled={readOnly}
          placeholder="Reflections on what this dream might signify about current life situations..."
          className="w-full text-xs sm:text-sm bg-purple-50/30 dark:bg-stone-800/60 rounded-xl p-3.5 border border-purple-100 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
        />
      </div>
    </div>
  );
}

