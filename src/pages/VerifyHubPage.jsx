import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiShield, FiZap, FiActivity } from "react-icons/fi";
import VerificationInputArea from "../components/verify/VerificationInputArea";
import TruthDialGauge from "../components/verify/TruthDialGauge";
import VerifyTabNavigation from "../components/verify/VerifyTabNavigation";
import SummaryTabContent from "../components/verify/tabs/SummaryTabContent";
import EvidenceTabContent from "../components/verify/tabs/EvidenceTabContent";
import BiasTabContent from "../components/verify/tabs/BiasTabContent";
import TimelineTabContent from "../components/verify/tabs/TimelineTabContent";
import RiskTabContent from "../components/verify/tabs/RiskTabContent";
import { verifyContent, getModelStatus } from "../services/verifyAPI";

const VerifyHubPage = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResults, setVerificationResults] = useState(null);
  const [activeTab, setActiveTab] = useState("summary");
  const [modelStatus, setModelStatus] = useState(null);

  useEffect(() => {
    // Load model status on mount
    const loadModelStatus = async () => {
      const status = await getModelStatus();
      setModelStatus(status);
    };
    loadModelStatus();
  }, []);

  const handleVerify = async (verificationRequest) => {
    setIsVerifying(true);
    setActiveTab("summary"); // Reset to summary tab

    try {
      const result = await verifyContent(
        verificationRequest.claimText,
        verificationRequest.inputType,
        verificationRequest.verificationMode
      );
      setVerificationResults(result);
    } catch (error) {
      console.error("Verification failed:", error);
    } finally {
      setIsVerifying(false);
    }
  };

  const renderTabContent = () => {
    if (!verificationResults) return null;

    switch (activeTab) {
      case "summary":
        return (
          <SummaryTabContent summaryData={verificationResults.summaryTab} />
        );
      case "evidence":
        return (
          <EvidenceTabContent evidenceData={verificationResults.evidenceTab} />
        );
      case "bias":
        return (
          <BiasTabContent biasData={verificationResults.biasSentimentTab} />
        );
      case "timeline":
        return (
          <TimelineTabContent timelineData={verificationResults.timelineTab} />
        );
      case "risk":
        return (
          <RiskTabContent riskData={verificationResults.riskGuidanceTab} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen section-gradient-radial">
      {/* System Health Strip */}
      {modelStatus && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b border-brand-blue/10"
          style={{
            background: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
        >
          <div className="container-custom py-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <FiActivity className="w-4 h-4 text-green-500" />
                  <span className="font-semibold text-text-dark">
                    {modelStatus.modelName} {modelStatus.modelVersion}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-700 font-bold">
                    {modelStatus.status}
                  </span>
                </div>
                <div className="text-text-secondary">
                  Reliability:{" "}
                  <span className="font-semibold text-text-dark">
                    {modelStatus.reliability}%
                  </span>
                </div>
                <div className="text-text-secondary">
                  Avg Latency:{" "}
                  <span className="font-semibold text-text-dark">
                    {modelStatus.averageLatency}s
                  </span>
                </div>
              </div>
              <div className="text-text-secondary">
                Last Update: {modelStatus.lastUpdate}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="container-custom py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-2">
            <div className="w-16 h-16 bg-gradient-to-br from-brand-blue to-bkue-300 rounded-2xl flex items-center justify-center shadow-lg">
              <FiShield className="text-white text-3xl" />
            </div>
            <div>
              <h1 className="font-cinzel text-4xl font-bold text-text-dark">
                AI Forensic Lab
              </h1>
              <p className="text-text-secondary text-lg">
                Advanced verification & truth analysis
              </p>
            </div>
          </div>
        </motion.div>

        {/* Vertical Layout */}
        <div className="space-y-6">
          {/* Input Area - Top */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl border border-brand-blue/20 p-6"
            style={{
              background: "rgba(255, 255, 255, 0.7)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow: "0 8px 32px rgba(65, 105, 225, 0.1)",
            }}
          >
            <div className="mb-4 flex items-center gap-2">
              <FiZap className="w-5 h-5 text-brand-blue" />
              <h2 className="text-lg font-bold text-text-dark uppercase tracking-wider">
                Verification Input
              </h2>
            </div>
            <VerificationInputArea
              onVerify={handleVerify}
              isVerifying={isVerifying}
            />
          </motion.div>

          {/* Results Area - Bottom */}
          <div>
            {!verificationResults && !isVerifying ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-3xl border border-brand-blue/20 p-12 text-center"
                style={{
                  background: "rgba(255, 255, 255, 0.7)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  boxShadow: "0 8px 32px rgba(65, 105, 225, 0.1)",
                }}
              >
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-brand-blue/20 to-blue-300/20 rounded-full flex items-center justify-center">
                  <FiShield className="text-brand-blue text-5xl" />
                </div>
                <h3 className="font-cinzel text-2xl font-bold text-text-dark mb-4">
                  Ready for Analysis
                </h3>
                <p className="text-text-secondary text-base leading-relaxed max-w-md mx-auto">
                  Enter a claim, headline, tweet, or URL in the input area to
                  begin forensic verification. The AI will analyze credibility,
                  sources, bias, and provide a comprehensive truth assessment.
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-6"
              >
                {/* Truth Dial Gauge */}
                {verificationResults && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <TruthDialGauge
                      score={verificationResults.truthDial.score}
                      verdictLabel={verificationResults.truthDial.verdictLabel}
                      verdictLabelHuman={
                        verificationResults.truthDial.verdictLabelHuman
                      }
                      verdictSummary={
                        verificationResults.truthDial.verdictSummary
                      }
                      scoreColor={verificationResults.truthDial.scoreColor}
                    />
                  </motion.div>
                )}

                {/* Loading State */}
                {isVerifying && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="rounded-3xl border border-brand-blue/20 p-12 text-center"
                    style={{
                      background: "rgba(255, 255, 255, 0.8)",
                      backdropFilter: "blur(20px)",
                      WebkitBackdropFilter: "blur(20px)",
                    }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-16 h-16 mx-auto mb-4"
                    >
                      <FiZap className="w-full h-full text-brand-blue" />
                    </motion.div>
                    <p className="text-text-secondary text-lg">
                      Running forensic analysis...
                    </p>
                  </motion.div>
                )}

                {/* Tabbed Results */}
                {verificationResults && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="rounded-3xl border border-brand-blue/20 overflow-hidden"
                    style={{
                      background: "rgba(255, 255, 255, 0.8)",
                      backdropFilter: "blur(20px)",
                      WebkitBackdropFilter: "blur(20px)",
                      boxShadow: "0 8px 32px rgba(65, 105, 225, 0.1)",
                    }}
                  >
                    <VerifyTabNavigation
                      activeTab={activeTab}
                      onTabChange={setActiveTab}
                    />
                    <div className="min-h-[300px]">{renderTabContent()}</div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyHubPage;
