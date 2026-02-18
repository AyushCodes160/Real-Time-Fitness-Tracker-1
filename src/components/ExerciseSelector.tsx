import { Exercise } from '../types';

interface ExerciseSelectorProps {
  selectedExercise: Exercise;
  onSelectExercise: (exercise: Exercise) => void;
}

const ExerciseSelector: React.FC<ExerciseSelectorProps> = ({
  selectedExercise,
  onSelectExercise,
}) => {
  return (
    <div className="flex gap-4">
      <button
        className={`px-6 py-2 rounded font-bold transition-all duration-300 border ${selectedExercise === 'squat'
            ? 'bg-netflix-red border-netflix-red text-white scale-105 shadow-lg shadow-red-900/50'
            : 'bg-transparent border-gray-600 text-gray-400 hover:border-white hover:text-white'
          }`}
        onClick={() => onSelectExercise('squat')}
      >
        Squats
      </button>
      <button
        className={`px-6 py-2 rounded font-bold transition-all duration-300 border ${selectedExercise === 'pushup'
            ? 'bg-netflix-red border-netflix-red text-white scale-105 shadow-lg shadow-red-900/50'
            : 'bg-transparent border-gray-600 text-gray-400 hover:border-white hover:text-white'
          }`}
        onClick={() => onSelectExercise('pushup')}
      >
        Push-ups
      </button>
    </div>
  );
};

export default ExerciseSelector; 