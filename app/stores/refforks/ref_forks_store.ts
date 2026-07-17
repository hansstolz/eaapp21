import {
  _deleteForkFeature,
  _deleteReffork,
  _getForkFeatures,
  _getRefArticles,
  _getRefforks,
} from "@/app/api/refforks/crud";
import { get_values_label } from "@/app/api/values/crud";
import { create } from "zustand";
import {
  EaRefForks,
  ForkFeature,
  RefArticle,
} from "@/data_types/ref_forks/ref_forks";
import { DropdownItem } from "@/data_types/general/dropdown";
import { ValueTypes } from "@/data_types/values/value_types";
import { toast } from "sonner";

type Mode = "create" | "edit" | null;

type DeleteType = "refFork" | "forkFeature";

type DeleteRequest =
  | { type: "refFork"; uid: number; label: string }
  | { type: "forkFeature"; uid: number; label: string };

interface RefForkStore {
  // --------------------
  // DATA
  // --------------------
  refForks: EaRefForks[];
  selectedRefForkId: number | null;

  forkFeatures: ForkFeature[];
  selectedForkFeatureId: number | null;

  refArticles: RefArticle[];
  categories: DropdownItem[];
  articleCategories: DropdownItem[];

  // --------------------
  // UI
  // --------------------
  isRefForkDialogOpen: boolean;
  mode: Mode;

  closeRefForkDialog: () => void;

  isForkFeatureDialogOpen: boolean;
  closeForkFeatureDialog: () => void;

  // --------------------
  // ACTIONS
  // --------------------
  loadInitialData: () => Promise<void>;
  selectRefFork: (uid: number) => Promise<void>;

  openCreateRefFork: () => void;
  openEditRefFork: (uid: number) => void;

  openCreateForkFeature: () => void;
  openEditForkFeature: (uid: number) => void;

  loadCategories: () => Promise<void>;
  loadArticleCategories: () => Promise<void>;

  // DELETE UI
  isDeleteDialogOpen: boolean;
  deleteRequest: DeleteRequest | null;

  requestDelete: (req: DeleteRequest) => void;
  cancelDelete: () => void;
  confirmDelete: () => Promise<void>;
}

export const useRefForkStore = create<RefForkStore>((set, get) => ({
  // --------------------
  // DATA
  // --------------------
  refForks: [],
  selectedRefForkId: null,

  forkFeatures: [],
  selectedForkFeatureId: null,

  refArticles: [],
  categories: [],
  articleCategories: [],

  // --------------------
  // UI
  // --------------------
  mode: null,
  isRefForkDialogOpen: false,
  isForkFeatureDialogOpen: false,

  isDeleteDialogOpen: false,
  deleteRequest: null,

  // --------------------
  // ACTIONS
  // --------------------
  loadInitialData: async () => {
    const refForks = await _getRefforks();

    set({ refForks });

    if (refForks.length > 0) {
      await get().selectRefFork(refForks[0].uid_ref_fork);
    }
  },

  selectRefFork: async (uid) => {
    set({ selectedRefForkId: uid });

    await Promise.all([
      _getForkFeatures(uid).then((forkFeatures) => set({ forkFeatures })),
      _getRefArticles(uid).then((refArticles) => set({ refArticles })),
    ]);
  },

  // --------------------
  // REF FORK DIALOG
  // --------------------
  openCreateRefFork: () => {
    set({
      mode: "create",
      selectedRefForkId: null,
      isRefForkDialogOpen: true,
    });
  },

  openEditRefFork: (uid) => {
    set({
      mode: "edit",
      selectedRefForkId: uid,
      isRefForkDialogOpen: true,
    });
  },

  // --------------------
  // FORK FEATURE DIALOG
  // --------------------
  openCreateForkFeature: () => {
    set({
      mode: "create",
      selectedForkFeatureId: null,
      isForkFeatureDialogOpen: true,
    });
  },

  openEditForkFeature: (uid) => {
    set({
      mode: "edit",
      selectedForkFeatureId: uid,
      isForkFeatureDialogOpen: true,
    });
  },

  closeRefForkDialog: () => {
    set({
      isRefForkDialogOpen: false,
      mode: null,
    });
  },
  closeForkFeatureDialog: () => {
    set({
      isForkFeatureDialogOpen: false,
      mode: null,
    });
  },

  // --------------------
  // AUX
  // --------------------
  loadCategories: async () => {
    const categories = await get_values_label(ValueTypes.ea_forks_category);
    set({ categories });
  },

  loadArticleCategories: async () => {
    const articleCategories = await get_values_label(
      ValueTypes.ea_articles_category
    );
    set({ articleCategories });
  },

  requestDelete: (req) => {
    set({ deleteRequest: req, isDeleteDialogOpen: true });
  },

  cancelDelete: () => {
    set({ deleteRequest: null, isDeleteDialogOpen: false });
  },

  confirmDelete: async () => {
    const req = get().deleteRequest;
    if (!req) return;

    try {
      if (req.type === "refFork") {
        const res = await _deleteReffork(req.uid);
        if (res.status === 200)
          toast.success("Reference Fork deleted successfully");
        else toast.error(`Error deleting Reference Fork: ${res.status}`);

        // reload + reselect
        await get().loadInitialData();
      }

      if (req.type === "forkFeature") {
        const res = await _deleteForkFeature(req.uid);
        if (res.status === 200)
          toast.success("Fork Feature deleted successfully");
        else toast.error(`Error deleting Fork Feature: ${res.status}`);

        // Features neu laden für aktuell selektierten Fork
        const forkId = get().selectedRefForkId;
        if (forkId) {
          await get().selectRefFork(forkId);
        }
      }
    } finally {
      set({ deleteRequest: null, isDeleteDialogOpen: false });
    }
  },
}));

export const useSelectedRefFork = () =>
  useRefForkStore(
    (s) =>
      s.refForks.find((f) => f.uid_ref_fork === s.selectedRefForkId) ?? null
  );

export const useSelectedForkFeature = () =>
  useRefForkStore(
    (s) =>
      s.forkFeatures.find((f) => f.uid_ref_part === s.selectedForkFeatureId) ??
      null
  );
