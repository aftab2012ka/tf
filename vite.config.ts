import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

function apiPlugin(): Plugin {
  return {
    name: 'api-server-middleware',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/api/notify-admission' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const data = JSON.parse(body || '{}');
              console.log('\n======================================================');
              console.log('🏛️ [TUBA FOUNDATION GOKAK] ADMISSION NOTIFICATION EMAIL');
              console.log('------------------------------------------------------');
              console.log(`Application ID : ${data.applicationId}`);
              console.log(`Applicant Name : ${data.fullName}`);
              console.log(`Selected Course: ${data.course}`);
              console.log(`Mobile Number  : ${data.mobile}`);
              console.log(`Email Address  : ${data.email || 'None provided'}`);
              console.log(`Qualification  : ${data.qualification}`);
              console.log(`Date & Time    : ${data.createdAt}`);
              console.log('Status         : New Application Queued');
              console.log('======================================================\n');

              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  success: true,
                  applicationId: data.applicationId,
                  message: 'Admission notification dispatched successfully'
                })
              );
            } catch {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Invalid payload' }));
            }
          });
          return;
        }

        if (req.url === '/api/notify-seerat' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const data = JSON.parse(body || '{}');
              console.log('\n======================================================');
              console.log('📖 [TUBA FOUNDATION GOKAK] SEERAT REGISTRATION NOTICE');
              console.log('------------------------------------------------------');
              console.log(`Registration ID: ${data.registrationId}`);
              console.log(`Participant    : ${data.fullName}`);
              console.log(`Qualification  : ${data.qualification}`);
              console.log(`Current Study  : ${data.study}`);
              console.log(`Payment Mode   : ${data.paymentMode}`);
              console.log(`Reference ID   : ${data.paymentReference || 'N/A'}`);
              console.log('======================================================\n');

              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  success: true,
                  registrationId: data.registrationId,
                  message: 'Participant registration dispatched successfully'
                })
              );
            } catch {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Invalid payload' }));
            }
          });
          return;
        }

        next();
      });
    }
  };
}

export default defineConfig(() => {
  return {
    base: './',
    plugins: [react(), tailwindcss(), apiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
