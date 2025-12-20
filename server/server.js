const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

// Load environment variables with explicit path
dotenv.config({ path: path.join(__dirname, ".env") });

// Initialize Sentry (must be before other imports)
if (process.env.SENTRY_DSN) {
  const Sentry = require("@sentry/node");
  const { nodeProfilingIntegration } = require("@sentry/profiling-node");

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || "development",
    integrations: [
      nodeProfilingIntegration(),
    ],
    // Performance Monitoring
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
    // Profiling
    profilesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  });

  console.log("✅ Sentry error tracking initialized");
}

// Validate critical environment variables
const requiredEnvVars = [
  "MONGODB_URI",
  "JWT_SECRET",
  "GEMINI_API_KEY",
  "NEWS_API_KEY",
];
const missingEnvVars = requiredEnvVars.filter(
  (varName) => !process.env[varName]
);

if (missingEnvVars.length > 0) {
  console.error(
    "❌ SECURITY ERROR: Missing required environment variables:",
    missingEnvVars.join(", ")
  );
  console.error(
    "Please create a .env file in the server directory with all required variables."
  );
  process.exit(1);
}

// Initialize express app
const app = express();

// Connect to MongoDB
const startServer = async () => {
  try {
    await connectDB();

    // Initialize Multi-Provider News System
    console.log("\n🌐 Initializing Multi-Provider News System...");
    const {
      getInstance: getProviderManager,
    } = require("./services/ProviderManager");
    const providerManager = getProviderManager();

    // Log provider status
    const healthStatus = providerManager.getOverallHealth();
    console.log(`\n📊 Provider System Status:`);
    console.log(`   Total Providers: ${healthStatus.totalProviders}`);
    console.log(`   Healthy: ${healthStatus.healthy}`);
    console.log(`   Degraded: ${healthStatus.degraded}`);
    console.log(`   Disabled: ${healthStatus.disabled}`);
    console.log(`   Status: ${healthStatus.status.toUpperCase()}\n`);

    // Middleware
    // CORS Configuration - Production Ready
    const allowedOrigins = [
      'http://localhost:5173',  // Local development
      'http://localhost:3000',  // Alternative local port
      process.env.FRONTEND_URL  // Production frontend URL
    ].filter(Boolean); // Remove undefined values

    app.use(cors({
      origin: function(origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          console.warn(`⚠️  CORS blocked request from: ${origin}`);
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,  // Allow cookies
      optionsSuccessStatus: 200,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));

    app.use(cookieParser()); // Parse cookies
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Sentry request handler (must be first middleware)
    if (process.env.SENTRY_DSN) {
      const Sentry = require("@sentry/node");
      app.use(Sentry.Handlers.requestHandler());
      app.use(Sentry.Handlers.tracingHandler());
    }

    // Security Middleware
    app.use(helmet()); // Set security HTTP headers
    app.use(mongoSanitize()); // Prevent NoSQL injection
    app.use(xss()); // Prevent XSS attacks

    // Rate limiting - General API (lenient in development)
    const isDev = process.env.NODE_ENV === "development";
    const limiter = rateLimit({
      windowMs: 10 * 60 * 1000, // 10 minutes
      max: isDev ? 10000 : 100, // 10k in dev, 100 in prod
      message: "Too many requests from this IP, please try again later.",
      standardHeaders: true,
      legacyHeaders: false,
      skip: () => isDev, // Skip rate limiting entirely in dev
    });
    app.use("/api/", limiter);

    // Rate limiting - Auth routes (stricter, always enforced)
    const authLimiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: isDev ? 50 : 5, // More lenient in dev, strict in prod
      message: "Too many authentication attempts, please try again later.",
      standardHeaders: true,
      legacyHeaders: false,
    });
    app.use("/api/auth/login", authLimiter);
    app.use("/api/auth/signup", authLimiter);

    // Routes
    app.use("/api/auth", require("./routes/auth"));
    app.use("/api/news", require("./routes/news"));
    app.use("/api/user", require("./routes/user"));
    app.use("/api/quiz", require("./routes/quiz"));
    app.use("/api/stats", require("./routes/stats"));
    app.use("/api/user-stats", require("./routes/userStats"));
    app.use("/api/ai", require("./routes/ai"));
    app.use("/api/intelligence", require("./routes/intelligence"));
    app.use(
      "/api/intelligence-briefing",
      require("./routes/intelligenceBriefing")
    );
    app.use("/api/dashboard", require("./routes/dashboard"));
    app.use("/api/analytics", require("./routes/analytics"));
    app.use("/api/health", require("./routes/health"));
    app.use("/api/verification", require("./routes/verification"));

    // Root route
    app.get("/", (req, res) => {
      res.json({
        success: true,
        message: "NewsAI API Server is running",
      });
    });

    // Sentry error handler (must be before custom error handlers)
    if (process.env.SENTRY_DSN) {
      const Sentry = require("@sentry/node");
      app.use(Sentry.Handlers.errorHandler());
    }

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({
        success: false,
        message: "Something went wrong!",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
      });
    });

    // 404 handler
    app.use((req, res) => {
      res.status(404).json({
        success: false,
        message: "Route not found",
      });
    });

    // Start server
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
