import { motion } from 'framer-motion';
import TopicCard from './TopicCard';

const TopicMatrixGrid = ({ topics, selectedTopicId, onTopicClick, searchQuery, activeFilter, sortMode }) => {
  // Filter topics
  const filterTopics = (topics) => {
    let filtered = [...topics];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (topic) =>
          topic.name.toLowerCase().includes(query) ||
          topic.categories.some((cat) => cat.toLowerCase().includes(query))
      );
    }

    // Apply filter
    switch (activeFilter) {
      case 'PRIORITY':
        filtered = filtered.filter((t) => t.priority >= 70);
        break;
      case 'SHIELDED':
        filtered = filtered.filter((t) => t.firewallStatus === 'LIMITED' || t.firewallStatus === 'BLOCKED');
        break;
      case 'BLOCKED':
        filtered = filtered.filter((t) => t.firewallStatus === 'BLOCKED');
        break;
      default:
        break;
    }

    return filtered;
  };

  // Sort topics
  const sortTopics = (topics) => {
    const sorted = [...topics];

    switch (sortMode) {
      case 'ALPHA':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'TREND':
        sorted.sort((a, b) => b.trendScore - a.trendScore);
        break;
      case 'RELEVANCE':
      default:
        sorted.sort((a, b) => b.priority - a.priority);
        break;
    }

    return sorted;
  };

  const processedTopics = sortTopics(filterTopics(topics));

  if (processedTopics.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-16"
      >
        <p className="text-text-secondary text-lg">No topics found matching your criteria.</p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {processedTopics.map((topic, index) => (
        <TopicCard
          key={topic.id}
          topic={topic}
          isSelected={selectedTopicId === topic.id}
          onClick={onTopicClick}
          index={index}
        />
      ))}
    </div>
  );
};

export default TopicMatrixGrid;
