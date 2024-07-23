import React from "react";
import { Link } from "react-router-dom";
import { useSpring, animated } from "react-spring";

function NotFound() {
  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 8000 },
  });

  const slideIn = useSpring({
    from: { transform: "translateY(-100px)" },
    to: { transform: "translateY(0)" },
    config: { tension: 170, friction: 26 },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <animated.div
        style={fadeIn}
        className="px-8 py-12 mx-4 bg-white shadow-lg rounded-lg sm:mx-auto sm:max-w-lg text-center"
      >
        <animated.h1
          style={slideIn}
          className="text-6xl font-bold text-gray-800 mb-4"
        >
          404
        </animated.h1>
        <animated.h2
          style={slideIn}
          className="text-2xl font-semibold text-gray-600 mb-4"
        >
          Page Not Found
        </animated.h2>
        <animated.p style={slideIn} className="text-gray-500 mb-8">
          Sorry, the page you are looking for does not exist.
        </animated.p>
        <animated.div style={slideIn}>
          <Link
            to="/"
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition duration-200"
          >
            Go to Homepage
          </Link>
        </animated.div>
      </animated.div>
    </div>
  );
}

export default NotFound;
