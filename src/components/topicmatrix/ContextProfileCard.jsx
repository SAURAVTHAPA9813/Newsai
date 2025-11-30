import { motion } from 'framer-motion';
import { FiUser, FiBriefcase, FiMapPin, FiTarget } from 'react-icons/fi';

const ContextProfileCard = ({ profile, onChange }) => {
  const industries = [
    'Nurse',
    'Software Engineer',
    'Student',
    'Trader',
    'Founder',
    'Teacher',
    'Designer',
    'Product Manager',
    'Data Scientist',
    'Marketing',
    'Finance',
    'Healthcare',
    'Legal',
    'Sales',
    'Other'
  ];

  const roles = ['Student', 'Junior', 'Mid', 'Senior', 'Manager', 'Executive'];

  const focusAreaOptions = [
    'AI',
    'Healthcare Policy',
    'Startups',
    'Climate',
    'Macroeconomy',
    'Education',
    'Technology',
    'Finance',
    'Science',
    'Policy',
    'Culture'
  ];

  const handleFieldChange = (field, value) => {
    onChange({ ...profile, [field]: value });
  };

  const toggleFocusArea = (area) => {
    const current = profile.focusAreas || [];
    const updated = current.includes(area)
      ? current.filter(a => a !== area)
      : [...current, area];
    handleFieldChange('focusAreas', updated);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-3xl border border-brand-blue/20 p-6"
      style={{
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(65, 105, 225, 0.1)'
      }}
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <FiUser className="w-5 h-5 text-brand-blue" />
          <h2 className="text-lg font-bold text-text-dark uppercase tracking-wider">
            Context Profile
          </h2>
        </div>
        <p className="text-xs text-text-secondary">Tell the AI who you are.</p>
      </div>

      <div className="space-y-5">
        {/* Industry */}
        <div>
          <label className="flex items-center gap-2 text-xs font-bold text-text-dark uppercase tracking-wider mb-2">
            <FiBriefcase className="w-4 h-4" />
            Industry
          </label>
          <select
            value={profile.industry}
            onChange={(e) => handleFieldChange('industry', e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg bg-white/60 border border-brand-blue/20 text-sm text-text-dark focus:outline-none focus:ring-2 focus:ring-brand-blue/50 transition-all"
          >
            {industries.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
        </div>

        {/* Role */}
        <div>
          <label className="flex items-center gap-2 text-xs font-bold text-text-dark uppercase tracking-wider mb-2">
            <FiUser className="w-4 h-4" />
            Role
          </label>
          <select
            value={profile.role}
            onChange={(e) => handleFieldChange('role', e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg bg-white/60 border border-brand-blue/20 text-sm text-text-dark focus:outline-none focus:ring-2 focus:ring-brand-blue/50 transition-all"
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        {/* Region */}
        <div>
          <label className="flex items-center gap-2 text-xs font-bold text-text-dark uppercase tracking-wider mb-2">
            <FiMapPin className="w-4 h-4" />
            Region
          </label>
          <input
            type="text"
            value={profile.regionLabel}
            onChange={(e) => handleFieldChange('regionLabel', e.target.value)}
            placeholder="e.g., United States, Texas, Austin"
            className="w-full px-3 py-2.5 rounded-lg bg-white/60 border border-brand-blue/20 text-sm text-text-dark placeholder-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 transition-all"
          />
        </div>

        {/* Focus Areas */}
        <div>
          <label className="flex items-center gap-2 text-xs font-bold text-text-dark uppercase tracking-wider mb-2">
            <FiTarget className="w-4 h-4" />
            Focus Areas
          </label>
          <div className="flex flex-wrap gap-2">
            {focusAreaOptions.map((area) => {
              const isSelected = (profile.focusAreas || []).includes(area);
              return (
                <motion.button
                  key={area}
                  onClick={() => toggleFocusArea(area)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-brand-blue to-blue-300 text-white shadow-lg'
                      : 'bg-white/60 text-text-secondary border border-brand-blue/20 hover:border-brand-blue/50'
                  }`}
                >
                  {area}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Context Influence */}
        <div>
          <label className="flex items-center justify-between text-xs font-bold text-text-dark uppercase tracking-wider mb-2">
            <span>Context Influence</span>
            <span className="text-brand-blue">{Math.round((profile.contextInfluence || 0.7) * 100)}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={Math.round((profile.contextInfluence || 0.7) * 100)}
            onChange={(e) => handleFieldChange('contextInfluence', parseInt(e.target.value) / 100)}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #4169E1 0%, #4169E1 ${Math.round((profile.contextInfluence || 0.7) * 100)}%, #E5E7EB ${Math.round((profile.contextInfluence || 0.7) * 100)}%, #E5E7EB 100%)`
            }}
          />
          <p className="text-xs text-text-secondary mt-2">
            How much your context influences what you see
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ContextProfileCard;
