import { useState } from 'react';
import { FiZap, FiDollarSign, FiBookOpen, FiShuffle } from 'react-icons/fi';
import ExplainModule from '../aimodules/ExplainModule';
import MarketImpactModule from '../aimodules/MarketImpactModule';
import ContextTimelineModule from '../aimodules/ContextTimelineModule';
import PerspectivesModule from '../aimodules/PerspectivesModule';

const AICommandToolbar = ({ articleId, onModuleClick }) => {
  const [activeModule, setActiveModule] = useState(null);
  const [loading, setLoading] = useState(false);

  const modules = [
    {
      id: 'explain',
      icon: FiZap,
      label: 'Explain',
      description: 'Simplify to 8th grade level',
      color: 'from-yellow-500 to-orange-500',
      component: ExplainModule
    },
    {
      id: 'market',
      icon: FiDollarSign,
      label: 'Market',
      description: 'Financial impact analysis',
      color: 'from-green-500 to-emerald-500',
      component: MarketImpactModule
    },
    {
      id: 'context',
      icon: FiBookOpen,
      label: 'Context',
      description: 'Timeline of events',
      color: 'from-blue-500 to-cyan-500',
      component: ContextTimelineModule
    },
    {
      id: 'perspectives',
      icon: FiShuffle,
      label: 'Views',
      description: 'Multiple perspectives',
      color: 'from-purple-500 to-pink-500',
      component: PerspectivesModule
    }
  ];

  const handleModuleClick = (e, module) => {
    e.stopPropagation();

    if (activeModule === module.id) {
      setActiveModule(null);
    } else {
      setActiveModule(module.id);
      onModuleClick?.();
    }
  };

  const handleModuleClose = (e) => {
    e?.stopPropagation();
    setActiveModule(null);
  };

  const ActiveModuleComponent = modules.find(m => m.id === activeModule)?.component;

  return (
    <div>
      {/* Toolbar Buttons */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-medium text-text-secondary">AI Commands:</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {modules.map((module) => {
          const Icon = module.icon;
          const isActive = activeModule === module.id;

          return (
            <button
              key={module.id}
              onClick={(e) => handleModuleClick(e, module)}
              className={`group/btn relative p-3 bg-white/70 backdrop-blur-sm border rounded-xl transition-all duration-300 hover:scale-105 ${
                isActive
                  ? 'border-brand-blue shadow-lg scale-105'
                  : 'border-white/40 hover:border-brand-blue/50'
              }`}
              title={module.description}
            >
              <div
                className={`w-8 h-8 mx-auto mb-1.5 rounded-lg bg-gradient-to-br ${module.color} flex items-center justify-center transition-transform duration-300 ${
                  isActive ? 'scale-110' : 'group-hover/btn:scale-110'
                }`}
              >
                <Icon className="text-white text-sm" />
              </div>
              <span className={`text-xs font-semibold block ${
                isActive ? 'text-brand-blue' : 'text-text-secondary group-hover/btn:text-brand-blue'
              }`}>
                {module.label}
              </span>

              {/* Active indicator */}
              {isActive && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-brand-blue rounded-full border-2 border-white animate-pulse"></div>
              )}

              {/* Tooltip */}
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover/btn:opacity-100 group-hover/btn:visible transition-all duration-200 whitespace-nowrap z-10">
                {module.description}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Module Panel */}
      {activeModule && ActiveModuleComponent && (
        <div
          className="mt-4 p-4 bg-white/90 backdrop-blur-md border border-brand-blue/30 rounded-2xl shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <ActiveModuleComponent
            articleId={articleId}
            onClose={handleModuleClose}
          />
        </div>
      )}
    </div>
  );
};

export default AICommandToolbar;
