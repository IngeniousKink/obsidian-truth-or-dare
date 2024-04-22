import React, { useEffect, useState } from 'react';

const transitionDuration = 500;

interface AnimatedContentProps {
  showFirstChild: boolean;
  direction: 'top' | 'bottom' | 'left' | 'right';
  children: [React.ReactNode, React.ReactNode];
}

const AnimatedContent: React.FC<AnimatedContentProps> = ({ showFirstChild, direction, children }) => {
  const [displayedChild, setDisplayedChild] = useState(showFirstChild ? 0 : 1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const targetChild = showFirstChild ? 0 : 1;
    if (targetChild !== displayedChild) {
      setIsTransitioning(true);
      setTimeout(() => {
        setDisplayedChild(targetChild);
        setIsTransitioning(false);
      }, transitionDuration);
    }
  }, [showFirstChild, displayedChild]);

  const translateDirection = {
    top: '-translate-y-full',
    bottom: 'translate-y-full',
    left: '-translate-x-full',
    right: 'translate-x-full',
  }[direction];

  return (
    <div className={`
      flex 
      items-center 
      text-center 
      justify-center 
      h-full 
      width-full 
      transition-transform 
      duration-${transitionDuration} 
      ease-in-out 
      ${isTransitioning ? translateDirection : 'translate-x-0 translate-y-0'}
    `}>
      {children[displayedChild]}
    </div>
  );
};

export default AnimatedContent;
