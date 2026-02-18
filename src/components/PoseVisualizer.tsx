import React, { useMemo } from 'react';
import { Line, Sphere } from '@react-three/drei';
import { Landmark } from '../types';

// Define connections between landmarks for skeleton visualization
const POSE_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 7],
  [0, 4], [4, 5], [5, 6], [6, 8],
  [9, 10], [11, 12], [11, 13], [13, 15],
  [12, 14], [14, 16], [11, 23], [12, 24],
  [23, 24], [23, 25], [24, 26], [25, 27],
  [26, 28], [27, 29], [28, 30], [29, 31],
  [30, 32], [27, 31], [28, 32]
];

interface PoseVisualizerProps {
  landmarks: Landmark[];
}

const PoseVisualizer: React.FC<PoseVisualizerProps> = React.memo(({ landmarks }) => {
  const points = useMemo(() => {
    if (!landmarks?.length) return [];
    // Scale up the entire visualization by multiplying the coordinates
    return landmarks.map(({ x, y, z }) => [x * 2, (-y + 1) * 2, -z * 2] as [number, number, number]);
  }, [landmarks]);

  const sphereMaterial = useMemo(() => (
    <meshStandardMaterial color="#E50914" emissive="#E50914" emissiveIntensity={0.5} />
  ), []);

  if (!points.length) return null;

  return (
    <>
      {/* Draw joints */}
      {points.map((point, i) => (
        <Sphere key={i} position={point as [number, number, number]} args={[0.03]}>
          {sphereMaterial}
        </Sphere>
      ))}

      {/* Draw connections */}
      {POSE_CONNECTIONS.map(([i, j], index) => {
        if (!points[i] || !points[j]) return null;
        return (
          <Line
            key={index}
            points={[points[i] as [number, number, number], points[j] as [number, number, number]]}
            color="white"
            lineWidth={2}
            transparent
            opacity={0.8}
          />
        );
      })}
    </>
  );
});

PoseVisualizer.displayName = 'PoseVisualizer';
export default PoseVisualizer; 