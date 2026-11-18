export default function Button({ as: Tag = 'button', variant = 'primary', className = '', children, ...rest }) {
  const cls = `btn btn--${variant}${className ? ` ${className}` : ''}`;
  return (
    <Tag className={cls} {...rest}>
      {children}
    </Tag>
  );
}
