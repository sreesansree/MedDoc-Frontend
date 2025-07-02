import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

const AnimateOnScroll = ({ children, animation = "fadeIn", delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (domRef.current) {
      observer.observe(domRef.current);
    }

    return () => {
      if (domRef.current) {
        observer.unobserve(domRef.current);
      }
    };
  }, []);

  const animations = {
    fadeIn: `transition-opacity duration-1000 ${
      isVisible ? "opacity-100" : "opacity-0"
    }`,
    slideUp: `transform transition-all duration-700 ease-out ${
      isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
    }`,
    slideLeft: `transform transition-all duration-700 ease-out ${
      isVisible ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"
    }`,
    slideRight: `transform transition-all duration-700 ease-out ${
      isVisible ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0"
    }`,
    zoomIn: `transform transition-all duration-700 ease-out ${
      isVisible ? "scale-100 opacity-100" : "scale-90 opacity-0"
    }`,
  };

  return (
    <div 
      ref={domRef} 
      className={`${animations[animation]} delay-${delay} overflow-hidden`}
      style={{
        // Prevent transform from causing overflow
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden'
      }}
    >
      {children}
    </div>
  );
};

AnimateOnScroll.propTypes = {
  children: PropTypes.node.isRequired,
  animation: PropTypes.oneOf([
    "fadeIn",
    "slideUp",
    "slideLeft",
    "slideRight",
    "zoomIn",
  ]),
  delay: PropTypes.number,
};

AnimateOnScroll.defaultProps = {
  animation: "fadeIn",
  delay: 0,
};

export default AnimateOnScroll;