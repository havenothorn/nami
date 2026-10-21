---
id: pnpm-lifecycle-scripts-v10-to-v12
language: en
title: "How pnpm v10's Breaking Change Became the Standard in v11 (v10 → v12, 2026 Update)"
excerpt: "How pnpm's lifecycle-script policy, introduced in v10, changed in v11 and became the default in v12."
category: Engineering
tags:
  - pnpm
  - Supply Chain Security
  - JavaScript
date: "2026-10-21"
readTime: "10 min read"
imageUrl: ""
ogImage: "/images/posts/pnpm-lifecycle-20261020-220725.png"
author:
  name: "Nami"
  avatarUrl: ""
  role: "Author"
engagementScore: "0%"
recommendedPostIds: []
---

On March 15, 2025, I wrote [a post](https://nami-socket.tistory.com/63) about why pnpm blocked lifecycle scripts in v10 and how to configure the new behavior. The setting I recommended back then is no longer used. Here's what has changed.

When we upgraded pnpm at work from v10 to v12, our deployment started failing. I traced the problem to a change in how lifecycle scripts are allowed. I had written about v10, yet missed the changes in v11 and v12. I wanted to get the details straight, so I wrote this update.

### Too Long; Didn't Read

- **v10 (2025.01)**: Dependency lifecycle scripts are blocked by default. Allow them with `pnpm.onlyBuiltDependencies` in `package.json`. Unapproved builds produce a warning, and you can approve them with the `approve-builds` command.
- **v11 (2026.04)**: The allow-list is consolidated into `allowBuilds` in `pnpm-workspace.yaml`. An unapproved build causes installation to fail (`strictDepBuilds` defaults to `true`).
- **v12 (current)**: The implementation changed, but the policy from v11 remains the same.

## March 2025: v10

After upgrading to pnpm v10, I got an error saying the `bcrypt` module could not be found. There was a GitHub issue with the same symptom ([#9042](https://github.com/pnpm/pnpm/issues/9042)), and the release notes explained the cause:

> The lifecycle scripts of dependencies will not be executed during installation by default. This is a groundbreaking change to improve security. To allow the lifecycle scripts of specific dependencies, list them in the `pnpm.onlyBuiltDependencies` field in `package.json`.

The installation itself succeeded, but the native binding build that `bcrypt` needed to run during installation was skipped. A native binding turns C++ code into a file Node.js can load. Without it, the module could not be found when the application ran.

## What Is a Lifecycle Script?

The `scripts` field in `package.json` can contain scripts developers define themselves (`dev`, `build`, and so on), as well as a set of predefined scripts. The latter are called lifecycle scripts because they run automatically at specific points in a package's **life cycle**.

```json
{
  "name": "namis-log",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "postinstall": "node scripts/setup.js"
  },
  "dependencies": {
    "@tanstack/react-router": "^1.170.45",
    "...": "...",
    "react": "^19.3.1",
    "react-dom": "^19.3.1"
  },
  "devDependencies": {
    "@tailwindcss/typography": "^0.5.20",
    "...": "...",
    "tailwindcss": "^4.3.3",
    "typescript": "~5.8.3",
    "vite": "^8.3.4"
  }
}
```

- `preinstall` (before installation)
- `install` (during installation)
- `postinstall` (after installation)
- `prepublish` / `postpublish` (before and after publishing a package)

pnpm blocks the `preinstall`, `install`, and `postinstall` scripts of dependencies you install, including transitive dependencies. For example, these are the scripts declared in `node_modules/bcrypt/package.json`. Scripts in your own project's `package.json` are your code, so they continue to run as usual.

## Why Did pnpm Block Them?

Automatic execution creates a security risk. A user only has to run `pnpm install`, but code belonging to a dependency can run immediately afterward and steal data or install malware. Packages such as `micro-username`, `@primeo/address`, `ovh-ui/oui-checkbox`, `node-hsf`, and `alicov` have attempted this.

pnpm maintainer Zoltan Kochan said the change was a response to the Rspack supply-chain attack. The `@rspack/core` and `@rspack/cli` packages distributed XMRig, a Monero cryptocurrency miner, through their `postinstall` scripts.

![A pnpm maintainer's post about the Rspack supply-chain attack](/images/posts/pnpm-lifecycle-20261020-220725.png)

> Whenever incidents like this happen, users flood us with requests to make lifecycle scripts harder to run. A poll I posted on X suggests most users support blocking scripts by default. Honestly, I don't think there's much choice: Bun already blocks lifecycle scripts by default, so people can claim Bun is safer than pnpm. (Translated from Kochan's post on X)

## The v10 Solution (Now Legacy)

In v10, there were two ways to approve builds:

- Run `pnpm approve-builds` to review ignored builds interactively. Approved packages were added to `onlyBuiltDependencies`.
- Set `pnpm.onlyBuiltDependencies` directly in `package.json`.

![Approving build scripts in pnpm v10](/images/posts/pnpm-lifecycle-20261020-220822.png)

![An onlyBuiltDependencies configuration example in pnpm v10](/images/posts/pnpm-lifecycle-20261020-220830.png)

![The screen shown after approving build scripts in pnpm v10](/images/posts/pnpm-lifecycle-20261020-220839.png)

At the time, an unapproved build produced a warning at the end of installation, but installation still succeeded.

## The Current Solution (v11 and v12)

1. **The failure mode changed.**
   Starting with v11, `strictDepBuilds` defaults to `true`. If a build script has not been approved or denied, installation now fails with an `ERR_PNPM_IGNORED_BUILDS` error instead of showing a warning. Setting `strictDepBuilds: false` restores the old warning-only behavior, but that is not recommended from a security perspective.

2. **`allowBuilds` brings the settings together.**
   The five settings `onlyBuiltDependencies`, `onlyBuiltDependenciesFile`, `neverBuiltDependencies`, `ignoredBuiltDependencies`, and `ignoreDepScripts` were removed in v11 and consolidated into `allowBuilds`. The setting now belongs in `pnpm-workspace.yaml`, not `package.json`. v11 no longer reads the `pnpm` field in `package.json`.

3. **How to approve builds**
   - `pnpm approve-builds`: review ignored builds and approve them; the result is recorded in `allowBuilds`.
   - `pnpm ignored-builds`: list ignored builds.
   - `pnpm add --allow-build`: approve a package as you add it.
   - During installation, dependencies with unapproved builds are added to `allowBuilds` as placeholders. Set each value to `true` or `false`.

```yaml
# pnpm-workspace.yaml
allowBuilds:
  bcrypt: true
  msw: true
  cypress: true
  '@sentry/cli': true
  '@scarf/scarf': false
```

![The allowBuilds configuration in pnpm-workspace.yaml](/images/posts/pnpm-lifecycle-20261020-215712.png)

I tried a typo, and this is what the configuration looks like. A package set to `false` will not be built, even when it is fetched from the cache.

![Dependency lookup using pnpm why](/images/posts/pnpm-lifecycle-20261018-185446.png)

Use `pnpm why` to find out which package requires a dependency.

## Migrating from v10 to v11

The official codemod can automatically migrate the old settings:

```bash
pnpx codemod run pnpm-v10-to-v11
```

## What Changed?

| Item | v10 | v11 and later |
| --- | --- | --- |
| Allow setting | `pnpm.onlyBuiltDependencies` | `allowBuilds` |
| Location | `pnpm` field in `package.json` | `pnpm-workspace.yaml` |
| Deny settings | `neverBuiltDependencies`, `ignoredBuiltDependencies` | `allowBuilds: false` |
| Unapproved builds | Warning | Error (`strictDepBuilds` defaults to `true`) |
| Approval and inspection commands | `approve-builds` | `approve-builds`, `ignored-builds` |

## Configure It Before Deployment

In environments such as CI or Docker, you cannot run `approve-builds` interactively, so you need to populate `allowBuilds` ahead of time. If the setting has not been committed, or if your Dockerfile does not copy `pnpm-workspace.yaml` before running `pnpm install`, installation may work locally but fail in the pipeline.

This matters especially for projects using native modules such as `bcrypt`. Native modules contain C or C++ code in addition to JavaScript and need a binary (`.node` file) that works for the target OS and CPU. During installation, an `install` script either compiles that binary or downloads a prebuilt one. If the script is blocked, the module may not work at all.

I first ran into this in CI and Docker builds at a previous company while using v10. When my current company upgraded to v12, I encountered it again during deployment.

## Review Builds Yourself

Setting a package to `true` in `allowBuilds` means you trust its script; pnpm does not verify that the script is safe. Before approving a dependency, it is worth checking what its script actually does.

## More Than a Configuration Change

In v10, pnpm blocked one thing: scripts that run automatically after installation. But supply-chain attacks do not arrive only through scripts. Starting in v11, pnpm also made settings about when and where installed code comes from more restrictive by default.

- `minimumReleaseAge`: prevent installing versions published less than a certain amount of time ago. The default was 0 (disabled) in v10 and became 1,440 minutes (one day) in v11. This helps prevent automated pipelines from installing a malicious version immediately after it is published. Use `minimumReleaseAgeExclude` for packages that need an exception.
- `blockExoticSubdeps`: block transitive dependencies from fetching code from Git repositories or tarball URLs instead of the npm registry. The default was `false` in v10 and became `true` in v11. (Dependencies you declare directly in your own `package.json` are not restricted.)

In short, v10 restricted **what gets executed**, while v11 also considered **when a version was published** and **where the code came from**. The scope expanded from blocking a script to considering the age and source of the code being installed.

## What About v12?

pnpm v12 is a rewrite of pnpm in Rust. Its release notes say that upgrading should not feel like a migration. The v12.0 breaking-changes list does not mention a change to the build-script policy, so `allowBuilds` and the `strictDepBuilds` default from v11 still apply.

One thing to note is that v12 reports unrecognized keys in `pnpm-workspace.yaml`. Previously, a typo in `minimumReleaseAge` could be silently ignored, meaning the policy was never applied. v12 points out the typo:

> pnpm used to ignore settings it did not recognize. For example, a misspelled `minimumReleaseAge` could be silently ignored, leaving the policy unapplied.
> Starting with pnpm 12, unrecognized keys produce an error, and if a key looks like a typo, pnpm suggests the closest valid setting.

The timeline is straightforward: v10 introduced the significant change of blocking builds by default; v11 consolidated the settings into `allowBuilds` and made the policy stricter; and v12 kept the policy even while replacing the internals. Since the policy survived that implementation change, it seems less like a temporary experiment and more like pnpm's default position.

## Wrap-up

In my March 2025 post, I wrote that “package managers are moving to improve security.” pnpm started blocking build scripts in v10, consolidated the configuration and made the policy stricter in v11, and kept it in v12. This was a good reminder to keep an eye on the pnpm release notes for tools I use every day.

- [pnpm Build Settings](https://pnpm.io/settings/build)
- [pnpm 10.0.0 Blocks Lifecycle Scripts by Default (Socket)](https://socket.dev/blog/pnpm-10-0-0-blocks-lifecycle-scripts-by-default)
- [pnpm/pnpm #9042](https://github.com/pnpm/pnpm/issues/9042)
- [Rspack](https://rspack.dev/)
- [pnpm 12.0](https://pnpm.io/blog/releases/12.0#global-commands-refuse-to-run-under-sudo)
