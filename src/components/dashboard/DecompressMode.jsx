import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

const DecompressMode = ({ onClose }) => {
  const [phase, setPhase] = useState('breatheIn'); // breatheIn, hold, breatheOut, complete
  const [timer, setTimer] = useState(4);
  const [cycle, setCycle] = useState(0);
  const totalCycles = 3;

  const phases = {
    breatheIn: { duration: 4, label: 'Breathe In', color: 'from-cyan-500 to-blue-500' },
    hold: { duration: 4, label: 'Hold', color: 'from-purple-500 to-pink-500' },
    breatheOut: { duration: 4, label: 'Breathe Out', color: 'from-green-500 to-emerald-500' }
  };

  useEffect(() => {
    const currentPhase = phases[phase];
    if (!currentPhase) return;

    if (timer > 0) {
      const timeout = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(timeout);
    } else {
      // Move to next phase
      if (phase === 'breatheIn') {
        setPhase('hold');
        setTimer(phases.hold.duration);
      } else if (phase === 'hold') {
        setPhase('breatheOut');
        setTimer(phases.breatheOut.duration);
      } else if (phase === 'breatheOut') {
        if (cycle < totalCycles - 1) {
          setCycle(cycle + 1);
          setPhase('breatheIn');
          setTimer(phases.breatheIn.duration);
        } else {
          setPhase('complete');
        }
      }
    }
  }, [timer, phase, cycle]);

  const getCircleSize = () => {
    if (phase === 'breatheIn') {
      return 'scale-150';
    } else if (phase === 'hold') {
      return 'scale-150';
    } else if (phase === 'breatheOut') {
      return 'scale-75';
    }
    return 'scale-100';
  };

  const currentPhaseData = phases[phase] || {};

  if (phase === 'complete') {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
            <span className="text-6xl">✓</span>
          </div>
          <h2 className="font-cinzel text-4xl font-bold text-white mb-4">
            Well Done!
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            You completed the breathing exercise
          </p>
          <button
            onClick={onClose}
            className="px-8 py-4 bg-gradient-to-br from-brand-blue to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors z-10"
      >
        <FiX className="text-2xl" />
      </button>

      {/* Main Content */}
      <div className="text-center">
        {/* Title */}
        <div className="mb-12">
          <h2 className="font-cinzel text-3xl font-bold text-white mb-2">
            Decompress Mode
          </h2>
          <p className="text-gray-400">
            Follow the circle and breathe • Cycle {cycle + 1} of {totalCycles}
          </p>
        </div>

        {/* Breathing Circle */}
        <div className="relative w-64 h-64 mx-auto mb-12">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-4 border-white/20"></div>

          {/* Animated circle */}
          <div
            className={`absolute inset-8 rounded-full bg-gradient-to-br ${currentPhaseData.color} transition-transform duration-[4000ms] ease-in-out ${getCircleSize()}`}
            style={{
              boxShadow: '0 0 80px rgba(99, 102, 241, 0.5)'
            }}
          >
            {/* Pulse effect */}
            <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse"></div>
          </div>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            <div className="text-7xl font-bold text-white mb-2">{timer}</div>
            <div className="text-xl text-white/90 font-semibold">{currentPhaseData.label}</div>
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-2 text-gray-400 text-lg">
          <p>Focus on your breathing</p>
          <p>Let go of stress and anxiety</p>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {Array.from({ length: totalCycles }).map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index < cycle
                  ? 'bg-green-500 scale-110'
                  : index === cycle
                  ? 'bg-white scale-125'
                  : 'bg-white/30'
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DecompressMode;
