/**
 * Health Monitoring Routes
 * Endpoints for checking provider health and system status
 */

const express = require('express');
const router = express.Router();
const { getInstance: getProviderManager } = require('../services/ProviderManager');

/**
 * GET /api/health/providers
 * Get health status for all news providers
 */
router.get('/providers', (req, res) => {
  try {
    const providerManager = getProviderManager();
    const healthStatus = providerManager.getHealthStatus();

    res.json({
      success: true,
      timestamp: new Date(),
      providers: healthStatus
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve provider health status',
      error: error.message
    });
  }
});

/**
 * GET /api/health/overall
 * Get overall system health summary
 */
router.get('/overall', (req, res) => {
  try {
    const providerManager = getProviderManager();
    const overallHealth = providerManager.getOverallHealth();

    res.json({
      success: true,
      ...overallHealth
    });
  } catch (error) {
    console.error('Overall health check error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve overall health status',
      error: error.message
    });
  }
});

/**
 * GET /api/health/provider/:name
 * Get health status for a specific provider
 */
router.get('/provider/:name', (req, res) => {
  try {
    const { name } = req.params;
    const providerManager = getProviderManager();
    const provider = providerManager.getProvider(name);

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: `Provider '${name}' not found`
      });
    }

    const healthStatus = providerManager.getHealthStatus();
    const providerHealth = healthStatus[name];

    res.json({
      success: true,
      timestamp: new Date(),
      provider: providerHealth
    });
  } catch (error) {
    console.error('Provider health check error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve provider health status',
      error: error.message
    });
  }
});

/**
 * POST /api/health/provider/:name/toggle
 * Enable or disable a specific provider
 */
router.post('/provider/:name/toggle', (req, res) => {
  try {
    const { name } = req.params;
    const { enabled } = req.body;

    if (typeof enabled !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'enabled field must be a boolean'
      });
    }

    const providerManager = getProviderManager();
    const success = providerManager.setProviderEnabled(name, enabled);

    if (!success) {
      return res.status(404).json({
        success: false,
        message: `Provider '${name}' not found`
      });
    }

    res.json({
      success: true,
      message: `Provider '${name}' ${enabled ? 'enabled' : 'disabled'}`,
      provider: name,
      enabled
    });
  } catch (error) {
    console.error('Provider toggle error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle provider',
      error: error.message
    });
  }
});

/**
 * GET /api/health/quota
 * Get rate limit quota status for all providers
 */
router.get('/quota', (req, res) => {
  try {
    const providerManager = getProviderManager();
    const healthStatus = providerManager.getHealthStatus();

    const quotaStatus = {};
    Object.entries(healthStatus).forEach(([name, status]) => {
      quotaStatus[name] = {
        displayName: status.displayName,
        quota: status.quota
      };
    });

    res.json({
      success: true,
      timestamp: new Date(),
      quotas: quotaStatus
    });
  } catch (error) {
    console.error('Quota check error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve quota status',
      error: error.message
    });
  }
});

module.exports = router;
