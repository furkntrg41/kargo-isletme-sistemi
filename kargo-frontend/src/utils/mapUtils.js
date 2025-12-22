export const parseRouteGeometry = (geometryString) => {
  if (!geometryString) return [];
  
  // Backend string'i "|" ile ayırıyor, sonra her parçayı "," ile ayırıyor
  return geometryString.split('|').map(coordPair => {
    const [lat, lng] = coordPair.split(',');
    return [parseFloat(lat), parseFloat(lng)];
  });
};

export const getRandomColor = () => {
  const colors = ['#2563eb', '#dc2626', '#16a34a', '#d97706', '#9333ea'];
  return colors[Math.floor(Math.random() * colors.length)];
};