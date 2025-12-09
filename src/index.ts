import type {
  ConventionalCommitsPreset,
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

const dependencyBumpReason = 'Dependency updates were included in this release.';

export default async function createPreset(config?: ConventionalCommitsPresetConfig) {
  const resolvedConfig = resolveConfig(config);
  const preset = await conventionalCommitsPreset(resolvedConfig);

  const upstreamWhatBump = preset.whatBump as NonNullable<ConventionalCommitsPreset['whatBump']>;
  preset.whatBump = function dependencyAwareWhatBump(this: unknown, commits) {
    const normalizedCommits = Array.isArray(commits) ? commits : [];
    const baseResult = upstreamWhatBump.call(this, normalizedCommits);

    if (baseResult) {
      return baseResult;
    }

    if (hasDependencyCommit(normalizedCommits)) {
      return { level: 2, reason: dependencyBumpReason };
    }

    return baseResult;
  } satisfies ConventionalCommitsPreset['whatBump'];

  return preset;
}

function resolveConfig(config?: ConventionalCommitsPresetConfig) {
  if (!config) {
    return { types: DEFAULT_COMMIT_TYPES } satisfies ConventionalCommitsPresetConfig;
  }

  if (Array.isArray(config.types)) {
    return config;
  }

  return { ...config, types: DEFAULT_COMMIT_TYPES } satisfies ConventionalCommitsPresetConfig;
}

type ConventionalCommit = {
  type?: string | null;
};

function hasDependencyCommit(commits: ReadonlyArray<ConventionalCommit>) {
  return commits.some((commit) => commit?.type === dependencyCommitType.type);
}
