import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ProblemSection from '../components/ProblemSection';
import SolutionSection from '../components/SolutionSection';
import TechnologySection from '../components/TechnologySection';
import BenefitsSection from '../components/BenefitsSection';
import Footer from '../components/Footer';

const Landing = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <TechnologySection />
      <BenefitsSection />
      <Footer />
    </div>
  );
};

export default Landing;
