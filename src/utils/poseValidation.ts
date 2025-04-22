import { Landmark } from '../types';

// Helper function to calculate angle between three points
const calculateAngle = (a: Landmark, b: Landmark, c: Landmark): number => {
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs(radians * 180.0 / Math.PI);
  if (angle > 180.0) angle = 360 - angle;
  return angle;
};

export const checkSquatForm = (landmarks: Landmark[]): string => {
  if (!landmarks || landmarks.length < 33) return 'No pose detected';

  // Key points for squat form
  const hip = landmarks[24]; // Right hip
  const knee = landmarks[26]; // Right knee
  const ankle = landmarks[28]; // Right ankle
  const shoulder = landmarks[12]; // Right shoulder

  // Check knee alignment
  const kneeAngle = calculateAngle(hip, knee, ankle);
  
  // Check hip hinge
  const hipAngle = calculateAngle(shoulder, hip, knee);

  // Perfect form ranges
  const PERFECT_KNEE_ANGLE = 90;
  const PERFECT_HIP_ANGLE = 90;

  if (kneeAngle < 60) {
    return '⚠️ Squat Form: Knees are bending too much forward. Keep them aligned with your toes.';
  }

  if (hipAngle < 45) {
    return '⚠️ Squat Form: Not hinging at hips enough. Push your hips back more while keeping chest up.';
  }

  if (kneeAngle > 170 && hipAngle > 160) {
    return '⚠️ Squat Form: Not squatting deep enough. Try to reach parallel position.';
  }

  // Calculate how close to perfect form
  const kneeDeviation = Math.abs(PERFECT_KNEE_ANGLE - kneeAngle);
  const hipDeviation = Math.abs(PERFECT_HIP_ANGLE - hipAngle);

  if (kneeDeviation < 15 && hipDeviation < 15) {
    return '✅ Perfect Squat Form! Keep it up! 💪';
  }

  return '👍 Good Squat Form - Keep going!';
};

export const checkPushupForm = (landmarks: Landmark[]): string => {
  if (!landmarks || landmarks.length < 33) return 'No pose detected';

  // Key points for pushup form
  const shoulder = landmarks[12]; // Right shoulder
  const elbow = landmarks[14]; // Right elbow
  const wrist = landmarks[16]; // Right wrist
  const hip = landmarks[24]; // Right hip
  const ankle = landmarks[28]; // Right ankle

  // Check elbow angle
  const elbowAngle = calculateAngle(shoulder, elbow, wrist);
  
  // Check body alignment
  const bodyAngle = calculateAngle(shoulder, hip, ankle);

  // Perfect form ranges
  const PERFECT_ELBOW_ANGLE = 90;
  const PERFECT_BODY_ANGLE = 180;

  if (elbowAngle < 45) {
    return '⚠️ Push-up Form: Going too low. Keep your elbows at 90 degrees at the bottom.';
  }

  if (elbowAngle > 120) {
    return '⚠️ Push-up Form: Not going low enough. Lower your chest while maintaining form.';
  }

  if (bodyAngle < 160) {
    return '⚠️ Push-up Form: Hips are sagging. Keep your body in a straight line from head to heels.';
  }

  // Calculate how close to perfect form
  const elbowDeviation = Math.abs(PERFECT_ELBOW_ANGLE - elbowAngle);
  const bodyDeviation = Math.abs(PERFECT_BODY_ANGLE - bodyAngle);

  if (elbowDeviation < 15 && bodyDeviation < 10) {
    return '✅ Perfect Push-up Form! Keep it up! 💪';
  }

  return '👍 Good Push-up Form - Keep pushing!';
}; 