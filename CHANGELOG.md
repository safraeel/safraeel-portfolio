# Changelog

## Unreleased
- Restore live site baseline: removed experimental Next.js scaffold and particle prototype.
- Fixed preloader initialization and added accessibility improvements (aria-live, auto-start fallback).
- Made Lenis initialization safe (guarded when CDN missing) and exposed instance as `window.__lenis`.
- Added robust in-page anchor navigation using Lenis when available.
- Restored native cursor and removed global `cursor:none` to fix hover/click interactions.
- Cleaned up generated build artifacts.

