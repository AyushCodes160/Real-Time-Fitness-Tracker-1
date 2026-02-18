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
    <div className="min-h-screen p-4 bg-netflix-black text-netflix-white">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 flex flex-col items-center">
          <h1 className="netflix-title mb-2">
            Real-time Fitness Tracker
          </h1>
          <p className="netflix-subtitle">Powered by AI Pose Detection</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <ExerciseSelector
              selectedExercise={selectedExercise}
              onSelectExercise={setSelectedExercise}
            />

            <div className="relative aspect-video bg-netflix-dark rounded-md overflow-hidden shadow-2xl ring-1 ring-netflix-dark-gray group">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
              />
              {!isWebcamActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-10">
                  <button
                    onClick={startWebcam}
                    className="btn btn-primary flex items-center gap-2 transform hover:scale-105 transition-transform"
                  >
                    <span className="text-xl">▶</span> Start Camera
                  </button>
                  <p className="mt-4 text-netflix-light text-sm">Allow camera access to begin tracking</p>
                </div>
              )}
              {/* Recording/Active Indicator */}
              {isWebcamActive && (
                <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/60 px-3 py-1 rounded-full">
                  <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                  <span className="text-xs font-bold tracking-wider text-white">LIVE</span>
                </div>
              )}
            </div>

            {formFeedback && (
              <div className="netflix-card p-6 border-l-4 border-netflix-red feedback-transition">
                <h3 className="text-lg font-bold mb-2 text-white flex items-center gap-2">
                  Feedback
                </h3>
                <p className={`text-lg font-medium leading-relaxed ${formFeedback.includes('🔴') ? 'text-red-500' :
                  formFeedback.includes('🟢') ? 'text-green-500' :
                    'text-netflix-light'
                  }`}>
                  {formFeedback}
                </p>
              </div>
            )}
          </div>

          <div className="h-[500px] netflix-card border border-netflix-dark-gray exercise-transition relative">
            <div className="absolute top-4 left-4 z-10 bg-black/50 px-3 py-1 rounded text-xs font-mono text-netflix-light">
              3D VISUALIZATION
            </div>
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