import React from 'react';

// Strip framer-motion specific props to prevent DOM warnings
const stripMotionProps = ({
  initial, animate, exit, whileHover, whileInView,
  viewport, transition, variants, layout, layoutId,
  ...rest
}) => rest;

const createMotionComponent = (Tag) =>
  React.forwardRef(({ children, ...props }, ref) => (
    <Tag ref={ref} {...stripMotionProps(props)}>{children}</Tag>
  ));

export const motion = {
  div: createMotionComponent('div'),
  section: createMotionComponent('section'),
  span: createMotionComponent('span'),
  h1: createMotionComponent('h1'),
  p: createMotionComponent('p'),
  article: createMotionComponent('article'),
  ul: createMotionComponent('ul'),
  li: createMotionComponent('li'),
};

export const AnimatePresence = ({ children }) => <>{children}</>;

export const useAnimation = () => ({ start: vi.fn(), stop: vi.fn() });
export const useInView = () => true;
