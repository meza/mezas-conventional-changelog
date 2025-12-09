declare module 'conventional-changelog-conventionalcommits' {
  export interface ConventionalCommitType {
    type: string;
    section?: string;
    hidden?: boolean;
    scope?: string;
  }

  export interface ConventionalCommitsPresetConfig {
    types?: ReadonlyArray<ConventionalCommitType>;
    [key: string]: unknown;
  }

  export interface ConventionalCommit {
    type?: string | null;
    [key: string]: unknown;
  }

  export interface ConventionalRecommendedBump {
    level: number;
    reason: string;
  }

  export type WhatBump = (commits?: ReadonlyArray<ConventionalCommit>) => ConventionalRecommendedBump | null;

  export interface ConventionalCommitsPreset {
    commits?: Record<string, unknown>;
    parser?: Record<string, unknown>;
    writer?: Record<string, unknown>;
    whatBump?: WhatBump;
  }

  export const DEFAULT_COMMIT_TYPES: ReadonlyArray<ConventionalCommitType>;

  export default function createPreset(config?: ConventionalCommitsPresetConfig): Promise<ConventionalCommitsPreset>;
}
