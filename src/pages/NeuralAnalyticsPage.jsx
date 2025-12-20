import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiBarChart2, FiFilter, FiRefreshCw } from "react-icons/fi";
import {
  getNeuralAnalyticsData,
  getTopicTrendData,
  getIntegrityData,
} from "../services/neuralAnalyticsAPI";
import KpiCard from "../components/neural-analytics/KpiCard";
import CognitiveImpactChart from "../components/neural-analytics/CognitiveImpactChart";
import TopicTrendTimeline from "../components/neural-analytics/TopicTrendTimeline";
import SessionLogTable from "../components/neural-analytics/SessionLogTable";
import RadarDietMap from "../components/neural-analytics/RadarDietMap";
import IntegrityMonitor from "../components/neural-analytics/IntegrityMonitor";
import SourceDiversityDonut from "../components/neural-analytics/SourceDiversityDonut";
import InsightsCard from "../components/neural-analytics/InsightsCard";

const NeuralAnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [topicTrendData, setTopicTrendData] = useState([]);
  const [integrityData, setIntegrityData] = useState(null);
  const [filters, setFilters] = useState({
    timeRange: "LAST_7_DAYS",
    deviceFilter: [],
    topicFilterId: null,
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadAnalyticsData();
  }, [filters]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      const [analytics, topicTrend, integrity] = await Promise.all([
        getNeuralAnalyticsData(filters),
        getTopicTrendData(),
        getIntegrityData(),
      ]);

      setAnalyticsData(analytics);
      setTopicTrendData(topicTrend);
      setIntegrityData(integrity);
    } catch (error) {
      console.error("Failed to load analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTimeRangeChange = (range) => {
    setFilters((prev) => ({ ...prev, timeRange: range }));
  };

  const handleDeviceFilterToggle = (device) => {
    setFilters((prev) => {
      const currentDevices = prev.deviceFilter || [];
      const newDevices = currentDevices.includes(device)
        ? currentDevices.filter((d) => d !== device)
        : [...currentDevices, device];
      return { ...prev, deviceFilter: newDevices };
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen section-gradient-radial flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <FiRefreshCw className="w-12 h-12 text-serenity-royal mx-auto mb-4 animate-spin" />
          <p className="text-text-secondary">Loading analytics...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen section-gradient-radial">
      <div className="container-custom section-padding">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-300 rounded-2xl flex items-center justify-center shadow-lg">
                <FiBarChart2 className="text-white text-3xl" />
              </div>
              <div>
                <h1 className="font-cinzel text-4xl font-bold text-text-dark">
                  Neural Analytics
                </h1>
                <p className="text-text-secondary text-lg">
                  X-ray vision for your news habits
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 glassmorphism rounded-xl border border-brand-blue/20 hover:bg-brand-blue/10 transition-colors"
            >
              <FiFilter className="w-4 h-4" />
              <span className="text-sm font-medium">Filters</span>
            </button>
          </div>

          {/* Filters Bar */}
          {showFilters && (
            <motion.div
              className="glassmorphism rounded-2xl p-6 border border-brand-blue/20"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Time Range */}
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-2">
                    Time Range
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: "Last 7 days", value: "LAST_7_DAYS" },
                      { label: "Last 30 days", value: "LAST_30_DAYS" },
                      { label: "Last 90 days", value: "LAST_90_DAYS" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleTimeRangeChange(option.value)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          filters.timeRange === option.value
                            ? "bg-brand-blue text-white"
                            : "bg-white/50 text-text-dark hover:bg-white/80"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Device Filter */}
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-2">
                    Devices
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["MOBILE", "DESKTOP", "TABLET"].map((device) => (
                      <button
                        key={device}
                        onClick={() => handleDeviceFilterToggle(device)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          filters.deviceFilter.includes(device)
                            ? "bg-brand-blue text-white"
                            : "bg-white/50 text-text-dark hover:bg-white/80"
                        }`}
                      >
                        {device.charAt(0) + device.slice(1).toLowerCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 2xl:grid-cols-[minmax(0,1.4fr),minmax(0,1fr)] gap-6">
          {/* Left Column - Charts */}
          <div className="space-y-6">
            <CognitiveImpactChart data={analyticsData.dailyAggregates} />
            <TopicTrendTimeline data={topicTrendData} />
            <SessionLogTable sessions={analyticsData.readingSessions} />
          </div>

          {/* Right Column - KPIs, Stats, Insights */}
          <div className="space-y-6">
            {/* KPI Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-1 gap-4">
              {analyticsData.kpiCards.map((kpi) => (
                <KpiCard key={kpi.type} kpi={kpi} />
              ))}
            </div>

            <RadarDietMap topicMetrics={analyticsData.topicMetrics} />
            <IntegrityMonitor data={integrityData} />
            <SourceDiversityDonut sourceMetrics={analyticsData.sourceMetrics} />
            <InsightsCard insights={analyticsData.insights} />
          </div>
        </div>

        {/* Footer Note */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-xs text-text-secondary italic">
            This view respects your Topic Matrix settings and Firewall limits.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default NeuralAnalyticsPage;
