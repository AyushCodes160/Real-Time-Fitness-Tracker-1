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
        className={`px-4 py-2 rounded-lg transform transition-all duration-300 ${
          selectedExercise === 'squat'
            ? 'bg-blue-600 text-white scale-105 active-exercise'
            : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:scale-105'
        }`}
        onClick={() => onSelectExercise('squat')}
      >
        Squats
      </button>
      <button
        className={`px-4 py-2 rounded-lg transform transition-all duration-300 ${
          selectedExercise === 'pushup'
            ? 'bg-blue-600 text-white scale-105 active-exercise'
            : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:scale-105'
        }`}
        onClick={() => onSelectExercise('pushup')}
      >
        Push-ups
      </button>
    </div>
  );
};

export default ExerciseSelector; 