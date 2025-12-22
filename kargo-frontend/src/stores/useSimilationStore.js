import { create } from 'zustand';

const useSimulationStore = create((set, get) => ({
  progress: 0,
  isPlaying: false,
  isCompleted: false, // YENİ: Başarı durumunu takip eder
  simulationSpeed: 10,
  lastUpdateTime: null,

  setIsPlaying: (playing) => {
    if (playing) {
      // Başlatırken isCompleted'ı sıfırlıyoruz ki yeni süreç başlasın
      set({ isPlaying: true, isCompleted: false, lastUpdateTime: performance.now() });
      requestAnimationFrame(get().runLoop);
    } else {
      set({ isPlaying: false, lastUpdateTime: null });
    }
  },

  setSimulationSpeed: (speed) => set({ simulationSpeed: speed }),
  
  // Sıfırlama fonksiyonuna isCompleted temizliğini de ekledik
  resetSimulation: () => set({ 
    progress: 0, 
    isPlaying: false, 
    isCompleted: false, 
    lastUpdateTime: null 
  }),

  runLoop: () => {
    const state = get();
    
    // Eğer durdurulduysa veya %100 olduysa döngüden çık
    if (!state.isPlaying || state.progress >= 100) return;

    const currentTime = performance.now();
    let deltaTime = currentTime - (state.lastUpdateTime || currentTime);

    if (deltaTime > 30) deltaTime = 16.6; 

    const increment = deltaTime * state.simulationSpeed * 0.0001; 
    const nextProgress = Math.min(state.progress + increment, 100);

    // State'i güncelle
    const isFinished = nextProgress >= 100;
    
    set({ 
      progress: nextProgress, 
      lastUpdateTime: currentTime,
      // Eğer bittiyse isPlaying'i kapat, isCompleted'ı aç
      isPlaying: !isFinished,
      isCompleted: isFinished
    });

    // Devam ediyorsa bir sonraki kareyi iste
    if (!isFinished && get().isPlaying) {
      requestAnimationFrame(get().runLoop);
    } else if (isFinished) {
      set({ lastUpdateTime: null });
    }
  }
}));

export default useSimulationStore;