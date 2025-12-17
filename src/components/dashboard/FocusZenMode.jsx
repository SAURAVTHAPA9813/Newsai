import { useState, useEffect, useRef, useCallback } from 'react';
import { FiX, FiVolume2, FiVolumeX, FiClock, FiBookmark, FiUser, FiBookOpen, FiShare2, FiTwitter, FiFacebook, FiLinkedin, FiMail, FiLink } from 'react-icons/fi';
import React from 'react';

const FocusZenMode = ({ article, onClose, relatedArticles = [] }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [fontSize, setFontSize] = useState('normal');
  const [copiedLink, setCopiedLink] = useState(false);

  const scrollContainerRef = useRef(null);
  const utteranceRef = useRef(null);

  // Optimized Text-to-Speech with proper pause/resume
  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    } else {
      if (!utteranceRef.current) {
        utteranceRef.current = new SpeechSynthesisUtterance(article.currentSummary);
        utteranceRef.current.rate = 0.9;
        utteranceRef.current.pitch = 1;
        utteranceRef.current.volume = 1;
        utteranceRef.current.onend = () => setIsPlaying(false);
      }
      window.speechSynthesis.resume();
      window.speechSynthesis.speak(utteranceRef.current);
      setIsPlaying(true);
    }
  }, [isPlaying, article.currentSummary]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  // Share functionality
  const shareOptions = [
    {
      name: 'Twitter',
      icon: FiTwitter,
      onClick: () => {
        const text = `${article.title} - via NewsAI`;
        const url = window.location.href;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        setShowShareMenu(false);
      }
    },
    {
      name: 'Facebook',
      icon: FiFacebook,
      onClick: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
        setShowShareMenu(false);
      }
    },
    {
      name: 'LinkedIn',
      icon: FiLinkedin,
      onClick: () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
        setShowShareMenu(false);
      }
    },
    {
      name: 'Email',
      icon: FiMail,
      onClick: () => {
        const subject = encodeURIComponent(article.title);
        const body = encodeURIComponent(`Check out this article: ${article.title}\n\n${window.location.href}`);
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
        setShowShareMenu(false);
      }
    },
    {
      name: 'Copy Link',
      icon: FiLink,
      onClick: () => {
        navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        setTimeout(() => {
          setCopiedLink(false);
          setShowShareMenu(false);
        }, 2000);
      }
    }
  ];

  // Font size classes
  const fontSizeClasses = {
    small: 'text-base',
    normal: 'text-lg',
    large: 'text-xl'
  };

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-hidden">

      {/* Sticky Header with Actions */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-200 px-8 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          {/* Logo/Branding */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-blue to-blue-600 rounded-lg"></div>
            <span className="font-bold text-xl text-gray-900">NewsAI</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Font Size Controls */}
            <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg">
              <button
                onClick={() => setFontSize('small')}
                className={`px-2 py-1 rounded text-xs font-semibold transition-colors ${
                  fontSize === 'small' ? 'bg-white text-brand-blue shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                A
              </button>
              <button
                onClick={() => setFontSize('normal')}
                className={`px-2 py-1 rounded text-sm font-semibold transition-colors ${
                  fontSize === 'normal' ? 'bg-white text-brand-blue shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                A
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-2 py-1 rounded text-base font-semibold transition-colors ${
                  fontSize === 'large' ? 'bg-white text-brand-blue shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                A
              </button>
            </div>

            {/* Listen Button */}
            <button
              onClick={handlePlayPause}
              className="p-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
              aria-label={isPlaying ? 'Stop reading' : 'Listen to article'}
            >
              {isPlaying ? <FiVolumeX className="w-5 h-5 text-gray-700" /> : <FiVolume2 className="w-5 h-5 text-gray-700" />}
            </button>

            {/* Share Button with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="p-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
                aria-label="Share article"
              >
                <FiShare2 className="w-5 h-5 text-gray-700" />
              </button>

              {showShareMenu && (
                <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[180px] z-30">
                  {shareOptions.map((option) => (
                    <button
                      key={option.name}
                      onClick={option.onClick}
                      className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-100 transition-colors text-left"
                    >
                      <option.icon className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-700">{option.name}</span>
                    </button>
                  ))}
                  {copiedLink && (
                    <div className="px-4 py-2 text-xs text-green-600 font-medium">Link copied!</div>
                  )}
                </div>
              )}
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              className="p-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
              aria-label={isSaved ? 'Remove bookmark' : 'Save article'}
            >
              <FiBookmark className={`w-5 h-5 ${isSaved ? 'fill-brand-blue text-brand-blue' : 'text-gray-700'}`} />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
              aria-label="Close reading mode"
            >
              <FiX className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        ref={scrollContainerRef}
        className="h-full overflow-y-auto"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div className="max-w-4xl mx-auto px-8 py-16">
          {/* Article Header */}
          <header className="mb-12">
            {/* Category Badge */}
            <div className="mb-6">
              <span className="inline-block px-4 py-1 bg-brand-blue/10 text-brand-blue text-sm font-bold uppercase tracking-wider rounded">
                {article.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
              {article.title}
            </h1>

            {/* Subtitle/Deck (if available) */}
            {article.subtitle && (
              <p className="text-2xl text-gray-600 font-serif leading-relaxed mb-8">
                {article.subtitle}
              </p>
            )}

            {/* Byline */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 border-t border-b border-gray-200 py-4">
              <div className="flex items-center gap-2">
                <FiUser className="w-4 h-4" />
                <span className="font-semibold text-gray-900">
                  By {article.author || article.source.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FiClock className="w-4 h-4" />
                <span>{article.publishedAt}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiBookOpen className="w-4 h-4" />
                <span>{article.readTime}</span>
              </div>
            </div>
          </header>

          {/* Hero Image */}
          {article.imageUrl && (
            <figure className="mb-12 -mx-8">
              <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-100">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
              {article.imageCaption && (
                <figcaption className="mt-3 px-8 text-sm text-gray-500">
                  <span className="italic">{article.imageCaption}</span>
                  {article.imageCredit && (
                    <span className="ml-2">Photo: {article.imageCredit}</span>
                  )}
                </figcaption>
              )}
            </figure>
          )}

          {/* Article Content */}
          <article className={`prose prose-lg max-w-none ${fontSizeClasses[fontSize]}`}>
            {/* Drop cap for first paragraph */}
            <p className="first-letter:text-7xl first-letter:font-bold first-letter:text-gray-900 first-letter:mr-3 first-letter:float-left first-letter:leading-none text-gray-800 leading-relaxed mb-6">
              {article.currentSummary}
            </p>

            {/* Additional paragraphs (if available from API) */}
            {article.content?.paragraphs?.map((paragraph, idx) => (
              <p key={idx} className="mb-6 text-gray-800 leading-relaxed">
                {paragraph}
              </p>
            ))}

            {/* Pull Quote (if available) */}
            {article.pullQuote && (
              <blockquote className="my-12 pl-8 border-l-4 border-brand-blue">
                <p className="text-2xl font-serif italic text-gray-700 mb-2">
                  "{article.pullQuote.text}"
                </p>
                {article.pullQuote.attribution && (
                  <footer className="text-sm text-gray-500">
                    — {article.pullQuote.attribution}
                  </footer>
                )}
              </blockquote>
            )}
          </article>

          {/* Related Articles */}
          {relatedArticles && relatedArticles.length > 0 && (
            <footer className="mt-16 pt-8 border-t-2 border-gray-900">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">More to Explore</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.slice(0, 3).map((related) => (
                  <div
                    key={related.id}
                    className="group cursor-pointer"
                    onClick={() => {
                      // Switch to this article - would need to be implemented in parent
                      console.log('Switch to article:', related.id);
                    }}
                  >
                    <div className="aspect-video mb-3 overflow-hidden rounded-lg bg-gray-100">
                      <img
                        src={related.imageUrl}
                        alt={related.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <h4 className="font-bold text-lg text-gray-900 group-hover:text-brand-blue transition-colors">
                      {related.title}
                    </h4>
                    <p className="text-sm text-gray-500 mt-2">{related.source.name}</p>
                  </div>
                ))}
              </div>
            </footer>
          )}

          {/* Spacing for bottom padding */}
          <div className="h-16"></div>
        </div>
      </div>
    </div>
  );
};

// Wrap component with memo for performance
export default React.memo(FocusZenMode);
