import React from 'react';

const toAsciiDigits = (value: string) =>
  value.replace(/[०-९]/g, (digit) => String('०१२३४५६७८९'.indexOf(digit)));

const toNepaliDigits = (value: string) =>
  value.replace(/[0-9]/g, (digit) => '०१२३४५६७८९'[Number(digit)]);

export const normalizeSearchText = (value: string) =>
  toAsciiDigits(value)
    .normalize('NFKC')
    .toLocaleLowerCase()
    .replace(/[\u094d\u200c\u200d]/gu, '')
    .replace(/[^\p{L}\p{M}\p{N}]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const matchesSearchText = (text: string, query: string) => {
  const normalizedText = normalizeSearchText(text);
  const terms = normalizeSearchText(query).split(' ').filter(Boolean);
  return terms.length > 0 && terms.every((term) => normalizedText.includes(term));
};

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const createFlexiblePattern = (term: string) => {
  const withoutVirama = term.replace(/[\u094d\u200c\u200d]/gu, '');
  return [...withoutVirama].map((character) =>
    `${escapeRegExp(character)}${/[\u0900-\u097f]/u.test(character) ? '\\u094d?' : ''}`
  ).join('');
};

export const SearchHighlight: React.FC<{ text: string | number; query: string }> = ({ text, query }) => {
  const value = String(text);
  const terms = normalizeSearchText(query).split(' ').filter(Boolean);
  const patterns = Array.from(new Set(terms.flatMap((term) => [
    createFlexiblePattern(term),
    createFlexiblePattern(toNepaliDigits(term)),
  ]))).filter(Boolean);

  if (patterns.length === 0) return <>{value}</>;

  const expression = new RegExp(`(${patterns.join('|')})`, 'giu');
  return (
    <>
      {value.split(expression).map((part, index) => index % 2 === 1
        ? <mark key={index} className="rounded-sm bg-amber-200 px-0.5 text-inherit">{part}</mark>
        : part)}
    </>
  );
};
