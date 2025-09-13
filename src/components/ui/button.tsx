import { ButtonHTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', children, ...props }, ref) => {
    // Filter out props that conflict between React and Framer Motion
    const {
      onDrag: _onDrag,
      onDragEnd: _onDragEnd,
      onDragStart: _onDragStart,
      onAnimationStart: _onAnimationStart,
      onAnimationEnd: _onAnimationEnd,
      onAnimationIteration: _onAnimationIteration,
      ...buttonProps
    } = props;

    return (
      <motion.button
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group',
          {
                        'bg-gradient-to-r from-primary-500 to-primary-600 text-slate-100 hover:from-primary-600 hover:to-primary-700 shadow-lg hover:shadow-primary-500/25 border border-primary-500/20': variant === 'default',
            'bg-gradient-to-r from-red-500 to-red-600 text-slate-100 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-red-500/25 border border-red-500/20': variant === 'destructive',
            'border-2 border-border bg-background/50 hover:bg-background hover:border-primary-500/50 hover:shadow-lg hover:shadow-primary-500/10 backdrop-blur-sm': variant === 'outline',
            'bg-gradient-to-r from-muted to-muted/80 text-muted-foreground hover:from-muted/80 hover:to-muted border border-border/50': variant === 'secondary',
            'hover:bg-muted/50 hover:text-foreground': variant === 'ghost',
            'text-primary underline-offset-4 hover:underline': variant === 'link',
          },
          {
            'h-10 px-6 py-2': size === 'default',
            'h-8 px-4 py-1 text-xs': size === 'sm',
            'h-12 px-8 py-3 text-base': size === 'lg',
            'h-10 w-10': size === 'icon',
          },
          className
        )}
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        {...buttonProps}
      >
        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6 }}
        />
        {children}
      </motion.button>
    );
  }
);
Button.displayName = 'Button';

export { Button };
