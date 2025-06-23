import { motion } from 'framer-motion';

interface CardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export const Card = ({ title, description, icon }: CardProps) => {
  return (
    <motion.div
      className="bg-white p-6 rounded-xl shadow-lg"
      whileHover={{ 
        rotateY: 180,
        transition: { duration: 0.6 }
      }}
      style={{ perspective: 1000 }}
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="text-4xl text-blue-600">
          {icon}
        </div>
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </motion.div>
  );
};