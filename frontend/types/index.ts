export interface PainCardData {
  title: string;
  blurb: string;
  triggered_tiles: string[];
  triggering_keywords: string[];
}

export interface AssessmentData {
  pain_cards: PainCardData[];
  scope_summary: string;
  activated_tiles: string[];
  industry?: string;
  revenue?: number;
  classified_industry?: string;
  geo_scope?: string;
  company_name?: string;
}

export interface UserAnswers {
  geoScope: string;
  isSap: string;
  isOnPrem: string;
}

export interface ScopeCategory {
  name: string;
  tiles: ScopeTile[];
}

export interface ScopeTile {
  id: string;
  name: string;
}

export interface QuestionCardProps {
  question: string;
  options: string[];
  selectedOption: string;
  onSelect: (option: string) => void;
}

export interface PainCardProps extends PainCardData {
  isSelected: boolean;
  onClick: () => void;
}

export interface ScopeTileProps {
  name: string;
  isActive: boolean;
}

export interface ScopeGridProps {
  activatedTiles: string[];
}

export interface InfoFieldProps {
  label: string;
  value: string | number | null | undefined;
}

export interface FinalDashboardProps {
  assessment: AssessmentData;
  userAnswers: UserAnswers;
  activatedTiles: string[];
}