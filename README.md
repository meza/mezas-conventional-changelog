# Meza's Conventional Changelog

## Why this preset exists
This package is a minimal wrapper around [`conventional-changelog-conventionalcommits`](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-conventionalcommits) that bakes in the conventions Meza's projects rely on. 
It keeps the upstream behavior intact while adding one missing piece for day-to-day releases: dependency-only changes should still surface in changelogs and cut a patch version when nothing else changed. 
The preset extends the upstream commit types with a `deps` entry.

A `deps: Dependency updates` commit type captures dependency bumps, increases the patch version and creates a dedicated changelog section even when no user-facing changes landed.

## Usage
### semantic-release configuration
Point both `@semantic-release/commit-analyzer` and `@semantic-release/release-notes-generator` at this preset so the analyzer, changelog output, and GitHub releases all stay in sync.

```json
{
  ...
  "plugins": [
    ...
    ["@semantic-release/commit-analyzer", {
      "config": "@meza/mezas-conventional-changelog"
    }],
    ["@semantic-release/release-notes-generator", {
      "config": "@meza/mezas-conventional-changelog"
    }],
    ...
  ]
}
```

## License
Released under the [MIT License](LICENSE).
