import { forwardRef } from 'react';

function stripMotionProps(props) {
  const {
    initial, animate, exit, whileHover, whileTap, whileInView, whileFocus, whileDrag,
    variants, transition, layout, layoutId, drag, dragConstraints,
    viewport, onAnimationStart, onAnimationComplete,
    ...rest
  } = props;
  return rest;
}

const motion = new Proxy({}, {
  get(_, tag) {
    return forwardRef(function MotionMock(props, ref) {
      const Tag = tag;
      return <Tag ref={ref} {...stripMotionProps(props)} />;
    });
  },
});

function AnimatePresence({ children }) {
  return children;
}

export { motion, AnimatePresence };
