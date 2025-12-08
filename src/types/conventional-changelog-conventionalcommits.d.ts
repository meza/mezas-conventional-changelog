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

  export interface ConventionalCommitsPreset {
    commits?: Record<string, unknown>;
    parser?: Record<string, unknown>;
    writer?: Record<string, unknown>;
    whatBump?: Record<string, unknown>;
  }

  export const DEFAULT_COMMIT_TYPES: ReadonlyArray<ConventionalCommitType>;

  export default function createPreset(config?: ConventionalCommitsPresetConfig): Promise<ConventionalCommitsPreset>;
}
