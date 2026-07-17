export type EaConfirmCost = {
  confirmed_how: string | null; //Mail=0 Phone=1 Other=2
  confirmed_by: string | null;
  costestimate_confirm_check: string | null;
  confirmed_when: string | null;
};
