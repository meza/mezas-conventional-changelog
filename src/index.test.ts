import type { ConventionalCommitsPresetConfig } from 'conventional-changelog-conventionalcommits';
import { afterEach, describe, expect, it, vi } from 'vitest';

type PresetModule = typeof import('./index');

async function loadPresetModule(): Promise<PresetModule> {
  return vi.importActual<PresetModule>('./index');
}

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

    const { default: createPreset } = await loadPresetModule();
    const preset = await createPreset(customConfig);

    expect(mockPreset).toHaveBeenCalledTimes(1);
    expect(mockPreset).toHaveBeenCalledWith(customConfig);
    expect(preset.writer).toEqual({});
    expect(typeof preset.whatBump).toBe('function');
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

    const { default: createPreset, DEFAULT_COMMIT_TYPES } = await loadPresetModule();
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

    const { default: createPreset, DEFAULT_COMMIT_TYPES } = await loadPresetModule();
    await createPreset();

    expect(mockPreset).toHaveBeenCalledTimes(1);
    expect(mockPreset).toHaveBeenCalledWith({
      types: DEFAULT_COMMIT_TYPES
    });
  });

  it('forces a patch bump when dependency commits are present but upstream would skip the release', async () => {
    const upstreamWhatBump = vi.fn().mockReturnValue(null);
    const mockPreset = vi.fn().mockResolvedValue({
      whatBump: upstreamWhatBump
    });
    const baseTypes = Object.freeze([{ type: 'feat', section: 'Features' }]);

    vi.doMock('conventional-changelog-conventionalcommits', () => ({
      __esModule: true,
      DEFAULT_COMMIT_TYPES: baseTypes,
      default: mockPreset
    }));

    const { default: createPreset } = await loadPresetModule();
    const preset = await createPreset();
    const commits = [{ type: 'deps' }];
    const result = preset.whatBump?.(commits);

    expect(upstreamWhatBump).toHaveBeenCalledWith(commits);
    expect(result).toEqual({
      level: 2,
      reason: 'Dependency updates were included in this release.'
    });
  });

  it('preserves the upstream bump level when it already determines a release', async () => {
    const upstreamResult = { level: 1, reason: 'upstream' };
    const upstreamWhatBump = vi.fn().mockReturnValue(upstreamResult);
    const mockPreset = vi.fn().mockResolvedValue({
      whatBump: upstreamWhatBump
    });
    const baseTypes = Object.freeze([{ type: 'feat', section: 'Features' }]);

    vi.doMock('conventional-changelog-conventionalcommits', () => ({
      __esModule: true,
      DEFAULT_COMMIT_TYPES: baseTypes,
      default: mockPreset
    }));

    const { default: createPreset } = await loadPresetModule();
    const preset = await createPreset();
    const commits = [{ type: 'deps' }];

    expect(preset.whatBump?.(commits)).toBe(upstreamResult);
    expect(upstreamWhatBump).toHaveBeenCalledWith(commits);
  });

  it('returns upstream result when no dependency commits are present and upstream skips release', async () => {
    const upstreamWhatBump = vi.fn().mockReturnValue(null);
    const mockPreset = vi.fn().mockResolvedValue({
      whatBump: upstreamWhatBump
    });
    const baseTypes = Object.freeze([{ type: 'feat', section: 'Features' }]);

    vi.doMock('conventional-changelog-conventionalcommits', () => ({
      __esModule: true,
      DEFAULT_COMMIT_TYPES: baseTypes,
      default: mockPreset
    }));

    const { default: createPreset } = await loadPresetModule();
    const preset = await createPreset();
    const commits = [{ type: 'docs' }];

    expect(preset.whatBump?.(commits)).toBeNull();
    expect(upstreamWhatBump).toHaveBeenCalledWith(commits);
  });

  it('normalizes missing commit arrays before delegating to upstream', async () => {
    const upstreamWhatBump = vi.fn().mockReturnValue(null);
    const mockPreset = vi.fn().mockResolvedValue({
      whatBump: upstreamWhatBump
    });
    const baseTypes = Object.freeze([{ type: 'feat', section: 'Features' }]);

    vi.doMock('conventional-changelog-conventionalcommits', () => ({
      __esModule: true,
      DEFAULT_COMMIT_TYPES: baseTypes,
      default: mockPreset
    }));

    const { default: createPreset } = await loadPresetModule();
    const preset = await createPreset();

    expect(preset.whatBump?.()).toBeNull();
    expect(upstreamWhatBump).toHaveBeenCalledWith([]);
  });
});
