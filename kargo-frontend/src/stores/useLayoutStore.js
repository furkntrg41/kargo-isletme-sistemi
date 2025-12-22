import { create } from 'zustand';

const useLayoutStore = create(set => ({
  sidebarCollapsed: false,

  toggleSidebar: () =>
    set(state => ({ sidebarCollapsed: !state.sidebarCollapsed }))
}));

export default useLayoutStore;