import { motion } from 'framer-motion';
import { FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const TimelineTabContent = ({ timelineData }) => {
  if (!timelineData) {
    return (
      <div className="p-8 text-center text-text-secondary">
        <p>Run a verification to see the timeline.</p>
      </div>
    );
  }

  const { events } = timelineData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 space-y-6"
    >
      <div>
        <h3 className="text-sm font-bold text-text-dark uppercase tracking-wider mb-3 flex items-center gap-2">
          <span className="w-1 h-4 bg-brand-blue rounded"></span>
          Event Timeline
        </h3>
        <p className="text-sm text-text-secondary mb-6">
          Chronological development of the claim and its verification
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-blue via-sky-400 to-brand-blue/20" />

        {/* Timeline Events */}
        <div className="space-y-6">
          {events.map((event, index) => {
            const hasLinkedSources = event.linkedSourceIds && event.linkedSourceIds.length > 0;
            const isFirst = index === 0;
            const isLast = index === events.length - 1;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.15 }}
                className="relative flex items-start gap-4"
              >
                {/* Timeline Node */}
                <div className="relative z-10 flex-shrink-0">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.15 + 0.1, type: 'spring', stiffness: 200 }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isFirst
                        ? 'bg-gradient-to-br from-green-500 to-green-600'
                        : isLast
                        ? 'bg-gradient-to-br from-brand-blue to-sky-500'
                        : 'bg-gradient-to-br from-blue-400 to-blue-500'
                    } shadow-lg`}
                  >
                    {hasLinkedSources ? (
                      <FiCheckCircle className="w-6 h-6 text-white" />
                    ) : (
                      <FiClock className="w-6 h-6 text-white" />
                    )}
                  </motion.div>

                  {/* Pulsing Ring for Latest Event */}
                  {isLast && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-brand-blue"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.5, 0, 0.5]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut'
                      }}
                    />
                  )}
                </div>

                {/* Event Content */}
                <div className="flex-1 pb-2">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 rounded-lg text-xs font-bold bg-brand-blue/10 text-brand-blue border border-brand-blue/20">
                      {event.relativeLabel}
                    </span>
                    {isLast && (
                      <span className="px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-700">
                        Latest
                      </span>
                    )}
                  </div>

                  <div
                    className="p-4 rounded-xl bg-white/60 border border-gray-200"
                    style={{
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)'
                    }}
                  >
                    <p className="text-sm text-text-dark leading-relaxed mb-2">
                      {event.description}
                    </p>

                    {hasLinkedSources && (
                      <div className="flex items-center gap-2 text-xs text-text-secondary">
                        <FiCheckCircle className="w-3 h-3 text-green-500" />
                        <span>
                          Linked to {event.linkedSourceIds.length} source{event.linkedSourceIds.length > 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Timeline Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: events.length * 0.15 + 0.3 }}
        className="p-4 rounded-xl bg-blue-50/80 border border-blue-300"
      >
        <div className="flex items-start gap-3">
          <FiAlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-900 leading-relaxed">
            Timeline shows relative timestamps (T-Xh = X hours before current time). Events are
            reconstructed from available sources and may not represent complete history.
          </p>
        </div>
      </motion.div>

      {events.length === 0 && (
        <div className="text-center text-text-secondary py-8">
          <p>No timeline events found for this claim.</p>
        </div>
      )}
    </motion.div>
  );
};

export default TimelineTabContent;
