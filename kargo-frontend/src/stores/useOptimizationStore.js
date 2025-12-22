import { create } from 'zustand';
import { optimizationService } from '../services/optimizationService';
import { toast } from 'react-toastify';

const useOptimizationStore = create((set) => ({
  simulationResult: null,
  isLoading: false,
  activePlan : null,
  // Ortak Payload Hazırlayıcı
  _preparePayload: (params, isSim) => ({
    date: new Date().toISOString(), // Backend formatı: "2025-12-21T..."
    planName: params.planName || `Plan-${new Date().toLocaleTimeString()}`,
    mode: params.mode,             // "FixedFleet" | "UnlimitedFleet"
    objective: params.objective,   // "MinimizeCost" | "MaximizeCargoCount" | ...
    isSimulation: isSim,
    notes: params.notes || "Otomatik oluşturulan plan"
  }),

  // 1. SİMÜLASYON (Dry-Run)
  runSimulation: async (params) => {
    set({ isLoading: true, simulationResult: null });
    try {
      const payload = useOptimizationStore.getState()._preparePayload(params, true);
      const result = await optimizationService.runSimulation(payload);
      console.log(result);
      
      set({ simulationResult: result, isLoading: false });
      toast.info(`Simülasyon tamamlandı. ${result.deliveryRoutes.length} rota oluşturuldu.`);
    } catch (error) {
      set({ isLoading: false });
      // Hata zaten axiosClient'ta yakalanıyor
    }
  },

  // 2. GERÇEK OPERASYON (Commit)
  startOperation: async (params) => {
    set({ isLoading: true });
    try {
      const payload = useOptimizationStore.getState()._preparePayload(params, false);
      const result = await optimizationService.confirmOperation(payload);
      
      set({ isLoading: false, simulationResult: null });
      toast.success(`Operasyon başlatıldı! Plan ID: ${result.runId}`);
      // İsteğe bağlı: Dashboard'a yönlendir
    } catch (error) {
      set({ isLoading: false });
    }
  },
  completeOperation : async (id) => {
    set({ isLoading: true });
    try {
      const result = await optimizationService.completeOperation(id);
      set({ activePlan:null, isLoading: false });
      toast.success(`Operasyon tamamlandı! Plan ID: ${result.runId}`);
    } catch (error) {
      
      set({ isLoading: false,error: error});

    }
  },

  clearSimulation: () => set({ simulationResult: null }),
  fetchActivePlan: async () => {
    set({ isLoading: true });
    try {
    const response = await optimizationService.activeOperation();
    
    set({ activePlan: response, isLoading: false });
    } catch (error) {
      set({activePlan: null, isLoading: false });
    }
  }
}));

export default useOptimizationStore;