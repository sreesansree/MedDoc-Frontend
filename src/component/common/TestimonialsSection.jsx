import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(3);

  const testimonials = [
    {
      initials: "GR",
      name: "Govindan RK",
      role: "Cardiology Patient",
      quote:
        `"The cardiology consultation was thorough and the doctor was very patient with all my questions. Highly recommend MedDoc!"`,
    },
    {
      initials: "SK",
      name: "Saranya KH",
      role: "Pediatrics Patient",
      quote:
        `"As a busy mom, online consultations have been a lifesaver. The pediatrician was wonderful with my child."`,
    },
    {
      initials: "PM",
      name: "Priya M",
      role: "Dermatology Patient",
      quote:
        `"The dermatologist helped clear my skin issues in just 2 weeks. The follow-up care was exceptional."`,
    },
    {
      initials: "AK",
      name: "Arjun K",
      role: "Orthopedics Patient",
      quote:
        `"After my sports injury, the orthopedic specialist provided excellent care and a clear recovery plan."`,
    },
    {
      initials: "NS",
      name: "Neha S",
      role: "General Medicine",
      quote:
       ` "The doctor was very attentive and explained everything in simple terms. The prescription was delivered quickly too."`,
    },
    {
      initials: "VR",
      name: "Vikram R",
      role: "ENT Specialist",
      quote:
       ` "Had chronic sinus issues for years. The ENT specialist diagnosed the root cause and I'm finally getting relief."`,
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setCardsToShow(3);
      } else if (window.innerWidth >= 768) {
        setCardsToShow(2);
      } else {
        setCardsToShow(1);
      }
      setCurrentIndex(0); // Reset to first card on resize
    };

    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = () => {
    if (currentIndex < testimonials.length - cardsToShow) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const goToSlide = (index) => {
    setCurrentIndex(index * cardsToShow);
  };

  return (
    <div className="bg-amber-200 dark:bg-gray-900 p-10 rounded-lg mb-16">
      <h2 className="text-3xl font-bold text-center mb-10">
        What Our Patients Say
      </h2>

      <div className="relative">
        {/* Carousel Container */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / cardsToShow)}%)`,
              width: `${(testimonials.length / cardsToShow) * 100}%`,
            }}
          >
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-4"
                style={{ minWidth: `${100 / cardsToShow}%` }}
              >
                <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md h-full">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mr-4">
                      <span className="text-indigo-600 dark:text-indigo-300 font-bold">
                        {testimonial.initials}
                      </span>
                    </div>
                    <div>
                      <h5 className="text-lg font-semibold dark:text-white">
                        {testimonial.name}
                      </h5>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <p className="italic dark:text-gray-300">
                    {testimonial.quote}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          disabled={currentIndex === 0}
          className={`absolute left-0 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-600 p-2 rounded-full shadow-md hover:bg-indigo-50 dark:hover:bg-gray-500 transition-colors ${
            currentIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <FaChevronLeft className="h-6 w-6 text-indigo-600 dark:text-indigo-300" />
        </button>
        <button
          onClick={nextSlide}
          disabled={currentIndex >= testimonials.length - cardsToShow}
          className={`absolute right-0 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-600 p-2 rounded-full shadow-md hover:bg-indigo-50 dark:hover:bg-gray-500 transition-colors ${
            currentIndex >= testimonials.length - cardsToShow
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          <FaChevronRight className="h-6 w-6 text-indigo-600 dark:text-indigo-300" />
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({
          length: Math.ceil(testimonials.length / cardsToShow),
        }).map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full ${
              index === Math.floor(currentIndex / cardsToShow)
                ? "bg-indigo-600"
                : "bg-gray-300"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialsSection;
