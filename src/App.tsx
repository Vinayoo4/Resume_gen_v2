import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { Cursor } from './components/Cursor';
import { Navbar } from './components/Navbar';
import { Card } from './components/Card';
import { PortfolioBuilder } from './components/PortfolioBuilder';
import { Dashboard } from './components/Dashboard';
import { Palette, Code, Share, Zap, Users, BarChart3 } from 'lucide-react';

// Print a banner in the browser console
if (typeof window !== 'undefined' && window.console) {
  console.log('%ccreated by baba', 'color: white; background: #7c3aed; font-size: 2rem; padding: 8px 16px; border-radius: 8px;');
}

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <main className="container mx-auto px-6 pt-32 pb-20">
        <section className="text-center max-w-4xl mx-auto">
          <motion.h1 
            className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Create Your Dream Portfolio
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Generate stunning, responsive portfolios in minutes. Showcase your work with style and professionalism.
          </motion.p>
          
          <motion.div 
            className="flex justify-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.button
              onClick={() => navigate('/builder')}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold shadow-lg"
              whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
              whileTap={{ scale: 0.95 }}
            >
              <Zap className="h-5 w-5 mr-2 inline" />
              Get Started
            </motion.button>
            <motion.button
              onClick={() => navigate('/dashboard')}
              className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <BarChart3 className="h-5 w-5 mr-2 inline" />
              Dashboard
            </motion.button>
          </motion.div>
        </section>

        <section className="mt-32" id="features">
          <motion.h2 
            className="text-4xl font-bold text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Powerful Features
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card 
              title="AI-Powered Themes"
              description="Choose from professionally designed themes that adapt to your content automatically."
              icon={<Palette />}
            />
            <Card 
              title="One-Click Export"
              description="Download your portfolio as clean HTML/CSS files or deploy directly to the web."
              icon={<Code />}
            />
            <Card 
              title="Analytics Dashboard"
              description="Track visitors, engagement, and performance with detailed analytics."
              icon={<BarChart3 />}
            />
            <Card 
              title="Real-time Preview"
              description="See your changes instantly with our live preview feature."
              icon={<Zap />}
            />
            <Card 
              title="Team Collaboration"
              description="Share and collaborate on portfolios with team members and clients."
              icon={<Users />}
            />
            <Card 
              title="Easy Sharing"
              description="Share your portfolio with potential clients and employers with a single click."
              icon={<Share />}
            />
          </div>
        </section>

        <section className="mt-32 text-center" id="about">
          <motion.h2 
            className="text-4xl font-bold mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            About Portfolio Builder Pro
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            We believe everyone deserves a professional online presence. Our platform combines cutting-edge technology 
            with beautiful design to help you create portfolios that stand out. With advanced features like real-time 
            collaboration, analytics tracking, and AI-powered optimization, we're revolutionizing how professionals 
            showcase their work.
          </motion.p>
        </section>
      </main>
      
      <Toaster position="top-right" />
    </div>
  );
};

function App() {
  return (
    <Router>
      <Cursor />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/builder" element={<PortfolioBuilder />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;