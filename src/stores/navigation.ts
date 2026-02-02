"use client";

import { create } from "zustand";

export type NavigationTab = "home" | "admin" | "invoices" | "settings";

interface NavigationState {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;

  invoicerOpen: boolean;
  setInvoicerOpen: (open: boolean) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  activeTab: "admin",
  setActiveTab: (tab) => set({ activeTab: tab }),
  invoicerOpen: false,
  setInvoicerOpen: (open) => set({ invoicerOpen: open }),
}));

