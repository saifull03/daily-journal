import React from 'react';
import {
  Compass,
  MapPin,
  Calendar,
  CloudSun,
  Users,
  Utensils,
  Camera,
  Star,
  FileText,
} from 'lucide-react';
import ImageGallery from '../components/journal/ImageGallery';
import RichEditor from '../components/editor/RichEditor';

export default function TravelJournal({
  entry,
  onChange,
  readOnly = false,
  onUploadImages,
  onRemoveImage,
  isUploading = false,
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
      {/* Travel Hero Header */}
      <div className="bg-gradient-to-br from-cyan-900 via-sky-900 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-md space-y-4">
        <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold uppercase tracking-wider">
          <Compass className="w-4 h-4 animate-spin-slow" />
          <span>Travel Expedition</span>
        </div>

        <div>
          <input
            type="text"
            value={entry.title || ''}
            onChange={(e) => onChange('title', e.target.value)}
            disabled={readOnly}
            placeholder="Journey Title (e.g. Kyoto by Foot)..."
            className="w-full text-2xl sm:text-3xl font-bold text-white placeholder-cyan-200/50 bg-transparent border-none focus:outline-none"
          />
        </div>

        {/* Travel Quick Info Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          {/* Destination */}
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5 border border-white/10">
            <label className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-cyan-200">
              <MapPin className="w-3 h-3" />
              <span>Destination</span>
            </label>
            <input
              type="text"
              value={data.destination || ''}
              onChange={(e) => handleFieldChange('destination', e.target.value)}
              disabled={readOnly}
              placeholder="e.g. Kyoto, Japan"
              className="w-full text-xs font-semibold text-white bg-transparent border-none focus:outline-none mt-1"
            />
          </div>

          {/* Location / Area */}
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5 border border-white/10">
            <label className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-cyan-200">
              <Compass className="w-3 h-3" />
              <span>Specific Spot</span>
            </label>
            <input
              type="text"
              value={data.location || ''}
              onChange={(e) => handleFieldChange('location', e.target.value)}
              disabled={readOnly}
              placeholder="e.g. Arashiyama"
              className="w-full text-xs font-semibold text-white bg-transparent border-none focus:outline-none mt-1"
            />
          </div>

          {/* Weather */}
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5 border border-white/10">
            <label className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-cyan-200">
              <CloudSun className="w-3 h-3" />
              <span>Weather</span>
            </label>
            <input
              type="text"
              value={data.weather || ''}
              onChange={(e) => handleFieldChange('weather', e.target.value)}
              disabled={readOnly}
              placeholder="Sunny 18°C"
              className="w-full text-xs font-semibold text-white bg-transparent border-none focus:outline-none mt-1"
            />
          </div>

          {/* Date */}
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5 border border-white/10">
            <label className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-cyan-200">
              <Calendar className="w-3 h-3" />
              <span>Travel Date</span>
            </label>
            <input
              type="date"
              value={entry.journal_date || ''}
              onChange={(e) => onChange('journal_date', e.target.value)}
              disabled={readOnly}
              className="w-full text-xs font-semibold text-white bg-transparent border-none focus:outline-none mt-1 cursor-pointer"
            />
          </div>
        </div>

        {/* Companions */}
        <div className="pt-1 flex items-center gap-2 text-xs text-cyan-100">
          <Users className="w-4 h-4 text-cyan-300 shrink-0" />
          <span className="font-semibold text-cyan-200">Companions:</span>
          <input
            type="text"
            value={data.companions || ''}
            onChange={(e) => handleFieldChange('companions', e.target.value)}
            disabled={readOnly}
            placeholder="Travel companions or Solo adventure..."
            className="flex-1 bg-transparent border-none focus:outline-none text-white placeholder-cyan-200/40"
          />
        </div>
      </div>

      {/* Photo Gallery Section (Highlighted in Travel Journal) */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
          <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
            Photo Gallery & Memories
          </h4>
        </div>

        <ImageGallery
          images={entry.images || []}
          onUpload={onUploadImages}
          onRemove={onRemoveImage}
          isUploading={isUploading}
          readOnly={readOnly}
          multiple={true}
        />
      </div>

      {/* Travel Story & Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Highlights */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <Star className="w-4 h-4" />
            <h5 className="text-xs font-bold uppercase tracking-wider">
              Travel Highlights
            </h5>
          </div>
          <textarea
            rows={3}
            value={data.highlights || ''}
            onChange={(e) => handleFieldChange('highlights', e.target.value)}
            disabled={readOnly}
            placeholder="The most breathtaking moment or unforgettable view..."
            className="w-full text-xs sm:text-sm bg-stone-50 dark:bg-stone-800/80 rounded-xl p-3 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
          />
        </div>

        {/* Places Visited */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <MapPin className="w-4 h-4" />
            <h5 className="text-xs font-bold uppercase tracking-wider">
              Places Visited
            </h5>
          </div>
          <textarea
            rows={3}
            value={data.places_visited || ''}
            onChange={(e) => handleFieldChange('places_visited', e.target.value)}
            disabled={readOnly}
            placeholder="Temples, trails, neighborhoods, parks, cafes..."
            className="w-full text-xs sm:text-sm bg-stone-50 dark:bg-stone-800/80 rounded-xl p-3 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
          />
        </div>

        {/* Food Tried */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
            <Utensils className="w-4 h-4" />
            <h5 className="text-xs font-bold uppercase tracking-wider">
              Food & Culinary Delights
            </h5>
          </div>
          <textarea
            rows={3}
            value={data.food_tried || ''}
            onChange={(e) => handleFieldChange('food_tried', e.target.value)}
            disabled={readOnly}
            placeholder="Dishes tasted, street food, snacks, drinks..."
            className="w-full text-xs sm:text-sm bg-stone-50 dark:bg-stone-800/80 rounded-xl p-3 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
          />
        </div>

        {/* Travel Notes & Tips */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400">
            <FileText className="w-4 h-4" />
            <h5 className="text-xs font-bold uppercase tracking-wider">
              Travel Notes & Advice
            </h5>
          </div>
          <textarea
            rows={3}
            value={data.notes || ''}
            onChange={(e) => handleFieldChange('notes', e.target.value)}
            disabled={readOnly}
            placeholder="Transit tips, tickets, budget, things to do next time..."
            className="w-full text-xs sm:text-sm bg-stone-50 dark:bg-stone-800/80 rounded-xl p-3 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
          />
        </div>
      </div>

      {/* Longform Narrative Experiences */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-xs space-y-3">
        <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
          The Full Story & Experience
        </h4>
        <RichEditor
          value={entry.content || ''}
          onChange={(html) => onChange('content', html)}
          readOnly={readOnly}
          placeholder="Describe your day's journey, the sounds, scents, and interactions..."
          minHeight="min-h-[280px]"
        />
      </div>
    </div>
  );
}

