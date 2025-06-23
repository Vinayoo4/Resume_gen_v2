import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Save, Eye, Download, User, Briefcase, Award, Book, Palette, Settings } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import toast from 'react-hot-toast';
import { Theme, themes } from '../themes';
import { ThemeSelector } from './ThemeSelector';
import { TemplateSelector } from './TemplateSelector';
import { ImageUpload } from './ImageUpload';
import { SkillsManager } from './SkillsManager';
import { PreviewModal } from './PreviewModal';
import { portfolioAPI } from '../services/api';

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  technologies: string[];
}

interface Experience {
  id: string;
  company: string;
  position: string;
  duration: string;
  description: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  duration: string;
  description: string;
}

interface PersonalInfo {
  name: string;
  title: string;
  bio: string;
  avatar: string;
  location: string;
  email: string;
  github: string;
  linkedin: string;
  twitter: string;
  accentColor: string;
}

interface Skill {
  id: string;
  name: string;
  level: number;
  category?: string;
}

export const PortfolioBuilder = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<Theme>(themes[0]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('modern-minimal');
  const [saving, setSaving] = useState(false);
  
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: '',
    title: '',
    bio: '',
    avatar: '',
    location: '',
    email: '',
    github: '',
    linkedin: '',
    twitter: '',
    accentColor: '#3b82f6'
  });

  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);

  const addProject = () => {
    setProjects([
      ...projects,
      {
        id: Date.now().toString(),
        title: '',
        description: '',
        image: '',
        link: '',
        technologies: []
      },
    ]);
  };

  const addExperience = () => {
    setExperiences([
      ...experiences,
      {
        id: Date.now().toString(),
        company: '',
        position: '',
        duration: '',
        description: ''
      }
    ]);
  };

  const addEducation = () => {
    setEducation([
      ...education,
      {
        id: Date.now().toString(),
        institution: '',
        degree: '',
        duration: '',
        description: ''
      }
    ]);
  };

  const removeItem = (id: string, setter: Function, items: any[]) => {
    setter(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: string, value: any, setter: Function, items: any[]) => {
    setter(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const portfolioData = {
        personalInfo,
        projects,
        experiences,
        education,
        skills,
        theme: selectedTheme,
        template: selectedTemplate
      };

      const result = await portfolioAPI.save(portfolioData);
      if (result.success) {
        toast.success('Portfolio saved successfully!');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save portfolio');
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async () => {
    try {
      const portfolioData = { personalInfo, projects, experiences, education, skills };
      const result = await portfolioAPI.generate(portfolioData, selectedTemplate);
      
      if (result.success) {
        const link = document.createElement('a');
        link.href = result.downloadUrl;
        link.download = `${personalInfo.name || 'portfolio'}.html`;
        link.click();
        toast.success('Portfolio exported successfully!');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export portfolio');
    }
  };

  const TabButton = ({ id, label, icon: Icon }: { id: string, label: string, icon: any }) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setActiveTab(id)}
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all w-full text-left ${
        activeTab === id 
          ? `text-white shadow-lg` 
          : 'hover:bg-gray-100 text-gray-700'
      }`}
      style={{
        backgroundColor: activeTab === id ? selectedTheme.colors.primary : 'transparent',
      }}
    >
      <Icon className="h-5 w-5" />
      <span className="font-medium">{label}</span>
    </motion.button>
  );

  const portfolioData = { personalInfo, projects, experiences, education, skills };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: selectedTheme.colors.background }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Portfolio Builder</h1>
            <p className="text-gray-600">Create your professional portfolio in minutes</p>
          </div>
          <div className="flex space-x-3">
            <motion.button
              onClick={() => setShowPreview(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </motion.button>
            <motion.button
              onClick={handleExport}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </motion.button>
            <motion.button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center px-6 py-2 text-white rounded-lg disabled:opacity-50"
              style={{ backgroundColor: selectedTheme.colors.primary }}
              whileHover={{ scale: saving ? 1 : 1.05 }}
              whileTap={{ scale: saving ? 1 : 0.95 }}
            >
              {saving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {saving ? 'Saving...' : 'Save Portfolio'}
            </motion.button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-12">
            {/* Enhanced Sidebar Navigation */}
            <div className="col-span-3 bg-gray-50 p-6 border-r border-gray-200">
              <nav className="space-y-2">
                <TabButton id="personal" label="Personal Info" icon={User} />
                <TabButton id="projects" label="Projects" icon={Briefcase} />
                <TabButton id="experience" label="Experience" icon={Award} />
                <TabButton id="education" label="Education" icon={Book} />
                <TabButton id="skills" label="Skills" icon={Settings} />
                <TabButton id="templates" label="Templates" icon={Palette} />
                <TabButton id="theme" label="Themes" icon={Palette} />
              </nav>
            </div>

            {/* Main Content Area */}
            <div className="col-span-9 p-8">
              <AnimatePresence mode="wait">
                {activeTab === 'personal' && (
                  <motion.div
                    key="personal"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          value={personalInfo.name}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Professional Title</label>
                        <input
                          type="text"
                          value={personalInfo.title}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, title: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., Full Stack Developer"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Professional Bio</label>
                        <textarea
                          value={personalInfo.bio}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, bio: e.target.value })}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Tell us about yourself and your professional journey..."
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
                        <ImageUpload
                          onImageUpload={(url) => setPersonalInfo({ ...personalInfo, avatar: url })}
                          currentImage={personalInfo.avatar}
                        />
                      </div>
                      {/* Social Links and Contact Info */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                        <input
                          type="text"
                          value={personalInfo.location}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="City, Country"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          value={personalInfo.email}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="your.email@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">GitHub URL</label>
                        <input
                          type="text"
                          value={personalInfo.github}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, github: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="https://github.com/username"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
                        <input
                          type="text"
                          value={personalInfo.linkedin}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, linkedin: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="https://linkedin.com/in/username"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'skills' && (
                  <motion.div
                    key="skills"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h2 className="text-2xl font-bold mb-6">Skills & Expertise</h2>
                    <SkillsManager skills={skills} onSkillsChange={setSkills} />
                  </motion.div>
                )}

                {activeTab === 'templates' && (
                  <motion.div
                    key="templates"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h2 className="text-2xl font-bold mb-6">Choose Template</h2>
                    <TemplateSelector
                      selectedTemplate={selectedTemplate}
                      onTemplateSelect={setSelectedTemplate}
                    />
                  </motion.div>
                )}

                {activeTab === 'projects' && (
                  <motion.div
                    key="projects"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold">Projects</h2>
                      <motion.button
                        type="button"
                        onClick={addProject}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        Add Project
                      </motion.button>
                    </div>

                    <div className="space-y-6">
                      {projects.map((project) => (
                        <motion.div
                          key={project.id}
                          className="border border-gray-200 p-6 rounded-lg"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1 mr-4">
                              <input
                                type="text"
                                value={project.title}
                                onChange={(e) => updateItem(project.id, 'title', e.target.value, setProjects, projects)}
                                placeholder="Project Title"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                            <motion.button
                              type="button"
                              onClick={() => removeItem(project.id, setProjects, projects)}
                              className="text-red-600 hover:text-red-800"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Trash2 className="h-5 w-5" />
                            </motion.button>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <textarea
                                value={project.description}
                                onChange={(e) => updateItem(project.id, 'description', e.target.value, setProjects, projects)}
                                placeholder="Project Description"
                                rows={3}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Project Image</label>
                              <ImageUpload
                                onImageUpload={(url) => updateItem(project.id, 'image', url, setProjects, projects)}
                                currentImage={project.image}
                              />
                            </div>

                            <div>
                              <input
                                type="text"
                                value={project.link}
                                onChange={(e) => updateItem(project.id, 'link', e.target.value, setProjects, projects)}
                                placeholder="Project URL"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>

                            <div>
                              <input
                                type="text"
                                placeholder="Technologies used (comma-separated)"
                                onChange={(e) => updateItem(
                                  project.id,
                                  'technologies',
                                  e.target.value.split(',').map(tech => tech.trim()).filter(tech => tech),
                                  setProjects,
                                  projects
                                )}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'experience' && (
                  <motion.div
                    key="experience"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold">Work Experience</h2>
                      <motion.button
                        type="button"
                        onClick={addExperience}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        Add Experience
                      </motion.button>
                    </div>

                    <div className="space-y-6">
                      {experiences.map((experience) => (
                        <motion.div
                          key={experience.id}
                          className="border border-gray-200 p-6 rounded-lg"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1 mr-4">
                              <input
                                type="text"
                                value={experience.company}
                                onChange={(e) => updateItem(experience.id, 'company', e.target.value, setExperiences, experiences)}
                                placeholder="Company Name"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                            <motion.button
                              type="button"
                              onClick={() => removeItem(experience.id, setExperiences, experiences)}
                              className="text-red-600 hover:text-red-800"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Trash2 className="h-5 w-5" />
                            </motion.button>
                          </div>

                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <input
                                type="text"
                                value={experience.position}
                                onChange={(e) => updateItem(experience.id, 'position', e.target.value, setExperiences, experiences)}
                                placeholder="Position"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              />
                              <input
                                type="text"
                                value={experience.duration}
                                onChange={(e) => updateItem(experience.id, 'duration', e.target.value, setExperiences, experiences)}
                                placeholder="Duration (e.g., Jan 2020 - Present)"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                            <textarea
                              value={experience.description}
                              onChange={(e) => updateItem(experience.id, 'description', e.target.value, setExperiences, experiences)}
                              placeholder="Job Description"
                              rows={3}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'education' && (
                  <motion.div
                    key="education"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold">Education</h2>
                      <motion.button
                        type="button"
                        onClick={addEducation}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        Add Education
                      </motion.button>
                    </div>

                    <div className="space-y-6">
                      {education.map((edu) => (
                        <motion.div
                          key={edu.id}
                          className="border border-gray-200 p-6 rounded-lg"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1 mr-4">
                              <input
                                type="text"
                                value={edu.institution}
                                onChange={(e) => updateItem(edu.id, 'institution', e.target.value, setEducation, education)}
                                placeholder="Institution Name"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                            <motion.button
                              type="button"
                              onClick={() => removeItem(edu.id, setEducation, education)}
                              className="text-red-600 hover:text-red-800"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Trash2 className="h-5 w-5" />
                            </motion.button>
                          </div>

                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <input
                                type="text"
                                value={edu.degree}
                                onChange={(e) => updateItem(edu.id, 'degree', e.target.value, setEducation, education)}
                                placeholder="Degree"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              />
                              <input
                                type="text"
                                value={edu.duration}
                                onChange={(e) => updateItem(edu.id, 'duration', e.target.value, setEducation, education)}
                                placeholder="Duration (e.g., 2016 - 2020)"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                            <textarea
                              value={edu.description}
                              onChange={(e) => updateItem(edu.id, 'description', e.target.value, setEducation, education)}
                              placeholder="Additional Information"
                              rows={3}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'theme' && (
                  <motion.div
                    key="theme"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h2 className="text-2xl font-bold mb-6">Theme Customization</h2>
                    <ThemeSelector
                      selectedTheme={selectedTheme}
                      onThemeSelect={setSelectedTheme}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        portfolioData={portfolioData}
        selectedTheme={selectedTheme}
      />
    </div>
  );
};