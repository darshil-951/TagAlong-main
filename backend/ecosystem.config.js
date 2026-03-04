// PM2 Ecosystem Configuration
// Use this file to manage your Node.js application with PM2
// Install PM2: npm install -g pm2
// Start: pm2 start ecosystem.config.js
// Stop: pm2 stop ecosystem.config.js
// Restart: pm2 restart ecosystem.config.js

module.exports = {
  apps: [{
    name: 'tagalong-backend',
    script: './src/app.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'development',
      PORT: 5000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_memory_restart: '1G',
    watch: false,
    ignore_watch: ['node_modules', 'logs', 'uploads']
  }]
};

