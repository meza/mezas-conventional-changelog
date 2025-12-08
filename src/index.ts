import type {
  ConventionalCommitsPresetConfig,
  ConventionalCommitType
} from 'conventional-changelog-conventionalcommits';
import conventionalCommitsPreset, {
  DEFAULT_COMMIT_TYPES as BASE_COMMIT_TYPES
} from 'conventional-changelog-conventionalcommits';

export type CommitType = ConventionalCommitType;

const dependencyCommitType: CommitType = Object.freeze({
  type: 'deps',
  section: 'Dependency updates',
  hidden: false
});

export const DEFAULT_COMMIT_TYPES: ReadonlyArray<CommitType> = Object.freeze([
  ...BASE_COMMIT_TYPES,
  dependencyCommitType
]);

export default async function createPreset(config?: ConventionalCommitsPresetConfig) {
  if (!config) {
    return conventionalCommitsPreset({ types: DEFAULT_COMMIT_TYPES });
  }

  if (config && Array.isArray(config.types)) {
    return conventionalCommitsPreset(config);
  }

  return conventionalCommitsPreset({ ...config, types: DEFAULT_COMMIT_TYPES });
}
