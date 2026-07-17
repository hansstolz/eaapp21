export type DialogProps<T> = {
  title: string;
  record?: T | null;
  showDialog?: boolean;
  setShowDialog?: (open: boolean) => void;
};
