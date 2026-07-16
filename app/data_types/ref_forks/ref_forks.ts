export type EaRefForks = {
  uid_ref_fork: number;
  year_construction: string | null;
  fork_model: string | null;
  damper: string | null;
  damper_elements: string | null;
  cartridge: string | null;
  weight_lbs: number | null;
  notes: string | null;
  travel: string | null;
  color: string | null;
  cannondale_sn: string | null;
  category_fork: string | null;
  lockout: string | null;
  weight_kg: number | null;
  breakmount: string | null;
};

export type ForkFeature = {
  uid_ref_part: number;
  ref_part_name: string;
  ref_part_qualitiy: string;
  check_character_int: number;
  ref_part_notes: string;
};

export type RefArticle = {
  uid_article_ref_forks: number;
  article_no: number | null;
  articlecode: string | null;
};
