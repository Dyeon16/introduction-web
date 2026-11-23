import { useEffect, useState } from 'react';

// CloudFront가 /api/* 를 API Gateway로 전달하므로 같은 도메인의 상대 경로로 호출 (CORS 불필요)
// 로컬 개발 시에는 vite.config.js의 proxy가 /api 요청을 배포된 CloudFront로 넘겨줍니다.
const API_BASE = import.meta.env.VITE_API_BASE || '/api';

// 페이지를 오갈 때마다 다시 부르지 않도록 세션 동안 응답을 캐시
const cache = new Map();

async function fetchResource(type) {
  if (cache.has(type)) return cache.get(type);
  const res = await fetch(`${API_BASE}/${type}`, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  cache.set(type, data);
  return data;
}

// type: 'profile' | 'spec' | 'projects' | 'contacts'
export function useResource(type) {
  const cached = cache.get(type);
  const [state, setState] = useState({ data: cached ?? null, loading: !cached, error: null });

  useEffect(() => {
    if (cache.has(type)) return undefined;
    let alive = true;
    fetchResource(type)
      .then((data) => alive && setState({ data, loading: false, error: null }))
      .catch((error) => alive && setState({ data: null, loading: false, error }));
    return () => {
      alive = false;
    };
  }, [type]);

  return state;
}
