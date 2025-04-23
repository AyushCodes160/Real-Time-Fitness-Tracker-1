import { useState, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision'
import PoseVisualizer from './components/PoseVisualizer'
import ExerciseSelector from './components/ExerciseSelector'
import { Exercise, Landmark } from './types'
import { checkSquatForm, checkPushupForm } from './utils/poseValidation'

function App() {
  const [selectedExercise, setSelectedExercise] = useState<Exercise>('squat')
  const [isWebcamActive, setIsWebcamActive] = useState(false)
  const [poseLandmarker, setPoseLandmarker] = useState<PoseLandmarker | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [landmarks, setLandmarks] = useState<Landmark[]>([])
  const [formFeedback, setFormFeedback] = useState<string>('')
  const lastProcessedTime = useRef(0)
  const animationFrameId = useRef<number>()
  const targetFps = 30 // Limit to 30 FPS for smoother performance

  useEffect(() => {
    const initializePoseLandmarker = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        
        const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numPoses: 1
        });
        
        setPoseLandmarker(poseLandmarker);
      } catch (error) {
        console.error('Error initializing PoseLandmarker:', error);
      }
    };

    initializePoseLandmarker();
  }, []);

  const startWebcam = async () => {
    try {
      if (videoRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 }
        });
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsWebcamActive(true);
      }
    } catch (error) {
      console.error('Error accessing webcam:', error);
    }
  };

  const processFrame = async () => {
    if (!videoRef.current || !poseLandmarker) return;

    const currentTime = performance.now();
    const timeElapsed = currentTime - lastProcessedTime.current;
    const frameInterval = 1000 / targetFps;

    if (timeElapsed >= frameInterval) {
      try {
        const results = await poseLandmarker.detectForVideo(videoRef.current, currentTime);
        
        if (results.landmarks && results.landmarks[0]) {
          setLandmarks(results.landmarks[0]);
          
          // Validate form based on selected exercise
          const feedback = selectedExercise === 'squat' 
            ? checkSquatForm(results.landmarks[0])
            : checkPushupForm(results.landmarks[0]);
          
          setFormFeedback(feedback);
        }
        
        lastProcessedTime.current = currentTime;
      } catch (error) {
        console.error('Error processing frame:', error);
      }
    }

    animationFrameId.current = requestAnimationFrame(processFrame);
  };

  useEffect(() => {
    if (isWebcamActive) {
      lastProcessedTime.current = performance.now();
      animationFrameId.current = requestAnimationFrame(processFrame);
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isWebcamActive, poseLandmarker, selectedExercise]);

  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl mb-6 text-center animated-title">
          Real-time Fitness Tracker
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4 transform transition-all duration-500 hover:scale-[1.02]">
            <ExerciseSelector
              selectedExercise={selectedExercise}
              onSelectExercise={setSelectedExercise}
            />
            
            <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-lg ring-1 ring-blue-500/20">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {!isWebcamActive && (
                <button
                  onClick={startWebcam}
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white hover:bg-opacity-60 transition-all duration-300 hover:text-blue-400"
                >
                  <span className="transform transition-transform hover:scale-110">
                    Start Camera
                  </span>
                </button>
              )}
            </div>

            {formFeedback && (
              <div className="p-4 bg-gray-900 rounded-lg shadow-md ring-1 ring-blue-500/20 transform transition-all duration-500 hover:scale-[1.02] feedback-transition">
                <h3 className="font-semibold mb-2 text-blue-400">Form Feedback:</h3>
                <p className={`text-lg ${
                  formFeedback.includes('🔴') ? 'text-red-400' : 
                  formFeedback.includes('🟢') ? 'text-green-400' : 
                  'text-gray-300'
                }`}>
                  {formFeedback}
                </p>
              </div>
            )}
          </div>

          <div className="h-[500px] bg-gray-900 rounded-lg overflow-hidden shadow-lg ring-1 ring-blue-500/20 transform transition-all duration-500 hover:scale-[1.02] exercise-transition">
            <Canvas
              key={selectedExercise}
              camera={{
                position: [0, 2, 8],
                fov: 45,
                near: 0.1,
                far: 1000
              }}
            >
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={1.5} />
              <PoseVisualizer landmarks={landmarks} />
              <OrbitControls
                minDistance={4}
                maxDistance={15}
                target={[0, 2, 0]}
              />
            </Canvas>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App 