import { create } from "zustand";
import { EditorState, CanvasElement } from "../types";
import {
  ASPECT_RATIOS,
  DEFAULT_MESH_CONFIG,
  DEFAULT_OVERLAY_CONFIG,
} from "../values";

const DEFAULT_BG = "mesh";

export const useStore = create<EditorState>((set, get) => ({
  aspectRatio:
    ASPECT_RATIOS.find((r) => r.name === "16:9") || ASPECT_RATIOS[0],
  canvasBackground: DEFAULT_BG,
  meshConfig: { ...DEFAULT_MESH_CONFIG },
  overlayConfig: { ...DEFAULT_OVERLAY_CONFIG },
  elements: [],
  selectedElementId: null,
  isCropping: false,
  activeTab: "image",
  lastSelectedTextId: null,
  lastSelectedImageId: null,
  exportFormat: "mp4",
  exportQuality: "2",
  exportDuration: 3,
  exportFps: 60,
  history: [
    {
      elements: [],
      canvasBackground: DEFAULT_BG,
      meshConfig: { ...DEFAULT_MESH_CONFIG },
      overlayConfig: { ...DEFAULT_OVERLAY_CONFIG },
      aspectRatio:
        ASPECT_RATIOS.find((r) => r.name === "16:9") || ASPECT_RATIOS[0],
    },
  ],
  historyIndex: 0,

  setAspectRatio: (name) => {
    const ratio = ASPECT_RATIOS.find((r) => r.name === name);
    if (!ratio) return;
    set((state) => {
      const oldRatio = state.aspectRatio;
      if (oldRatio.width === ratio.width && oldRatio.height === ratio.height) {
        return { aspectRatio: ratio };
      }
      const deltaX = (ratio.width - oldRatio.width) / 2;
      const deltaY = (ratio.height - oldRatio.height) / 2;

      const newElements = state.elements.map((el) => ({
        ...el,
        position: {
          x: Math.round(el.position.x + deltaX),
          y: Math.round(el.position.y + deltaY),
        },
      }));

      const newHistory = [
        ...state.history.slice(0, state.historyIndex + 1),
        {
          elements: newElements,
          canvasBackground: state.canvasBackground,
          meshConfig: state.meshConfig,
          overlayConfig: state.overlayConfig,
          aspectRatio: ratio,
        },
      ];

      return {
        aspectRatio: ratio,
        elements: newElements,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  },

  setCustomSize: (width, height) => {
    set((state) => {
      const oldRatio = state.aspectRatio;
      if (oldRatio.width === width && oldRatio.height === height) {
        return {};
      }
      const deltaX = (width - oldRatio.width) / 2;
      const deltaY = (height - oldRatio.height) / 2;

      const newElements = state.elements.map((el) => ({
        ...el,
        position: {
          x: Math.round(el.position.x + deltaX),
          y: Math.round(el.position.y + deltaY),
        },
      }));

      const newRatio = {
        name: "Custom",
        label: "Custom",
        width,
        height,
        previewClass: "aspect-auto",
      };

      const newHistory = [
        ...state.history.slice(0, state.historyIndex + 1),
        {
          elements: newElements,
          canvasBackground: state.canvasBackground,
          meshConfig: state.meshConfig,
          overlayConfig: state.overlayConfig,
          aspectRatio: newRatio,
        },
      ];

      return {
        aspectRatio: newRatio,
        elements: newElements,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  },

  setBackground: (bg) => {
    set((state) => {
      const newHistory = [
        ...state.history.slice(0, state.historyIndex + 1),
        {
          elements: state.elements,
          canvasBackground: bg,
          meshConfig: state.meshConfig,
          overlayConfig: state.overlayConfig,
          aspectRatio: state.aspectRatio,
        },
      ];
      return {
        canvasBackground: bg,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  },

  setMeshConfig: (config) => {
    set((state) => {
      const newConfig = { ...state.meshConfig, ...config };
      const newHistory = [
        ...state.history.slice(0, state.historyIndex + 1),
        {
          elements: state.elements,
          canvasBackground: state.canvasBackground,
          meshConfig: newConfig,
          overlayConfig: state.overlayConfig,
          aspectRatio: state.aspectRatio,
        },
      ];
      return {
        meshConfig: newConfig,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  },

  setOverlayConfig: (config) => {
    set((state) => {
      const newConfig = { ...state.overlayConfig, ...config };
      const newHistory = [
        ...state.history.slice(0, state.historyIndex + 1),
        {
          elements: state.elements,
          canvasBackground: state.canvasBackground,
          meshConfig: state.meshConfig,
          overlayConfig: newConfig,
          aspectRatio: state.aspectRatio,
        },
      ];
      return {
        overlayConfig: newConfig,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  },

  setElements: (elements) => {
    set((state) => {
      const newHistory = [
        ...state.history.slice(0, state.historyIndex + 1),
        {
          elements,
          canvasBackground: state.canvasBackground,
          meshConfig: state.meshConfig,
          overlayConfig: state.overlayConfig,
          aspectRatio: state.aspectRatio,
        },
      ];
      return {
        elements,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  },

  setExportFormat: (format) =>
    set((state) => ({
      exportFormat: format,
      exportFps: format === "gif" ? 30 : state.exportFps,
    })),
  setExportQuality: (quality) => set({ exportQuality: quality }),
  setExportDuration: (duration) => set({ exportDuration: duration }),
  setExportFps: (fps) => set({ exportFps: fps }),

  setActiveTab: (tab) => {
    set((state) => {
      let newSelectedId = state.selectedElementId;

      if (tab === "text") {
        const currentIsText =
          state.elements.find((el) => el.id === state.selectedElementId)?.type ===
          "text";
        if (!currentIsText && state.lastSelectedTextId) {
          if (state.elements.find((el) => el.id === state.lastSelectedTextId)) {
            newSelectedId = state.lastSelectedTextId;
          }
        }
      }

      if (tab === "image") {
        const currentIsImage =
          state.elements.find((el) => el.id === state.selectedElementId)?.type ===
          "image";
        if (!currentIsImage && state.lastSelectedImageId) {
          if (state.elements.find((el) => el.id === state.lastSelectedImageId)) {
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
        {
          elements: newElements,
          canvasBackground: state.canvasBackground,
          meshConfig: state.meshConfig,
          overlayConfig: state.overlayConfig,
          aspectRatio: state.aspectRatio,
        },
      ];
      return {
        elements: newElements,
        selectedElementId: element.id,
        activeTab: element.type === "text" ? "text" : "image",
        lastSelectedTextId:
          element.type === "text" ? element.id : state.lastSelectedTextId,
        lastSelectedImageId:
          element.type === "image" ? element.id : state.lastSelectedImageId,
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
        {
          elements: newElements,
          canvasBackground: state.canvasBackground,
          meshConfig: state.meshConfig,
          overlayConfig: state.overlayConfig,
          aspectRatio: state.aspectRatio,
        },
      ];
      return {
        elements: newElements,
        selectedElementId: null,
        isCropping: false,
        lastSelectedTextId:
          state.lastSelectedTextId === id ? null : state.lastSelectedTextId,
        lastSelectedImageId:
          state.lastSelectedImageId === id ? null : state.lastSelectedImageId,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
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
    set((state) => {
      const isNowLocked = !state.elements.find((el) => el.id === id)?.isLocked;
      return {
        elements: state.elements.map((el) =>
          el.id === id ? { ...el, isLocked: !el.isLocked } : el
        ),
        isCropping:
          isNowLocked && state.selectedElementId === id
            ? false
            : state.isCropping,
      };
    });
  },

  selectElement: (id) => {
    set((state) => {
      const element = state.elements.find((el) => el.id === id);
      let newTab = state.activeTab;

      if (element && state.activeTab !== "layers") {
        newTab = element.type === "text" ? "text" : "image";
      }

      return {
        selectedElementId: id,
        isCropping: false,
        lastSelectedTextId:
          element?.type === "text" ? id : state.lastSelectedTextId,
        lastSelectedImageId:
          element?.type === "image" ? id : state.lastSelectedImageId,
        activeTab: newTab,
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
        meshConfig: historyState.meshConfig,
        overlayConfig: historyState.overlayConfig,
        aspectRatio: historyState.aspectRatio || state.aspectRatio,
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
        meshConfig: historyState.meshConfig,
        overlayConfig: historyState.overlayConfig,
        aspectRatio: historyState.aspectRatio || state.aspectRatio,
        historyIndex: newIndex,
      };
    });
  },

  reset: () => {
    const defaultRatio =
      ASPECT_RATIOS.find((r) => r.name === "16:9") || ASPECT_RATIOS[0];
    set({
      elements: [],
      canvasBackground: DEFAULT_BG,
      meshConfig: { ...DEFAULT_MESH_CONFIG },
      overlayConfig: { ...DEFAULT_OVERLAY_CONFIG },
      aspectRatio: defaultRatio,
      history: [
        {
          elements: [],
          canvasBackground: DEFAULT_BG,
          meshConfig: { ...DEFAULT_MESH_CONFIG },
          overlayConfig: { ...DEFAULT_OVERLAY_CONFIG },
          aspectRatio: defaultRatio,
        },
      ],
      historyIndex: 0,
      selectedElementId: null,
      lastSelectedImageId: null,
      lastSelectedTextId: null,
    });
  },

  setDitherConfig: (layerId, config) => {
    set((state) => {
      const newElements = state.elements.map((el) => {
        if (el.id !== layerId) return el;
        if (el.type !== "image") return el;

        const currentDither = el.dither || {
          enabled: false,
          ditherType: 1,
          pixelSize: 4,
          colorSteps: 4,
          colorFront: "#ffffff",
          colorBack: "#000000",
        };
        const newDither = { ...currentDither, ...config };

        return { ...el, dither: newDither };
      });

      const newHistory = [
        ...state.history.slice(0, state.historyIndex + 1),
        {
          elements: newElements,
          canvasBackground: state.canvasBackground,
          meshConfig: state.meshConfig,
          overlayConfig: state.overlayConfig,
          aspectRatio: state.aspectRatio,
        },
      ];

      return {
        elements: newElements as CanvasElement[],
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  },
}));