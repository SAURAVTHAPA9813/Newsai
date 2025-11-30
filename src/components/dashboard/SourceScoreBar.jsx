const SourceScoreBar = ({ score, sourceName }) => {
  // Determine color based on score
  const getScoreColor = () => {
    if (score >= 80) return 'from-green-500 to-green-600';
    if (score >= 50) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  const getScoreTextColor = () => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = () => {
    if (score >= 80) return 'Highly Credible';
    if (score >= 50) return 'Moderately Credible';
    return 'Low Credibility';
  };

  return (
    <div className="space-y-2">
      {/* Label */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-text-secondary">
          Source Credibility
        </span>
        <span className={`text-xs font-bold ${getScoreTextColor()}`}>
          {score}/100
        </span>
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-2 bg-white/50 rounded-full overflow-hidden">
        <div
          className={`absolute top-0 left-0 h-full bg-gradient-to-r ${getScoreColor()} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${score}%` }}
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
        </div>
      </div>

      {/* Score Label */}
      <div className="flex items-center justify-between">
        <span className={`text-xs font-semibold ${getScoreTextColor()}`}>
          {getScoreLabel()}
        </span>
        <span className="text-xs text-text-secondary italic">
          {sourceName}
        </span>
      </div>
    </div>
  );
};

export default SourceScoreBar;
