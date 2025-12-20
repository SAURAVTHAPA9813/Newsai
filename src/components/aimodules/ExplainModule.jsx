import { useState, useEffect } from 'react';
import { FiX, FiLoader, FiZap } from 'react-icons/fi';
import aiAPI from '../../services/aiAPI';

const ExplainModule = ({ article, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (article) {
      loadExplanation();
    }
  }, [article]);

  const loadExplanation = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await aiAPI.explainArticle({
        title: article.title,
        description: article.summary?.['15m'] || article.description,
        content: article.summary?.['30m'] || article.content,
      });

      if (result.success) {
        setData(result.data);
      } else {
        setError('Failed to generate explanation');
      }
    } catch (error) {
      console.error('Error loading explanation:', error);
      setError(error.message || 'Failed to load explanation');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <FiLoader className="text-brand-blue text-2xl animate-spin" />
        <span className="ml-3 text-text-secondary">AI is simplifying this article...</span>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
            <FiZap className="text-white" />
          </div>
          <div>
            <h4 className="font-bold text-text-dark">Simplified Explanation</h4>
            <p className="text-xs text-text-secondary">Explained like you're 15 years old</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/70 hover:bg-white transition-colors"
        >
          <FiX className="text-text-secondary" />
        </button>
      </div>

      {/* Simplified Version */}
      <div className="space-y-4">
        <div className="p-4 bg-yellow-50/50 rounded-xl border border-yellow-200/50">
          <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">
            {data.simplifiedVersion}
          </p>
        </div>

        {/* Key Terms */}
        {data.keyTermsExplained && data.keyTermsExplained.length > 0 && (
          <div>
            <h5 className="font-semibold text-text-dark mb-3 text-sm">Key Terms Explained:</h5>
            <div className="space-y-2">
              {data.keyTermsExplained.map((term, index) => (
                <div key={index} className="p-3 bg-white/70 rounded-lg border border-white/60">
                  <div className="font-semibold text-sm text-brand-blue mb-1">{term.term}</div>
                  <div className="text-xs text-text-secondary">{term.explanation}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analogies */}
        {data.analogies && data.analogies.length > 0 && (
          <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200/50">
            <h5 className="font-semibold text-text-dark mb-2 text-sm flex items-center gap-2">
              <span>💡</span> Think of it this way:
            </h5>
            {data.analogies.map((analogy, index) => (
              <p key={index} className="text-sm text-text-secondary italic">
                {analogy}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplainModule;
