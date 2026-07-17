import {
	_create_text,
	_delete_text,
	_update_order,
	_update_text,
	text_overview,
} from "@/app/api/text/crud";
import { EaText } from "@/data_types/text/ea_text";
import { EaTextUpdate } from "@/data_types/text/ea_text_update";
import { toast } from "sonner";
import { create } from "zustand";

type Mode = "create" | "edit" | null;

interface TextStore {
	mode: Mode;
	texts: EaText[];
	selectedTextID: number | null | undefined;
	hasChanges: boolean;
	showDialog: boolean;
	setTexts: (texts: EaText[]) => void;
	loadTexts: () => Promise<void>;
	deleteText: (uid: number | undefined) => Promise<void>;
	reorderTexts: (texts: EaText[]) => void;
	updateOrderTexts: () => Promise<void>;
	isUpdating: boolean;
	selectText: (uid: number | undefined) => void;
	setShowDialog: (open: boolean) => void;
	submitData: (data: EaText) => Promise<boolean>;
}

export const useTextStore = create<TextStore>((set, get) => ({
	mode: null,
	texts: [],
	selectedTextID: null,
	hasChanges: false,
	isUpdating: false,
	showDialog: false,
	setTexts: (texts: EaText[]) => set({ texts }),
	loadTexts: async () => {
		const texts: EaText[] = await text_overview();
		set({ texts });
	},

	deleteText: async (uid_text: number | undefined) => {
		if (uid_text === undefined) return;
		const result = await _delete_text(uid_text);
		if (result.status === 200) {
			const updated = get()
				.texts.filter((item) => item.uid_text !== uid_text)
				.map((item, index) => ({
					...item,
					text_no: index + 1,
				}));
			set({ texts: updated });
			toast.success("Text deleted successfully");
		} else {
			toast.error("Error deleting text");
		}
	},

	reorderTexts: (reorderedTexts: EaText[]) => {
		const texts = reorderedTexts.map((item, index) => ({
			...item,
			text_no: index + 1,
		}));

		set({ texts, hasChanges: true });
	},
	updateOrderTexts: async () => {
		const texts = useTextStore.getState().texts;
		set({ isUpdating: true });
		const updatedData: EaTextUpdate[] = texts.map((item, index) => ({
			uid_text: item.uid_text,
			text_no: item.text_no,
		}));
		const _ = await _update_order(updatedData);
		set({ hasChanges: false, isUpdating: false });
	},

	selectText: (uid) => {
		set({
			selectedTextID: uid,
			showDialog: true,
			mode: uid ? "edit" : "create",
		});
	},
	setShowDialog: (open: boolean) => set({ showDialog: open }),

	submitData: async (data: EaText) => {
		const mode = useTextStore.getState().mode;
		const res =
			mode === "create" ? await _create_text(data) : await _update_text(data);

		if (res.uid_text) {
			toast.success("User settings updated successfully");
			get().setShowDialog(false);
			get().loadTexts();
			set({ mode: null, selectedTextID: null });
			return true;
		} else {
			toast.error("Failed to update user settings");
			return false;
		}
	},
}));

export const useSelectedText = () =>
	useTextStore(
		(s) => s.texts.find((f) => f.uid_text === s.selectedTextID) ?? null
	);
