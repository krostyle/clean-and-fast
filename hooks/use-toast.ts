"use client";

import * as React from "react";

type ToastVariant = "default" | "destructive";

interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

type ToastInput = Omit<Toast, "id">;

interface ToastState {
  toasts: Toast[];
}

const listeners: Array<(state: ToastState) => void> = [];
let memoryState: ToastState = { toasts: [] };

function dispatch(action: { type: "ADD"; toast: Toast } | { type: "REMOVE"; id: string }) {
  if (action.type === "ADD") {
    memoryState = { toasts: [...memoryState.toasts, action.toast] };
  } else {
    memoryState = { toasts: memoryState.toasts.filter((t) => t.id !== action.id) };
  }
  listeners.forEach((l) => l(memoryState));
}

function toast(input: ToastInput) {
  const id = Math.random().toString(36).slice(2);
  dispatch({ type: "ADD", toast: { id, ...input } });
  const duration = input.duration ?? 5000;
  setTimeout(() => dispatch({ type: "REMOVE", id }), duration);
}

function useToast() {
  const [state, setState] = React.useState<ToastState>(memoryState);
  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const idx = listeners.indexOf(setState);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }, []);
  return { ...state, toast };
}

export { useToast, toast };
