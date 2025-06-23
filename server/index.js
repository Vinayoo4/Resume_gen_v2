import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// In-memory storage for portfolios (in production, use a database)
let portfolios = new Map();
let templates = new Map();

// Initialize with sample templates
templates.set('modern-minimal', {
  id: 'modern-minimal',
  name: 'Modern Minimal',
  preview: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop',
  category: 'minimal',
  isPremium: false
});

templates.set('creative-bold', {
  id: 'creative-bold',
  name: 'Creative Bold',
  preview: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=300&fit=crop',
  category: 'creative',
  isPremium: true
});

templates.set('professional-dark', {
  id: 'professional-dark',
  name: 'Professional Dark',
  preview: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop',
  category: 'professional',
  isPremium: false
});

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Get all templates
app.get('/api/templates', (req, res) => {
  const { category, premium } = req.query;
  let filteredTemplates = Array.from(templates.values());
  
  if (category && category !== 'all') {
    filteredTemplates = filteredTemplates.filter(t => t.category === category);
  }
  
  if (premium === 'false') {
    filteredTemplates = filteredTemplates.filter(t => !t.isPremium);
  }
  
  res.json(filteredTemplates);
});

// Save portfolio
app.post('/api/portfolios', (req, res) => {
  try {
    const { id, ...portfolioData } = req.body;
    const portfolioId = id || Date.now().toString();
    
    const portfolio = {
      id: portfolioId,
      ...portfolioData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    portfolios.set(portfolioId, portfolio);
    
    res.json({ 
      success: true, 
      id: portfolioId,
      message: 'Portfolio saved successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to save portfolio',
      error: error.message 
    });
  }
});

// Get portfolio by ID
app.get('/api/portfolios/:id', (req, res) => {
  const { id } = req.params;
  const portfolio = portfolios.get(id);
  
  if (!portfolio) {
    return res.status(404).json({ 
      success: false, 
      message: 'Portfolio not found' 
    });
  }
  
  res.json(portfolio);
});

// Get all portfolios (for dashboard)
app.get('/api/portfolios', (req, res) => {
  const allPortfolios = Array.from(portfolios.values());
  res.json(allPortfolios);
});

// Delete portfolio
app.delete('/api/portfolios/:id', (req, res) => {
  const { id } = req.params;
  
  if (portfolios.has(id)) {
    portfolios.delete(id);
    res.json({ 
      success: true, 
      message: 'Portfolio deleted successfully' 
    });
  } else {
    res.status(404).json({ 
      success: false, 
      message: 'Portfolio not found' 
    });
  }
});

// Upload image
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded' 
      });
    }
    
    const imageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    
    res.json({ 
      success: true, 
      url: imageUrl,
      filename: req.file.filename 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to upload image',
      error: error.message 
    });
  }
});

// Generate portfolio HTML
app.post('/api/generate', (req, res) => {
  try {
    const { portfolioData, templateId } = req.body;
    
    // Generate HTML based on template and data
    const html = generatePortfolioHTML(portfolioData, templateId);
    
    res.json({ 
      success: true, 
      html: html,
      downloadUrl: `data:text/html;charset=utf-8,${encodeURIComponent(html)}`
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate portfolio',
      error: error.message 
    });
  }
});

// Analytics endpoint
app.get('/api/analytics/:portfolioId', (req, res) => {
  const { portfolioId } = req.params;
  
  // Mock analytics data
  const analytics = {
    views: Math.floor(Math.random() * 1000) + 100,
    uniqueVisitors: Math.floor(Math.random() * 500) + 50,
    bounceRate: (Math.random() * 30 + 20).toFixed(1),
    avgTimeOnSite: `${Math.floor(Math.random() * 3) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
    topPages: [
      { page: 'Home', views: Math.floor(Math.random() * 300) + 100 },
      { page: 'Projects', views: Math.floor(Math.random() * 200) + 50 },
      { page: 'About', views: Math.floor(Math.random() * 150) + 30 }
    ],
    recentVisits: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      visits: Math.floor(Math.random() * 50) + 10
    })).reverse()
  };
  
  res.json(analytics);
});

// Helper function to generate HTML
function generatePortfolioHTML(data, templateId) {
  const { personalInfo, projects, experiences, education, skills } = data;
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${personalInfo.name} - Portfolio</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { font-family: 'Inter', sans-serif; }
        .gradient-bg { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    </style>
</head>
<body class="bg-gray-50">
    <header class="gradient-bg text-white py-20">
        <div class="container mx-auto px-6 text-center">
            <h1 class="text-5xl font-bold mb-4">${personalInfo.name}</h1>
            <p class="text-xl mb-6">${personalInfo.title}</p>
            <p class="text-lg opacity-90">${personalInfo.bio}</p>
        </div>
    </header>
    
    <main class="container mx-auto px-6 py-12">
        ${projects.length > 0 ? `
        <section class="mb-16">
            <h2 class="text-3xl font-bold mb-8">Projects</h2>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                ${projects.map(project => `
                <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                    ${project.image ? `<img src="${project.image}" alt="${project.title}" class="w-full h-48 object-cover">` : ''}
                    <div class="p-6">
                        <h3 class="text-xl font-semibold mb-2">${project.title}</h3>
                        <p class="text-gray-600 mb-4">${project.description}</p>
                        ${project.technologies.length > 0 ? `
                        <div class="flex flex-wrap gap-2 mb-4">
                            ${project.technologies.map(tech => `<span class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">${tech}</span>`).join('')}
                        </div>
                        ` : ''}
                        ${project.link ? `<a href="${project.link}" class="text-blue-600 hover:underline">View Project</a>` : ''}
                    </div>
                </div>
                `).join('')}
            </div>
        </section>
        ` : ''}
        
        ${experiences.length > 0 ? `
        <section class="mb-16">
            <h2 class="text-3xl font-bold mb-8">Experience</h2>
            <div class="space-y-6">
                ${experiences.map(exp => `
                <div class="bg-white rounded-lg shadow-lg p-6">
                    <h3 class="text-xl font-semibold">${exp.position}</h3>
                    <p class="text-blue-600 font-medium">${exp.company}</p>
                    <p class="text-gray-500 mb-3">${exp.duration}</p>
                    <p class="text-gray-700">${exp.description}</p>
                </div>
                `).join('')}
            </div>
        </section>
        ` : ''}
    </main>
    
    <footer class="bg-gray-800 text-white py-8">
        <div class="container mx-auto px-6 text-center">
            <p>&copy; 2024 ${personalInfo.name}. All rights reserved.</p>
            <div class="mt-4 space-x-4">
                ${personalInfo.email ? `<a href="mailto:${personalInfo.email}" class="hover:text-blue-400">Email</a>` : ''}
                ${personalInfo.github ? `<a href="${personalInfo.github}" class="hover:text-blue-400">GitHub</a>` : ''}
                ${personalInfo.linkedin ? `<a href="${personalInfo.linkedin}" class="hover:text-blue-400">LinkedIn</a>` : ''}
            </div>
        </div>
    </footer>
</body>
</html>
  `;
}

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../dist')));

// SPA fallback: serve index.html for any non-API route
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  } else {
    res.status(404).end();
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Portfolio Builder API running on http://localhost:${PORT}`);
});