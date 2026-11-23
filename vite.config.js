import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 배포: CloudFront가 /* → S3, /api/* → API Gateway 로 라우팅 (같은 도메인)
// 로컬 개발: /api 요청을 배포된 CloudFront로 프록시해서 실제 DynamoDB/Bedrock 데이터로 확인
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_DEV_API_TARGET || 'https://d1ddulkwml8bf5.cloudfront.net',
        changeOrigin: true,
      },
    },
  },
});
