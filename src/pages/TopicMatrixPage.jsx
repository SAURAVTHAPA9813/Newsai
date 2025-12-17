import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiGrid } from 'react-icons/fi';
import ContextProfileCard from '../components/topicmatrix/ContextProfileCard';
import AIInstructionsCard from '../components/topicmatrix/AIInstructionsCard';
import FirewallCard from '../components/topicmatrix/FirewallCard';
import TopicControlsBar from '../components/topicmatrix/TopicControlsBar';
import TopicMatrixGrid from '../components/topicmatrix/TopicMatrixGrid';
import RelatedTopicsStrip from '../components/topicmatrix/RelatedTopicsStrip';
import TopicDetailCard from '../components/topicmatrix/TopicDetailCard';
import {
  getTopicMatrixState,
  updateContextProfile,
  updateFirewallSettings,
  updateAiPolicy,
  updateTopicPreference,
  updateUIState
} from '../services/mockTopicMatrixAPI';

const TopicMatrixPage = () => {
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState(null);

  // Load initial state
  useEffect(() => {
    const loadState = async () => {
      const data = await getTopicMatrixState();
      setState(data);
      setLoading(false);
    };
    loadState();
  }, []);

  // Handlers
  const handleContextProfileChange = async (profile) => {
    setState((prev) => ({ ...prev, contextProfile: profile }));
    await updateContextProfile(profile);
  };

  const handleFirewallChange = async (settings) => {
    setState((prev) => ({
      ...prev,
      firewallSettings: settings
    }));
    await updateFirewallSettings(settings);
  };

  const handleAIPolicyChange = async (policy) => {
    setState((prev) => ({ ...prev, aiPolicy: policy }));
    await updateAiPolicy(policy);
  };

  const handleTopicClick = async (topicId) => {
    const newUIState = { selectedTopicId: topicId };
    setState((prev) => ({
      ...prev,
      uiState: { ...prev.uiState, ...newUIState }
    }));
    await updateUIState(newUIState);
  };

  const handleUIStateChange = async (changes) => {
    setState((prev) => ({
      ...prev,
      uiState: { ...prev.uiState, ...changes }
    }));
    await updateUIState(changes);
  };

  const handleTopicPreferenceChange = async (preferences) => {
    setState((prev) => {
      const existingIndex = prev.topicPreferences.findIndex(
        (p) => p.topicId === preferences.topicId
      );
      const newPreferences = [...prev.topicPreferences];
      if (existingIndex >= 0) {
        newPreferences[existingIndex] = preferences;
      } else {
        newPreferences.push(preferences);
      }
      return { ...prev, topicPreferences: newPreferences };
    });
    await updateTopicPreference(preferences.topicId, preferences);
  };

  if (loading || !state) {
    return (
      <div className="min-h-screen section-gradient-radial flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const selectedTopic = state.topics.find((t) => t.id === state.uiState.selectedTopicId);
  const selectedPreferences = state.topicPreferences.find(
    (p) => p.topicId === state.uiState.selectedTopicId
  );

  return (
    <div className="min-h-screen section-gradient-radial">
      <div className="container-custom py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-2">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-300 rounded-2xl flex items-center justify-center shadow-lg">
              <FiGrid className="text-white text-3xl" />
            </div>
            <div>
              <h1 className="font-cinzel text-4xl font-bold text-text-dark">Topic Matrix</h1>
              <p className="text-text-secondary text-lg">
                Teach the AI what matters and what to protect you from
              </p>
            </div>
          </div>
        </motion.div>

        {/* 3-Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px,1fr,320px] gap-6 min-h-[calc(100vh-200px)]">
          {/* Left Panel: Context & AI Rules */}
          <div className="space-y-6">
            <ContextProfileCard
              profile={state.contextProfile}
              onChange={handleContextProfileChange}
            />
            <AIInstructionsCard
              policy={state.aiPolicy}
              onChange={handleAIPolicyChange}
            />
          </div>

          {/* Center Panel: Topic Matrix */}
          <div className="space-y-4">
            <TopicControlsBar
              uiState={state.uiState}
              onUIStateChange={handleUIStateChange}
            />

            <div
              className="rounded-3xl border border-brand-blue/20 p-6"
              style={{
                background: 'rgba(255, 255, 255, 0.5)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(65, 105, 225, 0.05)'
              }}
            >
              <TopicMatrixGrid
                topics={state.topics}
                selectedTopicId={state.uiState.selectedTopicId}
                onTopicClick={handleTopicClick}
                searchQuery={state.uiState.searchQuery}
                activeFilter={state.uiState.activeFilter}
                sortMode={state.uiState.sortMode}
              />
            </div>

            <RelatedTopicsStrip
              selectedTopic={selectedTopic}
              topics={state.topics}
              onTopicClick={handleTopicClick}
            />
          </div>

          {/* Right Panel: Firewall & Topic Detail */}
          <div className="space-y-6">
            <FirewallCard
              settings={state.firewallSettings}
              onChange={handleFirewallChange}
            />
            <TopicDetailCard
              topic={selectedTopic}
              preferences={selectedPreferences}
              onPreferencesChange={handleTopicPreferenceChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicMatrixPage;
