import { Link } from 'react-router-dom';

const variants = {
  primary: 'bg-claw-gradient hover:bg-claw-gradient-hover text-white glow-primary',
  secondary: 'bg-claw-elevated border border-claw-primary/30 text-claw-text hover:border-claw-primary/60 hover:bg-claw-primary/10',
  outline: 'border border-claw-muted/30 text-claw-muted hover:border-claw-secondary/50 hover:text-claw-secondary',
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
