import Card from './Card.jsx';

// 기획서: 데이터 로딩 중에는 "불러오는 중입니다" 표시
export function Loading() {
  return (
    <Card className="status-card" role="status" aria-live="polite">
      <span className="status-card__spinner" aria-hidden="true" />
      <span className="body-small">불러오는 중입니다</span>
    </Card>
  );
}

export function Empty({ children = '아직 등록된 정보가 없어요.' }) {
  return (
    <Card className="status-card">
      <span className="body-small">{children}</span>
    </Card>
  );
}

export function LoadError() {
  return (
    <Card className="status-card status-card--error" role="alert">
      <span className="body-small">정보를 불러오지 못했어요. 잠시 후 새로고침해 주세요.</span>
    </Card>
  );
}

// loading / error / empty 상태를 한 번에 처리하고, 데이터가 있으면 children을 렌더링
export function ResourceView({ loading, error, isEmpty, emptyText, children }) {
  if (loading) return <Loading />;
  if (error) return <LoadError />;
  if (isEmpty) return <Empty>{emptyText}</Empty>;
  return children;
}
