import { motion } from 'framer-motion';

const RelatedTopicsStrip = ({ selectedTopic, topics, onTopicClick }) => {
  if (!selectedTopic || !selectedTopic.relatedIds || selectedTopic.relatedIds.length === 0) {
    return null;
  }

  const relatedTopics = selectedTopic.relatedIds
    .map((id) => topics.find((t) => t.id === id))
    .filter(Boolean);

  if (relatedTopics.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-6 p-4 rounded-2xl"
      style={{
        background: 'rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(65, 105, 225, 0.2)'
      }}
    >
      <div className="text-xs font-bold text-text-dark uppercase tracking-wider mb-3">
        Related to: {selectedTopic.name}
      </div>
      <div className="flex flex-wrap gap-2">
        {relatedTopics.map((topic) => (
          <motion.button
            key={topic.id}
            onClick={() => onTopicClick(topic.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-brand-blue/10 to-blue-300 text-brand-blue border border-brand-blue/30 hover:border-brand-blue/50 transition-all"
          >
            {topic.name}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default RelatedTopicsStrip;
