import { Link } from 'react-router-dom';

const variants = {
  primary: 'bg-cerve-gradient hover:bg-cerve-gradient-hover text-white glow-primary',
  secondary: 'bg-cerve-elevated border border-cerve-primary/30 text-cerve-text hover:border-cerve-primary/60 hover:bg-cerve-primary/10',
  outline: 'border border-cerve-muted/30 text-cerve-muted hover:border-cerve-secondary/50 hover:text-cerve-secondary',
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export default function Button({ children, variant = 'primary', size = 'md', href, to, className = '', ...props }) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-300 ${variants[variant]} ${sizes[size]} ${className}`;

  if (to) {
    return <Link to={to} className={classes} {...props}>{children}</Link>;
  }

  if (href) {
    return <a href={href} className={classes} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>;
  }

  return <button className={classes} {...props}>{children}</button>;
}
