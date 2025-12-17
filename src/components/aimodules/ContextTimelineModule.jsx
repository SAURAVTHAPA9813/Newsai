import { useState, useEffect } from 'react';
import { FiX, FiLoader, FiBookOpen, FiCircle } from 'react-icons/fi';
import mockDashboardAPI from '../../services/mockDashboardAPI';

const ContextTimelineModule = ({ articleId, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContext();
  }, [articleId]);

  const loadContext = async () => {
    setLoading(true);
    try {
      const result = await mockDashboardAPI.getContext(articleId);
      setData(result);
    } catch (error) {
      console.error('Error loading context:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <FiLoader className="text-brand-blue text-2xl animate-spin" />
        <span className="ml-3 text-text-secondary">Building timeline...</span>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <FiBookOpen className="text-white" />
          </div>
          <div>
            <h4 className="font-bold text-text-dark">Historical Context</h4>
            <p className="text-xs text-text-secondary">Timeline of events</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/70 hover:bg-white transition-colors"
        >
          <FiX className="text-text-secondary" />
        </button>
      </div>

      {/* Background Context */}
      {data.backgroundContext && (
        <div className="mb-4 p-4 bg-blue-50/50 rounded-xl border border-blue-200/50">
          <p className="text-sm text-text-secondary leading-relaxed">
            {data.backgroundContext}
          </p>
        </div>
      )}

      {/* Timeline */}
      <div className="mb-4">
        <h5 className="font-semibold text-text-dark mb-4 text-sm">Event Timeline:</h5>
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-blue to-blue-300"></div>

          {/* Timeline Events */}
          <div className="space-y-4">
            {data.timelineEvents.map((event, index) => {
              const isToday = event.date === 'TODAY';
              return (
                <div key={index} className="relative pl-12">
                  {/* Timeline Dot */}
                  <div
                    className={`absolute left-0 top-1 w-8 h-8 rounded-full flex items-center justify-center ${
                      isToday
                        ? 'bg-brand-blue shadow-lg scale-125'
                        : 'bg-white border-2 border-brand-blue'
                    }`}
                  >
                    {isToday ? (
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                    ) : (
                      <FiCircle className="text-brand-blue text-xs" />
                    )}
                  </div>

                  {/* Event Card */}
                  <div
                    className={`p-3 rounded-xl ${
                      isToday
                        ? 'bg-brand-blue/10 border-2 border-brand-blue'
                        : 'bg-white/70 border border-white/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-xs font-bold uppercase tracking-wider ${
                          isToday ? 'text-brand-blue' : 'text-text-secondary'
                        }`}
                      >
                        {event.date}
                      </span>
                      {isToday && (
                        <span className="px-2 py-0.5 bg-brand-blue text-white text-xs rounded-full">
                          Latest
                        </span>
                      )}
                    </div>
                    <div className="font-semibold text-sm text-text-dark mb-1">{event.event}</div>
                    <div className="text-xs text-text-secondary">{event.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Key Entities */}
      {data.keyEntities && data.keyEntities.length > 0 && (
        <div className="mb-4">
          <h5 className="font-semibold text-text-dark mb-3 text-sm">Key Entities:</h5>
          <div className="grid grid-cols-1 gap-2">
            {data.keyEntities.map((entity, index) => (
              <div key={index} className="p-3 bg-white/70 rounded-lg border border-white/60">
                <div className="font-semibold text-sm text-text-dark">{entity.name}</div>
                <div className="text-xs text-brand-blue mb-1">{entity.role}</div>
                <div className="text-xs text-text-secondary">{entity.relevance}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Topics */}
      {data.relatedTopics && data.relatedTopics.length > 0 && (
        <div>
          <h5 className="font-semibold text-text-dark mb-2 text-sm">Related Topics:</h5>
          <div className="flex flex-wrap gap-2">
            {data.relatedTopics.map((topic, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-white/70 border border-white/60 rounded-full text-xs text-text-secondary"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContextTimelineModule;
