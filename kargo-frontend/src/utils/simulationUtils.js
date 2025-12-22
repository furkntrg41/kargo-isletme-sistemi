import L from 'leaflet';

// İki nokta arasındaki mesafeyi hesaplar
const getDistance = (p1, p2) => {
  const dx = p1[0] - p2[0];
  const dy = p1[1] - p2[1];
  return Math.sqrt(dx * dx + dy * dy);
};

// Rota üzerindeki belirli bir ilerleme yüzdesine (0.0 - 1.0) denk gelen koordinatı bulur
export const getPositionAtProgress = (pathPoints, progress) => {
  if (!pathPoints || pathPoints.length < 2) return null;
  if (progress <= 0) return pathPoints[0];
  if (progress >= 1) return pathPoints[pathPoints.length - 1];

  // 1. Toplam yol uzunluğunu hesapla
  let totalLength = 0;
  const segmentLengths = [];
  
  for (let i = 0; i < pathPoints.length - 1; i++) {
    const dist = getDistance(pathPoints[i], pathPoints[i+1]);
    segmentLengths.push(dist);
    totalLength += dist;
  }

  // 2. Hedef mesafeyi bul
  let targetDistance = totalLength * progress;
  
  // 3. Hedefin hangi segmentte olduğunu bul
  let currentDist = 0;
  for (let i = 0; i < segmentLengths.length; i++) {
    const segmentLen = segmentLengths[i];
    
    if (currentDist + segmentLen >= targetDistance) {
      // Bu segmentin üzerindeyiz. Segment içindeki oranı bul.
      const remaining = targetDistance - currentDist;
      const ratio = remaining / segmentLen;
      
      const p1 = pathPoints[i];
      const p2 = pathPoints[i+1];
      
      // Interpolasyon (Ara değer bulma)
      return [
        p1[0] + (p2[0] - p1[0]) * ratio,
        p1[1] + (p2[1] - p1[1]) * ratio
      ];
    }
    
    currentDist += segmentLen;
  }

  return pathPoints[pathPoints.length - 1];
};