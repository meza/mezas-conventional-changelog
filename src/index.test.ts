import type { ConventionalCommitsPresetConfig } from 'conventional-changelog-conventionalcommits';
import { afterEach, describe, expect, it, vi } from 'vitest';
import createPreset, { DEFAULT_COMMIT_TYPES } from './index';

afterEach(() => {
  vi.clearAllMocks();
  vi.resetModules();
  vi.restoreAllMocks();

  const maybeDoUnmock = (
    vi as unknown as {
      doUnmock?: (dep: string) => void;
    }
  ).doUnmock;
  maybeDoUnmock?.('conventional-changelog-conventionalcommits');
});

describe('createPreset', () => {
  it('delegates to the upstream preset when custom types are provided', async () => {
    const mockPreset = vi.fn().mockResolvedValue({ writer: {} });
    const baseTypes = Object.freeze([{ type: 'feat', section: 'Features' }]);

    vi.doMock('conventional-changelog-conventionalcommits', () => ({
      __esModule: true,
      DEFAULT_COMMIT_TYPES: baseTypes,
      default: mockPreset
    }));

    const customConfig: ConventionalCommitsPresetConfig = {
      types: [{ type: 'custom', section: 'Custom' }],
      releaseCount: 5
    };

    const preset = await createPreset(customConfig);

    expect(mockPreset).toHaveBeenCalledTimes(1);
    expect(mockPreset).toHaveBeenCalledWith(customConfig);
    expect(preset).toEqual({ writer: {} });
  });

  it('injects the extended default commit types when config is missing types', async () => {
    const mockPreset = vi.fn().mockResolvedValue({ parser: {} });
    const baseTypes = Object.freeze([{ type: 'feat', section: 'Features' }]);

    vi.doMock('conventional-changelog-conventionalcommits', () => ({
      __esModule: true,
      DEFAULT_COMMIT_TYPES: baseTypes,
      default: mockPreset
    }));

    const partialConfig: ConventionalCommitsPresetConfig = {
      releaseCount: 2
    };

    await createPreset(partialConfig);

    expect(mockPreset).toHaveBeenCalledTimes(1);
    expect(mockPreset).toHaveBeenCalledWith({
      ...partialConfig,
      types: DEFAULT_COMMIT_TYPES
    });
    expect('types' in partialConfig).toBe(false);
  });

  it('injects the extended default commit types when no config is provided', async () => {
    const mockPreset = vi.fn().mockResolvedValue({ parser: {} });
    const baseTypes = Object.freeze([{ type: 'feat', section: 'Features' }]);

    vi.doMock('conventional-changelog-conventionalcommits', () => ({
      __esModule: true,
      DEFAULT_COMMIT_TYPES: baseTypes,
      default: mockPreset
    }));

    await createPreset();

    expect(mockPreset).toHaveBeenCalledTimes(1);
    expect(mockPreset).toHaveBeenCalledWith({
      types: DEFAULT_COMMIT_TYPES
    });
  });
});
