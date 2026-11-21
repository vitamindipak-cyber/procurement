import { ACT_PROVISION_TEXT, RULE_PROVISION_TEXT } from '../data/lawProvisionText';
import { SimulationLegalReference } from '../types/simulation';

/**
 * Returns the full authentic legal text of an Act section or Rule provision
 * by matching the reference id against the corpus in lawProvisionText.ts.
 */
export function getLegalReferenceFullText(reference: SimulationLegalReference): string | null {
  const { id } = reference;

  if (id.startsWith('act-section-')) {
    const rawSection = id.replace('act-section-', '');
    if (rawSection.includes('-')) {
      const [startStr, endStr] = rawSection.split('-');
      const start = Number.parseInt(startStr, 10);
      const end = Number.parseInt(endStr, 10);
      if (Number.isFinite(start) && Number.isFinite(end) && end >= start) {
        const parts: string[] = [];
        for (let s = start; s <= end; s++) {
          const text = ACT_PROVISION_TEXT[String(s)];
          if (text) parts.push(text);
        }
        if (parts.length > 0) return parts.join('\n\n---\n\n');
      }
    } else {
      // Single section e.g. "5", "8", "23", "25", "54", "4a"
      const normalizedKey = rawSection === '4a' ? '4क' : rawSection;
      return ACT_PROVISION_TEXT[normalizedKey] ?? ACT_PROVISION_TEXT[rawSection] ?? null;
    }
  }

  if (id.startsWith('rules-')) {
    const rawRule = id.replace('rules-', '');
    if (rawRule.includes('-')) {
      const [startStr, endStr] = rawRule.split('-');
      const start = Number.parseInt(startStr, 10);
      const end = Number.parseInt(endStr, 10);
      if (Number.isFinite(start) && Number.isFinite(end) && end >= start) {
        const parts: string[] = [];
        for (let r = start; r <= end; r++) {
          const text = RULE_PROVISION_TEXT[String(r)];
          if (text) parts.push(text);
        }
        if (parts.length > 0) return parts.join('\n\n---\n\n');
      }
    } else {
      // Single rule e.g. "88", "118"
      return RULE_PROVISION_TEXT[rawRule] ?? null;
    }
  }

  return null;
}

/**
 * Sanitizes and cleans up the source version string for display in UI cards and drawers.
 * Strips any internal repository paths, file extensions, or technical internal notations.
 */
export function formatSourceVersion(sourceVersion?: string | null): string {
  if (!sourceVersion) return '';
  const cleaned = sourceVersion
    .replace(/Repository:\s*[^\s·]+(?:\s*र\s*[^\s·]+)?\s*·?\s*/gi, '')
    .replace(/[a-zA-Z0-9_/-]+\.(?:ts|js|json)\s*·?\s*/gi, '')
    .trim();
  return cleaned;
}

