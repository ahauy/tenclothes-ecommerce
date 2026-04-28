import React from 'react';
import BestSeller from "../components/BestSeller";
import Hero from "../components/Hero"
import LatestCollection from "../components/LatestCollection";
import NewsletterBox from "../components/NewsletterBox";
import OurPolicy from "../components/OurPolicy";

const Home = () => {
  return (
    <div>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        .animate-delay-1 { animation-delay: 0.15s; opacity: 0; }
        .animate-delay-2 { animation-delay: 0.3s; opacity: 0; }
        .animate-delay-3 { animation-delay: 0.45s; opacity: 0; }
        .animate-delay-4 { animation-delay: 0.6s; opacity: 0; }
      `}</style>

      <div className="animate-fade-in-up">
        <Hero />
      </div>
      
      <div className="animate-fade-in-up animate-delay-1">
        <LatestCollection />
      </div>
      
      <div className="animate-fade-in-up animate-delay-2">
        <BestSeller />
      </div>
      
      <div className="animate-fade-in-up animate-delay-3">
        <OurPolicy />
      </div>
      
      <div className="animate-fade-in-up animate-delay-4">
        <NewsletterBox />
      </div>
    </div>
  );
};

export default Home;