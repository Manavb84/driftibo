// The generational "persona" system was removed; the site is permanently the "Refined"
// (mil) look. This const replaces the no-op usePersona() context so client islands can drop
// the provider dependency. Kept as a literal so dead genz/classic branches fold away.
export const PERSONA = "mil" as const;
