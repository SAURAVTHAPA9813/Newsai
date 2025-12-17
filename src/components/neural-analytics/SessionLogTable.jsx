import { motion } from 'framer-motion';
import { FiClock, FiBookOpen, FiCheckCircle, FiBookmark } from 'react-icons/fi';

const SessionLogTable = ({ sessions }) => {
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getMoodColor = (mood) => {
    switch (mood) {
      case 'CALM':
        return 'bg-green-100 text-green-700';
      case 'FOCUSED':
        return 'bg-blue-100 text-blue-700';
      case 'ANXIOUS':
        return 'bg-orange-100 text-orange-700';
      case 'OVERWHELMED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getModeIcon = (mode) => {
    switch (mode) {
      case 'DEEP_DIVE':
        return <FiBookOpen className="w-4 h-4 text-blue-600" />;
      case 'INTENTIONAL':
        return <FiCheckCircle className="w-4 h-4 text-green-600" />;
      case 'SKIM':
        return <FiClock className="w-4 h-4 text-gray-600" />;
      default:
        return null;
    }
  };

  const getKeyActions = (events) => {
    const actionIcons = [];
    if (events.some((e) => e.type === 'OPENED_VERIFY_HUB')) {
      actionIcons.push(
        <span key="verify" className="text-xs bg-verified-green/20 text-verified-green px-2 py-1 rounded">
          Verified
        </span>
      );
    }
    if (events.some((e) => e.type === 'SAVED')) {
      actionIcons.push(<FiBookmark key="saved" className="w-3 h-3 text-brand-blue" />);
    }
    return actionIcons;
  };

  return (
    <motion.div
      className="glassmorphism rounded-3xl p-6 border border-brand-blue/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold text-text-dark font-cinzel mb-1">
          Session Log
        </h2>
        <p className="text-sm text-text-secondary">Recent reading sessions</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-brand-blue/10">
              <th className="text-left text-xs font-medium text-text-secondary uppercase tracking-wider py-3 px-2">
                Start Time
              </th>
              <th className="text-left text-xs font-medium text-text-secondary uppercase tracking-wider py-3 px-2">
                Topic
              </th>
              <th className="text-left text-xs font-medium text-text-secondary uppercase tracking-wider py-3 px-2">
                Source
              </th>
              <th className="text-right text-xs font-medium text-text-secondary uppercase tracking-wider py-3 px-2">
                Duration
              </th>
              <th className="text-center text-xs font-medium text-text-secondary uppercase tracking-wider py-3 px-2">
                Mode
              </th>
              <th className="text-center text-xs font-medium text-text-secondary uppercase tracking-wider py-3 px-2">
                Mood
              </th>
              <th className="text-center text-xs font-medium text-text-secondary uppercase tracking-wider py-3 px-2">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sessions.slice(0, 15).map((session, index) => (
              <motion.tr
                key={session.id}
                className="border-b border-brand-blue/5 hover:bg-brand-blue/5 transition-colors"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
              >
                <td className="py-3 px-2 text-xs text-text-dark">
                  {formatTime(session.startedAt)}
                </td>
                <td className="py-3 px-2 text-xs text-text-dark font-medium">
                  {session.topicName}
                </td>
                <td className="py-3 px-2 text-xs text-text-secondary">
                  {session.sourceName}
                </td>
                <td className="py-3 px-2 text-xs text-text-dark text-right">
                  {session.durationMinutes} min
                </td>
                <td className="py-3 px-2 text-center">
                  <div className="flex justify-center">
                    {getModeIcon(session.readingMode)}
                  </div>
                </td>
                <td className="py-3 px-2 text-center">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getMoodColor(
                      session.moodTag
                    )}`}
                  >
                    {session.moodTag}
                  </span>
                </td>
                <td className="py-3 px-2">
                  <div className="flex items-center justify-center gap-2">
                    {getKeyActions(session.engagementEvents)}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {sessions.length > 15 && (
        <p className="text-xs text-text-secondary mt-4 text-center">
          Showing 15 of {sessions.length} sessions
        </p>
      )}
    </motion.div>
  );
};

export default SessionLogTable;
