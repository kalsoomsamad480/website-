import env from './env.js';

const corsOptions = {
  origin(origin, callback) {
    // Allow same-origin tools (curl, server-to-server) that send no Origin header
    if (!origin || env.clientUrls.includes(origin)) return callback(null, true);
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
};

export default corsOptions;
