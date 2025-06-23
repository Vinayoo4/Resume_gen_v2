import { motion } from 'framer-motion';
import { Theme, themes } from '../themes';
import { Paintbrush } from 'lucide-react';

interface ThemeSelectorProps {
  selectedTheme: Theme;
  onThemeSelect: (theme: Theme) => void;
}

export const ThemeSelector = ({ selectedTheme, onThemeSelect }: ThemeSelectorProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Paintbrush className="h-5 w-5 text-gray-600" />
        <h3 className="text-lg font-medium text-gray-900">Select Theme</h3>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {themes.map((theme) => (
          <motion.div
            key={theme.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onThemeSelect(theme)}
            className={`cursor-pointer rounded-lg p-4 border-2 ${
              selectedTheme.id === theme.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="space-y-3">
              <div className="text-sm font-medium">{theme.name}</div>
              <div className="flex space-x-2">
                {Object.values(theme.colors).map((color, index) => (
                  <div
                    key={index}
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div
                className="text-xs"
                style={{ fontFamily: theme.fonts.body }}
              >
                Sample Text
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};