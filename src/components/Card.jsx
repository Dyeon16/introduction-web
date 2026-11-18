export default function Card({ as: Tag = 'div', hover = false, className = '', children, ...rest }) {
  const cls = `card${hover ? ' card--hover' : ''}${className ? ` ${className}` : ''}`;
  return (
    <Tag className={cls} {...rest}>
      {children}
    </Tag>
  );
}
