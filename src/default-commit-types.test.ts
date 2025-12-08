import { DEFAULT_COMMIT_TYPES as UPSTREAM_COMMIT_TYPES } from 'conventional-changelog-conventionalcommits';
import { describe, expect, it } from 'vitest';
import { DEFAULT_COMMIT_TYPES } from '../src/index';

describe('DEFAULT_COMMIT_TYPES', () => {
  it('extends the upstream defaults with the deps type', () => {
    // ensure no upstream entries were lost
    UPSTREAM_COMMIT_TYPES.forEach((entry) => {
      expect(DEFAULT_COMMIT_TYPES).toContainEqual(entry);
    });

    expect(DEFAULT_COMMIT_TYPES).toContainEqual({
      type: 'deps',
      section: 'Dependency updates',
      hidden: false
    });

    expect(DEFAULT_COMMIT_TYPES).toHaveLength(UPSTREAM_COMMIT_TYPES.length + 1);
  });
});
