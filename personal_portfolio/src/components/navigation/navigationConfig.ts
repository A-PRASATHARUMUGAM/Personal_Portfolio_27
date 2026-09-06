// src/components/navigation/navigationConfig.ts

/**
 * Single source of truth for the global navigation system.
 * Every navigation surface (TopNavigation, MobileNavigation,
 * SectionNavigation, useActiveSection) consumes this array
 * so section labels, IDs, and ordering are never duplicated.
 *
 * IDs match the `id` attribute on each top-level `<section>`.
 */
export interface NavSection {
  /** DOM id of the target section element. */
  id: string;
  /** Human-readable label for navigation UI. */
  label: string;
}

export const NAV_SECTIONS: NavSection[] = [
  { id: "home", label: "Home" },
  { id: "projects", label: "Projects" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];

/** Height in pixels of the fixed top navigation bar.
 *  Used by scroll-margin-top and manual scroll offset calculations. */
export const NAV_HEIGHT = 72;
