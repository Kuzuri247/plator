
import { create } from "zustand";
import { CanvasElement, HistoryState, ImageElement, TextElement, DEFAULT_IMAGE_STYLE } from "../types";
import { ASPECT_RATIOS } from "../values";

interface EditorState {
  aspectRatio: typeof ASPECT_RATIOS[0];
  canvasBackground: string;
  elements: CanvasElement[];
  selectedElementId: string | null;
  isCropping: boolean;

  history: HistoryState[];
  historyIndex: number;

  setAspectRatio: (name: string) => void;
  setCustomSize: (width: number, height: number) => void;
  setBackground: (bg: string) => void;

  addElement: (element: CanvasElement) => void;
  updateElement: (id: string, updates: Partial<CanvasElement> | Partial<ImageElement["style"]> | Partial<TextElement["style"]>) => void;
  removeElement: (id: string) => void;

  reorderElement: (id: string, direction: "up" | "down" | "top" | "bottom") => void;
  toggleVisibility: (id: string) => void;
  toggleLock: (id: string) => void;

  selectElement: (id: string | null) => void;
  setCropping: (isCropping: boolean) => void;

  undo: () => void;
  redo: () => void;
  reset: () => void;
}

const DEFAULT_BG = "radial-gradient(at 0% 0%, #7209b7 0px, transparent 70%), radial-gradient(at 100% 0%, #9d4edd 0px, transparent 70%), radial-gradient(at 100% 100%, #e0aaff 0px, transparent 70%), radial-gradient(at 0% 100%, #c77dff 0px, transparent 70%)";

export const useStore = create<EditorState>((set, get) => ({
  aspectRatio: ASPECT_RATIOS.find((r) => r.name === "4:3") || ASPECT_RATIOS[4],
  canvasBackground: DEFAULT_BG,
  elements: [],
  selectedElementId: null,
  isCropping: false,
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

          if (el.type === 'text' || el.type === 'image') {
            const rootKeys = ['name', 'position', 'content', 'src', 'isVisible', 'isLocked'];
            const newStyle = { ...el.style };
            const newRoot = { ...el };

            Object.keys(updates).forEach(key => {
              if (rootKeys.includes(key)) {
                (newRoot as any)[key] = (updates as any)[key];
              } else {
                (newStyle as any)[key] = (updates as any)[key];
              }
            });
            return { ...newRoot, style: newStyle };
          }
        }
        return { ...el, ...updates };
      }) as CanvasElement[];
      return { elements: newElements };
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

  selectElement: (id) => set({ selectedElementId: id, isCropping: false }),
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
      selectedElementId: null
    })
  }
}));
