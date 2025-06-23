export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  borderRadius: string;
  spacing: {
    small: string;
    medium: string;
    large: string;
  };
}

export const themes: Theme[] = [
  {
    id: 'modern',
    name: 'Modern Minimal',
    colors: {
      primary: '#2563eb',
      secondary: '#1e40af',
      background: '#ffffff',
      text: '#1f2937',
      accent: '#3b82f6'
    },
    fonts: {
      heading: 'Inter, sans-serif',
      body: 'Inter, sans-serif'
    },
    borderRadius: '0.5rem',
    spacing: {
      small: '1rem',
      medium: '2rem',
      large: '4rem'
    }
  },
  {
    id: 'classic',
    name: 'Classic Professional',
    colors: {
      primary: '#1e293b',
      secondary: '#334155',
      background: '#f8fafc',
      text: '#334155',
      accent: '#475569'
    },
    fonts: {
      heading: 'Georgia, serif',
      body: 'system-ui, sans-serif'
    },
    borderRadius: '0.25rem',
    spacing: {
      small: '1.25rem',
      medium: '2.5rem',
      large: '5rem'
    }
  },
  {
    id: 'creative',
    name: 'Creative Bold',
    colors: {
      primary: '#7c3aed',
      secondary: '#5b21b6',
      background: '#faf5ff',
      text: '#4c1d95',
      accent: '#8b5cf6'
    },
    fonts: {
      heading: 'Poppins, sans-serif',
      body: 'Poppins, sans-serif'
    },
    borderRadius: '1rem',
    spacing: {
      small: '1.5rem',
      medium: '3rem',
      large: '6rem'
    }
  },
  {
    id: 'darkmode',
    name: 'Dark Mode Pro',
    colors: {
      primary: '#0f172a',
      secondary: '#334155',
      background: '#18181b',
      text: '#f1f5f9',
      accent: '#38bdf8'
    },
    fonts: {
      heading: 'Roboto, sans-serif',
      body: 'Roboto, sans-serif'
    },
    borderRadius: '0.75rem',
    spacing: {
      small: '1rem',
      medium: '2rem',
      large: '4rem'
    }
  },
  {
    id: 'sunset',
    name: 'Sunset Vibes',
    colors: {
      primary: '#ff7e5f',
      secondary: '#feb47b',
      background: '#fff5e6',
      text: '#3d2c29',
      accent: '#ffb347'
    },
    fonts: {
      heading: 'Montserrat, sans-serif',
      body: 'Montserrat, sans-serif'
    },
    borderRadius: '2rem',
    spacing: {
      small: '1.2rem',
      medium: '2.4rem',
      large: '4.8rem'
    }
  },
  {
    id: 'oceanic',
    name: 'Oceanic Blue',
    colors: {
      primary: '#0077b6',
      secondary: '#00b4d8',
      background: '#caf0f8',
      text: '#03045e',
      accent: '#48cae4'
    },
    fonts: {
      heading: 'Lato, sans-serif',
      body: 'Lato, sans-serif'
    },
    borderRadius: '1.5rem',
    spacing: {
      small: '1rem',
      medium: '2rem',
      large: '4rem'
    }
  },
  {
    id: 'forest',
    name: 'Forest Green',
    colors: {
      primary: '#166534',
      secondary: '#22c55e',
      background: '#f0fdf4',
      text: '#14532d',
      accent: '#4ade80'
    },
    fonts: {
      heading: 'Merriweather, serif',
      body: 'Open Sans, sans-serif'
    },
    borderRadius: '1rem',
    spacing: {
      small: '1.1rem',
      medium: '2.2rem',
      large: '4.4rem'
    }
  },
  {
    id: 'retro',
    name: 'Retro Pop',
    colors: {
      primary: '#ff006e',
      secondary: '#8338ec',
      background: '#fff0f3',
      text: '#3a0ca3',
      accent: '#fb5607'
    },
    fonts: {
      heading: 'Bangers, cursive',
      body: 'Quicksand, sans-serif'
    },
    borderRadius: '0.5rem',
    spacing: {
      small: '1.3rem',
      medium: '2.6rem',
      large: '5.2rem'
    }
  }
];