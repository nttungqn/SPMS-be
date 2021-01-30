# Contributing

1. **Please feel free to create issues or merge requests.**
2. Branch names MUST follow:
  - Feature branch: `feature/<summary>`
  - Bug fixing branch: `bugfix/<summary>`
  - Hot fix branch: `hotfix/<summary>`
  - Release branch: `release/<semantic.version>`
3. All new branches MUST be clone from `develop`
4. All merge requests MUST be checked for squash merge.
5. Using atomic commits.
6. Follow [https://keepachangelog.com/en/1.0.0/](https://keepachangelog.com/en/1.0.0/)

## Commit message convention

1. A commit message SHOULD contain a tag:
  - Major tags are `#removed`, `#reverted`, `#upgrade`, which changes make current application make it not compatible
  - Minor tags are: `#changed`, `#added`, `#updated`
  - Patch tags are: `#patched`, `#fixed`, `#hotfixed`, `#bugfixed`
2. If commit message DOES NOT contain a tag, then consider as `#patched`