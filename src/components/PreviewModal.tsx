import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Share2, Eye } from 'lucide-react';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolioData: any;
  selectedTheme: any;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
  isOpen,
  onClose,
  portfolioData,
  selectedTheme
}) => {
  const { personalInfo, projects, experiences } = portfolioData;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex items-center justify-center min-h-screen px-4">
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
            
            <motion.div
              className="relative bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <Eye className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-semibold">Portfolio Preview</h2>
                </div>
                <div className="flex items-center space-x-2">
                  <motion.button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Download className="h-4 w-4 mr-2 inline" />
                    Export
                  </motion.button>
                  <motion.button
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Share2 className="h-4 w-4 mr-2 inline" />
                    Share
                  </motion.button>
                  <motion.button
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-gray-600"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.button>
                </div>
              </div>

              {/* Preview Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                <div 
                  className="min-h-full"
                  style={{ 
                    backgroundColor: selectedTheme.colors.background,
                    fontFamily: selectedTheme.fonts.body 
                  }}
                >
                  {/* Hero Section */}
                  <div 
                    className="py-20 px-6 text-center text-white"
                    style={{ 
                      background: `linear-gradient(135deg, ${selectedTheme.colors.primary} 0%, ${selectedTheme.colors.secondary} 100%)` 
                    }}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="max-w-4xl mx-auto"
                    >
                      <h1 
                        className="text-5xl font-bold mb-4"
                        style={{ fontFamily: selectedTheme.fonts.heading }}
                      >
                        {personalInfo.name || 'Your Name'}
                      </h1>
                      <p className="text-xl mb-6">
                        {personalInfo.title || 'Your Professional Title'}
                      </p>
                      <p className="text-lg opacity-90">
                        {personalInfo.bio || 'Your professional bio will appear here...'}
                      </p>
                    </motion.div>
                  </div>

                  {/* Projects Section */}
                  {projects.length > 0 && (
                    <div className="py-16 px-6">
                      <div className="max-w-6xl mx-auto">
                        <h2 
                          className="text-3xl font-bold mb-12 text-center"
                          style={{ 
                            color: selectedTheme.colors.text,
                            fontFamily: selectedTheme.fonts.heading 
                          }}
                        >
                          Featured Projects
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                          {projects.slice(0, 6).map((project, index) => (
                            <motion.div
                              key={project.id}
                              className="bg-white rounded-lg shadow-lg overflow-hidden"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              style={{ borderRadius: selectedTheme.borderRadius }}
                            >
                              {project.image && (
                                <img
                                  src={project.image}
                                  alt={project.title}
                                  className="w-full h-48 object-cover"
                                />
                              )}
                              <div className="p-6">
                                <h3 
                                  className="text-xl font-semibold mb-2"
                                  style={{ color: selectedTheme.colors.text }}
                                >
                                  {project.title || 'Project Title'}
                                </h3>
                                <p className="text-gray-600 mb-4">
                                  {project.description || 'Project description...'}
                                </p>
                                {project.technologies && project.technologies.length > 0 && (
                                  <div className="flex flex-wrap gap-2">
                                    {project.technologies.map((tech, techIndex) => (
                                      <span
                                        key={techIndex}
                                        className="px-2 py-1 text-sm rounded"
                                        style={{
                                          backgroundColor: `${selectedTheme.colors.primary}20`,
                                          color: selectedTheme.colors.primary
                                        }}
                                      >
                                        {tech}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Experience Section */}
                  {experiences.length > 0 && (
                    <div 
                      className="py-16 px-6"
                      style={{ backgroundColor: `${selectedTheme.colors.background}f0` }}
                    >
                      <div className="max-w-4xl mx-auto">
                        <h2 
                          className="text-3xl font-bold mb-12 text-center"
                          style={{ 
                            color: selectedTheme.colors.text,
                            fontFamily: selectedTheme.fonts.heading 
                          }}
                        >
                          Experience
                        </h2>
                        <div className="space-y-8">
                          {experiences.slice(0, 4).map((exp, index) => (
                            <motion.div
                              key={exp.id}
                              className="bg-white p-6 rounded-lg shadow-sm"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              style={{ borderRadius: selectedTheme.borderRadius }}
                            >
                              <h3 
                                className="text-xl font-semibold"
                                style={{ color: selectedTheme.colors.text }}
                              >
                                {exp.position || 'Position Title'}
                              </h3>
                              <p 
                                className="font-medium mb-2"
                                style={{ color: selectedTheme.colors.primary }}
                              >
                                {exp.company || 'Company Name'}
                              </p>
                              <p className="text-gray-500 mb-3">
                                {exp.duration || 'Duration'}
                              </p>
                              <p className="text-gray-700">
                                {exp.description || 'Job description...'}
                              </p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div 
                    className="py-12 px-6 text-center text-white"
                    style={{ backgroundColor: selectedTheme.colors.text }}
                  >
                    <p>&copy; 2024 {personalInfo.name || 'Your Name'}. All rights reserved.</p>
                    <div className="mt-4 space-x-6">
                      {personalInfo.email && (
                        <a href={`mailto:${personalInfo.email}`} className="hover:opacity-80">
                          Email
                        </a>
                      )}
                      {personalInfo.github && (
                        <a href={personalInfo.github} className="hover:opacity-80">
                          GitHub
                        </a>
                      )}
                      {personalInfo.linkedin && (
                        <a href={personalInfo.linkedin} className="hover:opacity-80">
                          LinkedIn
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};