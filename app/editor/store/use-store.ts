import { create } from "zustand";
import { EditorState, CanvasElement } from "../types";
import { ASPECT_RATIOS } from "../values";

const DEFAULT_BG = "radial-gradient(at 0% 0%, #7209b7 0px, transparent 70%), radial-gradient(at 100% 0%, #9d4edd 0px, transparent 70%), radial-gradient(at 100% 100%, #e0aaff 0px, transparent 70%), radial-gradient(at 0% 100%, #c77dff 0px, transparent 70%)";

export const useStore = create<EditorState>((set, get) => ({
  aspectRatio: ASPECT_RATIOS.find((r) => r.name === "16:9") || ASPECT_RATIOS[0],
  canvasBackground: DEFAULT_BG,
  elements: [],
  selectedElementId: null,
  isCropping: false,
  activeTab: "image",
  lastSelectedTextId: null,
  lastSelectedImageId: null,
  exportFormat: "png",
  exportQuality: "2",
  history: [{ elements: [], canvasBackground: DEFAULT_BG }],
  historyIndex: 0,

  setAspectRatio: (name) => {
    const ratio = ASPECT_RATIOS.find((r) => r.name === name);
    if (ratio) set({ aspectRatio: ratio });
  },

  setCustomSize: (width, height) => {
    set({
      aspectRatio: {
        name: "Custom",
        label: "Custom",
        width,
        height,
        previewClass: "aspect-auto",
      },
    });
  },

  setBackground: (bg) => {
    set((state) => {
      const newHistory = [
        ...state.history.slice(0, state.historyIndex + 1),
        { elements: state.elements, canvasBackground: bg },
      ];
      return {
        canvasBackground: bg,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  },

  setExportFormat: (format) => set({ exportFormat: format }),
  setExportQuality: (quality) => set({ exportQuality: quality }),

  setActiveTab: (tab) => {
    set((state) => {
      let newSelectedId = state.selectedElementId;

      if (tab === "text") {
        const currentIsText = state.elements.find(el => el.id === state.selectedElementId)?.type === "text";
        if (!currentIsText && state.lastSelectedTextId) {
          if (state.elements.find(el => el.id === state.lastSelectedTextId)) {
            newSelectedId = state.lastSelectedTextId;
          }
        }
      }

      if (tab === "image") {
        const currentIsImage = state.elements.find(el => el.id === state.selectedElementId)?.type === "image";
        if (!currentIsImage && state.lastSelectedImageId) {
          if (state.elements.find(el => el.id === state.lastSelectedImageId)) {
            newSelectedId = state.lastSelectedImageId;
          }
        }
      }

      return { activeTab: tab, selectedElementId: newSelectedId };
    });
  },

  addElement: (element) => {
    set((state) => {
      const newElements = [...state.elements, element];
      const newHistory = [
        ...state.history.slice(0, state.historyIndex + 1),
        { elements: newElements, canvasBackground: state.canvasBackground },
      ];
      return {
        elements: newElements,
        selectedElementId: element.id,
        activeTab: element.type === "text" ? "text" : "image",
        lastSelectedTextId: element.type === "text" ? element.id : state.lastSelectedTextId,
        lastSelectedImageId: element.type === "image" ? element.id : state.lastSelectedImageId,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  },

  updateElement: (id, updates) => {
    set((state) => {
      const newElements = state.elements.map((el) => {
        if (el.id !== id) return el;

        if ("style" in el && !("type" in updates)) {
          const styleUpdates = updates as any;
          const newStyle = { ...el.style, ...styleUpdates };
          const newRoot = { ...el, ...updates, style: newStyle };
          return newRoot;
        }
        return { ...el, ...updates };
      });

      return { elements: newElements as CanvasElement[] };
    });
  },

  removeElement: (id) => {
    set((state) => {
      const newElements = state.elements.filter((el) => el.id !== id);
      const newHistory = [
        ...state.history.slice(0, state.historyIndex + 1),
        { elements: newElements, canvasBackground: state.canvasBackground },
      ];
      return {
        elements: newElements,
        selectedElementId: null,
        isCropping: false,
        lastSelectedTextId: state.lastSelectedTextId === id ? null : state.lastSelectedTextId,
        lastSelectedImageId: state.lastSelectedImageId === id ? null : state.lastSelectedImageId,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  },

  reorderElement: (id, direction) => {
    set((state) => {
      const index = state.elements.findIndex((el) => el.id === id);
      if (index === -1) return {};

      const newElements = [...state.elements];
      const element = newElements[index];

      if (direction === "up" && index < newElements.length - 1) {
        newElements[index] = newElements[index + 1];
        newElements[index + 1] = element;
      } else if (direction === "down" && index > 0) {
        newElements[index] = newElements[index - 1];
        newElements[index - 1] = element;
      } else if (direction === "top") {
        newElements.splice(index, 1);
        newElements.push(element);
      } else if (direction === "bottom") {
        newElements.splice(index, 1);
        newElements.unshift(element);
      }

      return { elements: newElements };
    });
  },

  toggleVisibility: (id) => {
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id ? { ...el, isVisible: !el.isVisible } : el
      ),
    }));
  },

  toggleLock: (id) => {
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id ? { ...el, isLocked: !el.isLocked } : el
      ),
    }));
  },

  selectElement: (id) => {
    set((state) => {
      const element = state.elements.find(el => el.id === id);
      let newTab = state.activeTab;

      if (element && state.activeTab !== "layers") {
        newTab = element.type === "text" ? "text" : "image";
      }

      return {
        selectedElementId: id,
        isCropping: false,
        lastSelectedTextId: element?.type === "text" ? id : state.lastSelectedTextId,
        lastSelectedImageId: element?.type === "image" ? id : state.lastSelectedImageId,
        activeTab: newTab
      };
    });
  },

  setCropping: (val) => set({ isCropping: val }),

  undo: () => {
    set((state) => {
      if (state.historyIndex <= 0) return {};
      const newIndex = state.historyIndex - 1;
      const historyState = state.history[newIndex];
      return {
        elements: historyState.elements,
        canvasBackground: historyState.canvasBackground,
        historyIndex: newIndex,
      };
    });
  },

  redo: () => {
    set((state) => {
      if (state.historyIndex >= state.history.length - 1) return {};
      const newIndex = state.historyIndex + 1;
      const historyState = state.history[newIndex];
      return {
        elements: historyState.elements,
        canvasBackground: historyState.canvasBackground,
        historyIndex: newIndex,
      };
    });
  },

  reset: () => {
    set({
      elements: [],
      canvasBackground: DEFAULT_BG,
      history: [{ elements: [], canvasBackground: DEFAULT_BG }],
      historyIndex: 0,
      selectedElementId: null,
      lastSelectedImageId: null,
      lastSelectedTextId: null
    })
  }
}));