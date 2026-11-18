import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// S3 정적 호스팅(버킷 루트) 기준 기본 설정.
// 서브경로(예: /app/)에 올릴 경우 base 값을 해당 경로로 바꾸세요.
export default defineConfig({
  plugins: [react()],
  base: '/',
});
