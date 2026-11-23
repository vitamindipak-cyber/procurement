import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
import { test } from 'node:test';
import {
  ANIMATED_LESSONS,
  findLinkedSimulation,
} from './animatedLessons';
import {
  PRACTICAL_SIMULATION_CASES,
  SIMULATION_LEGAL_REFERENCES,
  SIMULATION_SECTION_TO_TAB,
} from './practicalSimulationCases';

test('animated learning UI and lesson copy contain no accidental Cyrillic or Mongolian text', () => {
  const learningView = readFileSync(
    new URL('../components/simulation/AnimatedLearningView.tsx', import.meta.url),
    'utf8',
  );
  const lessonCopy = ANIMATED_LESSONS.flatMap((lesson) => [
    lesson.title,
    lesson.description,
    lesson.fictionalExample ?? '',
    ...lesson.learningObjectives,
    ...lesson.keyPoints,
    ...lesson.legalReferences.flatMap((reference) => [
      reference.lawName,
      reference.clause,
      reference.summary,
      reference.sourceVersion,
      reference.verificationNote,
    ]),
    ...lesson.scenes.flatMap((scene) => [scene.title, scene.narration, ...(scene.subtitleCues ?? [])]),
    ...(lesson.knowledgeCheck ?? []).flatMap((question) => [
      question.prompt,
      question.explanation,
      ...question.options.map((option) => option.label),
    ]),
  ]).join(' ');
  assert.doesNotMatch(`${learningView} ${lessonCopy}`, /[\u0400-\u052f\u1800-\u18af\ufffd]/);
});

test('video legal-source panel links the latest bundled amended act and rules without pending-review status', () => {
  const learningView = readFileSync(
    new URL('../components/simulation/AnimatedLearningView.tsx', import.meta.url),
    'utf8',
  );
  const panelStart = learningView.indexOf('<h3 className="font-bold text-emerald-950">कानुनी स्रोत र समीक्षा अवस्था</h3>');
  const panelEnd = learningView.indexOf('{lesson.fictionalExample && (', panelStart);
  assert.notEqual(panelStart, -1);
  assert.notEqual(panelEnd, -1);
  const legalPanel = learningView.slice(panelStart, panelEnd);

  assert.match(legalPanel, /procurementActPdfUrl/);
  assert.match(legalPanel, /procurementRulesPdfUrl/);
  assert.match(legalPanel, /दोस्रो संशोधन \(२०८३।०३।२५\)/);
  assert.match(legalPanel, /सोह्रौँ संशोधन \(२०८३।०५।०३\)/);
  assert.doesNotMatch(legalPanel, /reference\.(?:sourceVersion|verificationNote|officialUrl)|publicationStatus|पुष्टि आवश्यक|पुष्टि बाँकी|समीक्षा आवश्यक|मस्यौदा/);
});

test('annual plan lesson links the existing simulation to generated media while review remains explicit', () => {
  const lesson = ANIMATED_LESSONS.find((item) => item.lessonId === 'annual-procurement-plan');
  assert.ok(lesson);
  assert.equal(lesson.scenes.length, 7);
  assert.equal(lesson.publicationStatus, 'draft');
  assert.equal(lesson.videoAvailable, true);
  assert.equal(lesson.voiceOverAvailable, true);
  assert.ok(statSync(new URL('../../public/videos/annual-procurement-plan.mp4', import.meta.url)).size > 1_000_000);
  assert.ok(statSync(new URL('../../public/audio/annual-procurement-plan.ne.mp3', import.meta.url)).size > 100_000);
  assert.ok(findLinkedSimulation(lesson, PRACTICAL_SIMULATION_CASES));
  assert.equal(SIMULATION_SECTION_TO_TAB.learning, 'simulation-learning');
  assert.match(lesson.legalReferences[0].sourceVersion, /सोह्रौँ संशोधन/);
  assert.match(lesson.legalReferences[0].verificationNote, /कानुनी समीक्षा आवश्यक/);
  const planningRules = SIMULATION_LEGAL_REFERENCES.find((reference) => reference.id === 'rules-7-8');
  assert.ok(planningRules);
  assert.match(planningRules.sourceVersion, /सोह्रौँ संशोधन/);
  assert.match(planningRules.verificationNote, /कानुनी समीक्षा आवश्यक/);
});

test('needs assessment lesson includes timed media, quiz and its linked scored simulation', () => {
  const lesson = ANIMATED_LESSONS.find((item) => item.lessonId === 'needs-assessment-master-plan');
  assert.ok(lesson);
  assert.equal(lesson.scenes.length, 7);
  assert.equal(lesson.knowledgeCheck?.length, 4);
  assert.equal(lesson.publicationStatus, 'draft');
  assert.equal(lesson.videoAvailable, true);
  assert.equal(lesson.voiceOverAvailable, true);
  assert.ok(statSync(new URL('../../public/videos/needs-assessment-master-plan.mp4', import.meta.url)).size > 1_000_000);
  assert.ok(statSync(new URL('../../public/audio/needs-assessment-master-plan.ne.mp3', import.meta.url)).size > 100_000);
  assert.ok(statSync(new URL('../../public/posters/needs-assessment-master-plan.svg', import.meta.url)).size > 100);

  const subtitlePath = new URL('../../public/subtitles/needs-assessment-master-plan.ne.vtt', import.meta.url);
  const transcriptPath = new URL('../../public/transcripts/needs-assessment-master-plan.ne.md', import.meta.url);
  const subtitles = readFileSync(subtitlePath, 'utf8');
  const transcript = readFileSync(transcriptPath, 'utf8');
  assert.match(subtitles, /^WEBVTT/);
  assert.equal((transcript.match(/^## दृश्य/gm) ?? []).length, 7);
  assert.equal(
    (transcript.match(/^## दृश्य/gm) ?? []).length,
    lesson.scenes.filter((scene) => scene.narration.trim()).length,
  );
  assert.ok(lesson.scenes.every((scene) =>
    scene.subtitleCues?.length && scene.narration === scene.subtitleCues.join(' '),
  ));
  const subtitleBlocks = subtitles.trim().split(/\r?\n\r?\n/).slice(1);
  const subtitleCues = subtitleBlocks.map((block) => {
    const [timingLine, ...textLines] = block.split(/\r?\n/);
    assert.match(timingLine, /^\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}$/);
    return textLines.join(' ').replace(/\s+/g, ' ').trim();
  });
  assert.deepEqual(subtitleCues, lesson.scenes.flatMap((scene) => scene.subtitleCues ?? []));

  const linkedCase = findLinkedSimulation(lesson, PRACTICAL_SIMULATION_CASES);
  assert.ok(linkedCase?.answerKey);
  assert.equal(linkedCase.content.steps.length, 4);
  const referenceIds = new Set(SIMULATION_LEGAL_REFERENCES.map((reference) => reference.id));
  assert.ok(linkedCase.content.legalReferenceIds.every((referenceId) => referenceIds.has(referenceId)));
});

test('cost estimate lesson includes synchronized media and its own scored survey simulation', () => {
  const lesson = ANIMATED_LESSONS.find((item) => item.lessonId === 'cost-estimate-market-survey');
  assert.ok(lesson);
  assert.equal(lesson.scenes.length, 7);
  assert.equal(lesson.knowledgeCheck?.length, 4);
  assert.equal(lesson.publicationStatus, 'draft');
  assert.equal(lesson.durationLabel, '३ मिनेट १४ सेकेन्ड');
  assert.ok(statSync(new URL('../../public/videos/cost-estimate-market-survey.mp4', import.meta.url)).size > 1_000_000);
  assert.ok(statSync(new URL('../../public/audio/cost-estimate-market-survey.ne.mp3', import.meta.url)).size > 100_000);
  assert.ok(statSync(new URL('../../public/posters/cost-estimate-market-survey.svg', import.meta.url)).size > 100);

  const subtitles = readFileSync(new URL('../../public/subtitles/cost-estimate-market-survey.ne.vtt', import.meta.url), 'utf8');
  const transcript = readFileSync(new URL('../../public/transcripts/cost-estimate-market-survey.ne.md', import.meta.url), 'utf8');
  assert.match(subtitles, /^WEBVTT/);
  assert.equal((transcript.match(/^## दृश्य/gm) ?? []).length, 7);
  assert.match(transcript, /synthetic voice-over/);
  const subtitleBlocks = subtitles.trim().split(/\r?\n\r?\n/).slice(1);
  const subtitleCues = subtitleBlocks.map((block) => {
    const [timingLine, ...textLines] = block.split(/\r?\n/);
    assert.match(timingLine, /^\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}$/);
    return textLines.join(' ').replace(/\s+/g, ' ').trim();
  });
  assert.deepEqual(subtitleCues, lesson.scenes.flatMap((scene) => scene.subtitleCues ?? []));

  const linkedCase = findLinkedSimulation(lesson, PRACTICAL_SIMULATION_CASES);
  assert.ok(linkedCase?.answerKey);
  assert.equal(linkedCase.content.steps.length, 4);
  assert.equal(linkedCase.content.steps.reduce((sum, step) => sum + step.points, 0), 100);
});

test('specification and TOR lesson has seven captioned scenes and a linked scored case', () => {
  const lesson = ANIMATED_LESSONS.find((item) => item.lessonId === 'specification-scope-tor');
  assert.ok(lesson);
  assert.equal(lesson.scenes.length, 7);
  assert.equal(lesson.knowledgeCheck?.length, 4);
  assert.equal(lesson.publicationStatus, 'draft');
  assert.equal(lesson.durationLabel, '३ मिनेट १९ सेकेन्ड');
  assert.ok(statSync(new URL('../../public/videos/specification-scope-tor.mp4', import.meta.url)).size > 1_000_000);
  assert.ok(statSync(new URL('../../public/audio/specification-scope-tor.ne.mp3', import.meta.url)).size > 100_000);
  assert.ok(statSync(new URL('../../public/posters/specification-scope-tor.svg', import.meta.url)).size > 100);

  const subtitles = readFileSync(new URL('../../public/subtitles/specification-scope-tor.ne.vtt', import.meta.url), 'utf8');
  const transcript = readFileSync(new URL('../../public/transcripts/specification-scope-tor.ne.md', import.meta.url), 'utf8');
  assert.match(subtitles, /^WEBVTT/);
  assert.equal((transcript.match(/^## दृश्य/gm) ?? []).length, 7);
  const cues = subtitles.trim().split(/\r?\n\r?\n/).slice(1).map((block) => {
    const [timingLine, ...textLines] = block.split(/\r?\n/);
    assert.match(timingLine, /^\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}$/);
    return textLines.join(' ').replace(/\s+/g, ' ').trim();
  });
  assert.deepEqual(cues, lesson.scenes.flatMap((scene) => scene.subtitleCues ?? []));
  const linkedCase = findLinkedSimulation(lesson, PRACTICAL_SIMULATION_CASES);
  assert.ok(linkedCase?.answerKey);
  assert.equal(linkedCase.content.steps.length, 4);
  assert.equal(linkedCase.content.steps.reduce((sum, step) => sum + step.points, 0), 100);
});

test('procurement-method lesson includes synchronized media and its own scored simulation', () => {
  const lesson = ANIMATED_LESSONS.find((item) => item.lessonId === 'procurement-method-selection-video');
  assert.ok(lesson);
  assert.equal(lesson.scenes.length, 7);
  assert.equal(lesson.knowledgeCheck?.length, 4);
  assert.equal(lesson.publicationStatus, 'draft');
  assert.equal(lesson.durationLabel, '३ मिनेट ०० सेकेन्ड');
  assert.ok(statSync(new URL('../../public/videos/procurement-method-selection-video.mp4', import.meta.url)).size > 1_000_000);
  assert.ok(statSync(new URL('../../public/audio/procurement-method-selection-video.ne.mp3', import.meta.url)).size > 100_000);
  assert.ok(statSync(new URL('../../public/posters/procurement-method-selection-video.svg', import.meta.url)).size > 100);

  const subtitles = readFileSync(new URL('../../public/subtitles/procurement-method-selection-video.ne.vtt', import.meta.url), 'utf8');
  const transcript = readFileSync(new URL('../../public/transcripts/procurement-method-selection-video.ne.md', import.meta.url), 'utf8');
  assert.match(subtitles, /^WEBVTT/);
  assert.match(transcript, /synthetic voice-over/);
  assert.equal((transcript.match(/^## दृश्य/gm) ?? []).length, 7);
  const cues = subtitles.trim().split(/\r?\n\r?\n/).slice(1).map((block) => {
    const [timingLine, ...textLines] = block.split(/\r?\n/);
    assert.match(timingLine, /^\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}$/);
    return textLines.join(' ').replace(/\s+/g, ' ').trim();
  });
  assert.deepEqual(cues, lesson.scenes.flatMap((scene) => scene.subtitleCues ?? []));
  assert.doesNotMatch(lesson.scenes.flatMap((scene) => scene.subtitleCues ?? []).join(' '), /[\u0400-\u052f\u1800-\u18af\ufffd]/);

  const linkedCase = findLinkedSimulation(lesson, PRACTICAL_SIMULATION_CASES);
  assert.ok(linkedCase?.answerKey);
  assert.equal(linkedCase.content.steps.length, 4);
  assert.equal(linkedCase.content.steps.reduce((sum, step) => sum + step.points, 0), 100);
});

test('bidding document lesson includes reviewed-source notes, timed media and a linked scored case', () => {
  const lesson = ANIMATED_LESSONS.find((item) => item.lessonId === 'bidding-document-preparation');
  assert.ok(lesson);
  assert.equal(lesson.scenes.length, 7);
  assert.equal(lesson.knowledgeCheck?.length, 4);
  assert.equal(lesson.publicationStatus, 'draft');
  assert.equal(lesson.durationLabel, '३ मिनेट ११ सेकेन्ड');
  assert.ok(lesson.legalReferences.every((reference) => /कानुनी समीक्षा आवश्यक/.test(reference.verificationNote)));
  assert.ok(statSync(new URL('../../public/videos/bidding-document-preparation.mp4', import.meta.url)).size > 1_000_000);
  assert.ok(statSync(new URL('../../public/audio/bidding-document-preparation.ne.mp3', import.meta.url)).size > 100_000);
  assert.ok(statSync(new URL('../../public/posters/bidding-document-preparation.svg', import.meta.url)).size > 100);

  const subtitles = readFileSync(new URL('../../public/subtitles/bidding-document-preparation.ne.vtt', import.meta.url), 'utf8');
  const transcript = readFileSync(new URL('../../public/transcripts/bidding-document-preparation.ne.md', import.meta.url), 'utf8');
  assert.match(subtitles, /^WEBVTT/);
  assert.match(transcript, /synthetic voice-over/);
  assert.equal((transcript.match(/^## दृश्य/gm) ?? []).length, 7);
  const cues = subtitles.trim().split(/\r?\n\r?\n/).slice(1).map((block) => {
    const [timingLine, ...textLines] = block.split(/\r?\n/);
    assert.match(timingLine, /^\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}$/);
    return textLines.join(' ').replace(/\s+/g, ' ').trim();
  });
  assert.deepEqual(cues, lesson.scenes.flatMap((scene) => scene.subtitleCues ?? []));
  assert.doesNotMatch(lesson.scenes.flatMap((scene) => scene.subtitleCues ?? []).join(' '), /[\u0400-\u052f\u1800-\u18af\ufffd]/);

  const linkedCase = findLinkedSimulation(lesson, PRACTICAL_SIMULATION_CASES);
  assert.ok(linkedCase?.answerKey);
  assert.equal(linkedCase.content.steps.length, 4);
  assert.equal(linkedCase.content.steps.reduce((sum, step) => sum + step.points, 0), 100);
});

test('tender notice lesson includes deadline review, synchronized media and a linked scored case', () => {
  const lesson = ANIMATED_LESSONS.find((item) => item.lessonId === 'tender-notice-publication');
  assert.ok(lesson);
  assert.equal(lesson.scenes.length, 7);
  assert.equal(lesson.knowledgeCheck?.length, 4);
  assert.equal(lesson.publicationStatus, 'draft');
  assert.equal(lesson.durationLabel, '३ मिनेट ०१ सेकेन्ड');
  assert.ok(lesson.legalReferences.every((reference) => /कानुनी समीक्षा आवश्यक/.test(reference.verificationNote)));
  assert.ok(statSync(new URL('../../public/videos/tender-notice-publication.mp4', import.meta.url)).size > 1_000_000);
  assert.ok(statSync(new URL('../../public/audio/tender-notice-publication.ne.mp3', import.meta.url)).size > 100_000);
  assert.ok(statSync(new URL('../../public/posters/tender-notice-publication.svg', import.meta.url)).size > 100);

  const subtitles = readFileSync(new URL('../../public/subtitles/tender-notice-publication.ne.vtt', import.meta.url), 'utf8');
  const transcript = readFileSync(new URL('../../public/transcripts/tender-notice-publication.ne.md', import.meta.url), 'utf8');
  assert.match(subtitles, /^WEBVTT/);
  assert.match(transcript, /synthetic voice-over/);
  assert.equal((transcript.match(/^## दृश्य/gm) ?? []).length, 7);
  const cues = subtitles.trim().split(/\r?\n\r?\n/).slice(1).map((block) => {
    const [timingLine, ...textLines] = block.split(/\r?\n/);
    assert.match(timingLine, /^\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}$/);
    return textLines.join(' ').replace(/\s+/g, ' ').trim();
  });
  assert.deepEqual(cues, lesson.scenes.flatMap((scene) => scene.subtitleCues ?? []));
  assert.doesNotMatch(lesson.scenes.flatMap((scene) => scene.subtitleCues ?? []).join(' '), /[\u0400-\u052f\u1800-\u18af\ufffd]/);

  const linkedCase = findLinkedSimulation(lesson, PRACTICAL_SIMULATION_CASES);
  assert.ok(linkedCase?.answerKey);
  assert.equal(linkedCase.content.steps.length, 4);
  assert.equal(linkedCase.content.steps.reduce((sum, step) => sum + step.points, 0), 100);
});

test('e-GP lesson includes timed media, explicit legal review and a linked scored case', () => {
  const lesson = ANIMATED_LESSONS.find((item) => item.lessonId === 'egp-procurement-process');
  assert.ok(lesson);
  assert.equal(lesson.scenes.length, 7);
  assert.equal(lesson.knowledgeCheck?.length, 4);
  assert.equal(lesson.publicationStatus, 'draft');
  assert.equal(lesson.durationLabel, '३ मिनेट ११ सेकेन्ड');
  assert.ok(lesson.legalReferences.every((reference) => /कानुनी समीक्षा आवश्यक/.test(reference.verificationNote)));
  assert.ok(statSync(new URL('../../public/videos/egp-procurement-process.mp4', import.meta.url)).size > 1_000_000);
  assert.ok(statSync(new URL('../../public/audio/egp-procurement-process.ne.mp3', import.meta.url)).size > 100_000);
  assert.ok(statSync(new URL('../../public/posters/egp-procurement-process.svg', import.meta.url)).size > 100);

  const subtitles = readFileSync(new URL('../../public/subtitles/egp-procurement-process.ne.vtt', import.meta.url), 'utf8');
  const transcript = readFileSync(new URL('../../public/transcripts/egp-procurement-process.ne.md', import.meta.url), 'utf8');
  assert.match(subtitles, /^WEBVTT/);
  assert.match(transcript, /synthetic voice-over/);
  assert.equal((transcript.match(/^## दृश्य/gm) ?? []).length, 7);
  const cues = subtitles.trim().split(/\r?\n\r?\n/).slice(1).map((block) => {
    const [timingLine, ...textLines] = block.split(/\r?\n/);
    assert.match(timingLine, /^\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}$/);
    return textLines.join(' ').replace(/\s+/g, ' ').trim();
  });
  assert.deepEqual(cues, lesson.scenes.flatMap((scene) => scene.subtitleCues ?? []));
  assert.doesNotMatch(lesson.scenes.flatMap((scene) => scene.subtitleCues ?? []).join(' '), /[\u0400-\u052f\u1800-\u18af\ufffd]/);

  const linkedCase = findLinkedSimulation(lesson, PRACTICAL_SIMULATION_CASES);
  assert.ok(linkedCase?.answerKey);
  assert.equal(linkedCase.content.steps.length, 4);
  assert.equal(linkedCase.content.steps.reduce((sum, step) => sum + step.points, 0), 100);
});

test('bid-opening lesson separates opening notes from initial checks and links a scored case', () => {
  const lesson = ANIMATED_LESSONS.find((item) => item.lessonId === 'bid-opening-initial-check');
  assert.ok(lesson);
  assert.equal(lesson.scenes.length, 7);
  assert.equal(lesson.knowledgeCheck?.length, 4);
  assert.equal(lesson.publicationStatus, 'draft');
  assert.equal(lesson.durationLabel, '३ मिनेट ०७ सेकेन्ड');
  assert.ok(lesson.legalReferences.every((reference) => /कानुनी समीक्षा आवश्यक/.test(reference.verificationNote)));
  assert.ok(statSync(new URL('../../public/videos/bid-opening-initial-check.mp4', import.meta.url)).size > 1_000_000);
  assert.ok(statSync(new URL('../../public/audio/bid-opening-initial-check.ne.mp3', import.meta.url)).size > 100_000);
  assert.ok(statSync(new URL('../../public/posters/bid-opening-initial-check.svg', import.meta.url)).size > 100);

  const subtitles = readFileSync(new URL('../../public/subtitles/bid-opening-initial-check.ne.vtt', import.meta.url), 'utf8');
  const transcript = readFileSync(new URL('../../public/transcripts/bid-opening-initial-check.ne.md', import.meta.url), 'utf8');
  assert.match(subtitles, /^WEBVTT/);
  assert.match(transcript, /synthetic voice-over/);
  assert.equal((transcript.match(/^## दृश्य/gm) ?? []).length, 7);
  const cues = subtitles.trim().split(/\r?\n\r?\n/).slice(1).map((block) => {
    const [timingLine, ...textLines] = block.split(/\r?\n/);
    assert.match(timingLine, /^\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}$/);
    return textLines.join(' ').replace(/\s+/g, ' ').trim();
  });
  assert.deepEqual(cues, lesson.scenes.flatMap((scene) => scene.subtitleCues ?? []));
  assert.doesNotMatch(lesson.scenes.flatMap((scene) => scene.subtitleCues ?? []).join(' '), /[\u0400-\u052f\u1800-\u18af\ufffd]/);

  const linkedCase = findLinkedSimulation(lesson, PRACTICAL_SIMULATION_CASES);
  assert.ok(linkedCase?.answerKey);
  assert.equal(linkedCase.content.steps.length, 4);
  assert.equal(linkedCase.content.steps.reduce((sum, step) => sum + step.points, 0), 100);
});

test('proposal-evaluation lesson links synchronized media and a fictional scored simulation', () => {
  const lesson = ANIMATED_LESSONS.find((item) => item.lessonId === 'technical-financial-proposal-evaluation');
  assert.ok(lesson);
  assert.equal(lesson.scenes.length, 7);
  assert.equal(lesson.scenes.flatMap((scene) => scene.subtitleCues ?? []).length, 38);
  assert.equal(lesson.knowledgeCheck?.length, 4);
  assert.equal(lesson.publicationStatus, 'draft');
  assert.ok(lesson.legalReferences.every((reference) => /कानुनी समीक्षा आवश्यक/.test(reference.verificationNote)));
  assert.ok(statSync(new URL('../../public/videos/technical-financial-proposal-evaluation.mp4', import.meta.url)).size > 1_000_000);
  assert.ok(statSync(new URL('../../public/audio/technical-financial-proposal-evaluation.ne.mp3', import.meta.url)).size > 100_000);
  assert.ok(statSync(new URL('../../public/posters/technical-financial-proposal-evaluation.svg', import.meta.url)).size > 100);

  const subtitles = readFileSync(new URL('../../public/subtitles/technical-financial-proposal-evaluation.ne.vtt', import.meta.url), 'utf8');
  const transcript = readFileSync(new URL('../../public/transcripts/technical-financial-proposal-evaluation.ne.md', import.meta.url), 'utf8');
  assert.match(subtitles, /^WEBVTT/);
  assert.match(transcript, /synthetic voice-over/);
  assert.equal((transcript.match(/^## दृश्य/gm) ?? []).length, 7);
  const cues = subtitles.trim().split(/\r?\n\r?\n/).slice(1).map((block) => {
    const [timingLine, ...textLines] = block.split(/\r?\n/);
    assert.match(timingLine, /^\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}$/);
    return textLines.join(' ').replace(/\s+/g, ' ').trim();
  });
  assert.deepEqual(cues, lesson.scenes.flatMap((scene) => scene.subtitleCues ?? []));
  assert.doesNotMatch(cues.join(' '), /[\u0400-\u052f\u1800-\u18af\ufffd]/);

  const linkedCase = findLinkedSimulation(lesson, PRACTICAL_SIMULATION_CASES);
  assert.ok(linkedCase?.answerKey);
  assert.equal(linkedCase.content.steps.length, 4);
  assert.equal(linkedCase.content.steps.reduce((sum, step) => sum + step.points, 0), 100);
  assert.ok(linkedCase.content.mockDocuments?.some((document) => /काल्पनिक/.test(document.content)));
});

test('evaluation-report lesson keeps the current legal sequence under review', () => {
  const lesson = ANIMATED_LESSONS.find((item) => item.lessonId === 'evaluation-report-approval-intent');
  assert.ok(lesson);
  assert.equal(lesson.scenes.length, 7);
  assert.equal(lesson.scenes.flatMap((scene) => scene.subtitleCues ?? []).length, 38);
  assert.equal(lesson.knowledgeCheck?.length, 4);
  assert.equal(lesson.publicationStatus, 'draft');
  assert.ok(lesson.legalReferences.every((reference) => /कानुनी समीक्षा आवश्यक/.test(reference.verificationNote)));
  assert.ok(statSync(new URL('../../public/videos/evaluation-report-approval-intent.mp4', import.meta.url)).size > 1_000_000);
  assert.ok(statSync(new URL('../../public/audio/evaluation-report-approval-intent.ne.mp3', import.meta.url)).size > 100_000);
  assert.ok(statSync(new URL('../../public/posters/evaluation-report-approval-intent.svg', import.meta.url)).size > 100);

  const subtitles = readFileSync(new URL('../../public/subtitles/evaluation-report-approval-intent.ne.vtt', import.meta.url), 'utf8');
  const transcript = readFileSync(new URL('../../public/transcripts/evaluation-report-approval-intent.ne.md', import.meta.url), 'utf8');
  assert.match(subtitles, /^WEBVTT/);
  assert.match(transcript, /synthetic voice-over/);
  assert.equal((transcript.match(/^## दृश्य/gm) ?? []).length, 7);
  const cues = subtitles.trim().split(/\r?\n\r?\n/).slice(1).map((block) => {
    const [timingLine, ...textLines] = block.split(/\r?\n/);
    assert.match(timingLine, /^\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}$/);
    return textLines.join(' ').replace(/\s+/g, ' ').trim();
  });
  assert.deepEqual(cues, lesson.scenes.flatMap((scene) => scene.subtitleCues ?? []));
  assert.doesNotMatch(cues.join(' '), /[\u0400-\u052f\u1800-\u18af\ufffd]/);

  const linkedCase = findLinkedSimulation(lesson, PRACTICAL_SIMULATION_CASES);
  assert.ok(linkedCase?.answerKey);
  assert.equal(linkedCase.content.steps.length, 4);
  assert.equal(linkedCase.content.steps.reduce((sum, step) => sum + step.points, 0), 100);
  assert.ok(linkedCase.content.mockDocuments?.some((document) => /काल्पनिक/.test(document.content)));
});

test('contract and performance-security lesson links generated media and its own scored simulation', () => {
  const lesson = ANIMATED_LESSONS.find((item) => item.lessonId === 'contract-signing-performance-security');
  assert.ok(lesson);
  assert.equal(lesson.scenes.length, 7);
  assert.equal(lesson.scenes.flatMap((scene) => scene.subtitleCues ?? []).length, 38);
  assert.equal(lesson.knowledgeCheck?.length, 4);
  assert.equal(lesson.publicationStatus, 'draft');
  assert.ok(lesson.legalReferences.every((reference) => /कानुनी समीक्षा आवश्यक/.test(reference.verificationNote)));
  assert.ok(statSync(new URL('../../public/videos/contract-signing-performance-security.mp4', import.meta.url)).size > 1_000_000);
  assert.ok(statSync(new URL('../../public/audio/contract-signing-performance-security.ne.mp3', import.meta.url)).size > 100_000);
  assert.ok(statSync(new URL('../../public/posters/contract-signing-performance-security.svg', import.meta.url)).size > 100);

  const subtitles = readFileSync(new URL('../../public/subtitles/contract-signing-performance-security.ne.vtt', import.meta.url), 'utf8');
  const transcript = readFileSync(new URL('../../public/transcripts/contract-signing-performance-security.ne.md', import.meta.url), 'utf8');
  assert.match(subtitles, /^WEBVTT/);
  assert.match(transcript, /synthetic voice-over/);
  assert.equal((transcript.match(/^## दृश्य/gm) ?? []).length, 7);
  const cues = subtitles.trim().split(/\r?\n\r?\n/).slice(1).map((block) => {
    const [timingLine, ...textLines] = block.split(/\r?\n/);
    assert.match(timingLine, /^\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}$/);
    return textLines.join(' ').replace(/\s+/g, ' ').trim();
  });
  assert.deepEqual(cues, lesson.scenes.flatMap((scene) => scene.subtitleCues ?? []));
  assert.doesNotMatch(cues.join(' '), /[\u0400-\u052f\u1800-\u18af\ufffd]/);

  const linkedCase = findLinkedSimulation(lesson, PRACTICAL_SIMULATION_CASES);
  assert.ok(linkedCase?.answerKey);
  assert.equal(linkedCase.content.steps.length, 4);
  assert.equal(linkedCase.content.steps.reduce((sum, step) => sum + step.points, 0), 100);
  assert.ok(linkedCase.content.mockDocuments?.some((document) => /काल्पनिक/.test(document.content)));
});

test('goods procurement lesson links synchronized media and a four-criteria scored simulation', () => {
  const lesson = ANIMATED_LESSONS.find((item) => item.lessonId === 'goods-procurement-process');
  assert.ok(lesson);
  assert.equal(lesson.scenes.length, 7);
  assert.equal(lesson.knowledgeCheck?.length, 4);
  assert.equal(lesson.publicationStatus, 'draft');
  assert.ok(lesson.legalReferences.every((reference) => /कानुनी समीक्षा आवश्यक/.test(reference.verificationNote)));
  assert.ok(statSync(new URL('../../public/videos/goods-procurement-process.mp4', import.meta.url)).size > 1_000_000);
  assert.ok(statSync(new URL('../../public/audio/goods-procurement-process.ne.mp3', import.meta.url)).size > 100_000);
  assert.ok(statSync(new URL('../../public/posters/goods-procurement-process.svg', import.meta.url)).size > 100);

  const subtitles = readFileSync(new URL('../../public/subtitles/goods-procurement-process.ne.vtt', import.meta.url), 'utf8');
  const transcript = readFileSync(new URL('../../public/transcripts/goods-procurement-process.ne.md', import.meta.url), 'utf8');
  assert.match(subtitles, /^WEBVTT/);
  assert.match(transcript, /synthetic voice-over/);
  assert.equal((transcript.match(/^## दृश्य/gm) ?? []).length, 7);
  const cues = subtitles.trim().split(/\r?\n\r?\n/).slice(1).map((block) => {
    const [timingLine, ...textLines] = block.split(/\r?\n/);
    assert.match(timingLine, /^\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}$/);
    return textLines.join(' ').replace(/\s+/g, ' ').trim();
  });
  assert.deepEqual(cues, lesson.scenes.flatMap((scene) => scene.subtitleCues ?? []));
  assert.doesNotMatch(cues.join(' '), /[\u0400-\u052f\u1800-\u18af\ufffd]/);

  const linkedCase = findLinkedSimulation(lesson, PRACTICAL_SIMULATION_CASES);
  assert.ok(linkedCase?.answerKey);
  assert.equal(linkedCase.content.steps.length, 4);
  assert.equal(linkedCase.content.steps.reduce((sum, step) => sum + step.points, 0), 100);
  assert.ok(linkedCase.content.mockDocuments?.some((document) => /काल्पनिक/.test(document.content)));
});

test('construction procurement lesson links synchronized media and a four-criteria scored simulation', () => {
  const lesson = ANIMATED_LESSONS.find((item) => item.lessonId === 'construction-works-procurement-process');
  assert.ok(lesson);
  assert.equal(lesson.scenes.length, 7);
  assert.equal(lesson.knowledgeCheck?.length, 4);
  assert.equal(lesson.publicationStatus, 'draft');
  assert.ok(lesson.legalReferences.every((reference) => /कानुनी समीक्षा आवश्यक/.test(reference.verificationNote)));
  assert.ok(statSync(new URL('../../public/videos/construction-works-procurement-process.mp4', import.meta.url)).size > 1_000_000);
  assert.ok(statSync(new URL('../../public/audio/construction-works-procurement-process.ne.mp3', import.meta.url)).size > 100_000);
  assert.ok(statSync(new URL('../../public/posters/construction-works-procurement-process.svg', import.meta.url)).size > 100);

  const subtitles = readFileSync(new URL('../../public/subtitles/construction-works-procurement-process.ne.vtt', import.meta.url), 'utf8');
  const transcript = readFileSync(new URL('../../public/transcripts/construction-works-procurement-process.ne.md', import.meta.url), 'utf8');
  assert.match(subtitles, /^WEBVTT/);
  assert.match(transcript, /synthetic voice-over/);
  assert.equal((transcript.match(/^## दृश्य/gm) ?? []).length, 7);
  const cues = subtitles.trim().split(/\r?\n\r?\n/).slice(1).map((block) => {
    const [timingLine, ...textLines] = block.split(/\r?\n/);
    assert.match(timingLine, /^\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}$/);
    return textLines.join(' ').replace(/\s+/g, ' ').trim();
  });
  assert.deepEqual(cues, lesson.scenes.flatMap((scene) => scene.subtitleCues ?? []));
  assert.doesNotMatch(cues.join(' '), /[\u0400-\u052f\u1800-\u18af\ufffd]/);

  const linkedCase = findLinkedSimulation(lesson, PRACTICAL_SIMULATION_CASES);
  assert.ok(linkedCase?.answerKey);
  assert.equal(linkedCase.content.steps.length, 4);
  assert.equal(linkedCase.content.steps.reduce((sum, step) => sum + step.points, 0), 100);
  assert.ok(linkedCase.content.mockDocuments?.some((document) => /काल्पनिक/.test(document.content)));
});

test('consulting service lesson reuses the existing scored negotiation simulation', () => {
  const lesson = ANIMATED_LESSONS.find((item) => item.lessonId === 'consulting-service-procurement');
  assert.ok(lesson);
  assert.equal(lesson.scenes.length, 7);
  assert.equal(lesson.knowledgeCheck?.length, 4);
  assert.equal(lesson.publicationStatus, 'draft');
  assert.ok(lesson.legalReferences.every((reference) => /कानुनी समीक्षा आवश्यक/.test(reference.verificationNote)));
  assert.ok(statSync(new URL('../../public/videos/consulting-service-procurement.mp4', import.meta.url)).size > 1_000_000);
  assert.ok(statSync(new URL('../../public/audio/consulting-service-procurement.ne.mp3', import.meta.url)).size > 100_000);
  assert.ok(statSync(new URL('../../public/posters/consulting-service-procurement.svg', import.meta.url)).size > 100);

  const subtitles = readFileSync(new URL('../../public/subtitles/consulting-service-procurement.ne.vtt', import.meta.url), 'utf8');
  const transcript = readFileSync(new URL('../../public/transcripts/consulting-service-procurement.ne.md', import.meta.url), 'utf8');
  assert.match(subtitles, /^WEBVTT/);
  assert.match(transcript, /synthetic voice-over/);
  assert.equal((transcript.match(/^## दृश्य/gm) ?? []).length, 7);
  const cues = subtitles.trim().split(/\r?\n\r?\n/).slice(1).map((block) => {
    const [timingLine, ...textLines] = block.split(/\r?\n/);
    assert.match(timingLine, /^\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}$/);
    return textLines.join(' ').replace(/\s+/g, ' ').trim();
  });
  assert.deepEqual(cues, lesson.scenes.flatMap((scene) => scene.subtitleCues ?? []));
  assert.doesNotMatch(cues.join(' '), /[\u0400-\u052f\u1800-\u18af\ufffd]/);

  const linkedCase = findLinkedSimulation(lesson, PRACTICAL_SIMULATION_CASES);
  assert.equal(linkedCase?.caseKey, 'consulting-selection-and-negotiation');
  assert.ok(linkedCase?.answerKey);
  assert.equal(linkedCase.content.steps.length, 4);
  assert.equal(linkedCase.content.steps.reduce((sum, step) => sum + step.points, 0), 100);
});

test('non-consulting service lesson links its own scored simulation', () => {
  const lesson = ANIMATED_LESSONS.find((item) => item.lessonId === 'non-consulting-service-procurement');
  assert.ok(lesson);
  assert.equal(lesson.scenes.length, 7);
  assert.equal(lesson.knowledgeCheck?.length, 4);
  assert.equal(lesson.publicationStatus, 'draft');
  assert.ok(lesson.legalReferences.every((reference) => /कानुनी समीक्षा आवश्यक/.test(reference.verificationNote)));
  assert.ok(statSync(new URL('../../public/videos/non-consulting-service-procurement.mp4', import.meta.url)).size > 1_000_000);
  assert.ok(statSync(new URL('../../public/audio/non-consulting-service-procurement.ne.mp3', import.meta.url)).size > 100_000);
  assert.ok(statSync(new URL('../../public/posters/non-consulting-service-procurement.svg', import.meta.url)).size > 100);

  const subtitles = readFileSync(new URL('../../public/subtitles/non-consulting-service-procurement.ne.vtt', import.meta.url), 'utf8');
  const transcript = readFileSync(new URL('../../public/transcripts/non-consulting-service-procurement.ne.md', import.meta.url), 'utf8');
  assert.match(subtitles, /^WEBVTT/);
  assert.match(transcript, /synthetic voice-over/);
  assert.equal((transcript.match(/^## दृश्य/gm) ?? []).length, 7);
  const cues = subtitles.trim().split(/\r?\n\r?\n/).slice(1).map((block) => {
    const [timingLine, ...textLines] = block.split(/\r?\n/);
    assert.match(timingLine, /^\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}$/);
    return textLines.join(' ').replace(/\s+/g, ' ').trim();
  });
  assert.deepEqual(cues, lesson.scenes.flatMap((scene) => scene.subtitleCues ?? []));
  assert.doesNotMatch(cues.join(' '), /[\u0400-\u052f\u1800-\u18af\ufffd]/);

  const linkedCase = findLinkedSimulation(lesson, PRACTICAL_SIMULATION_CASES);
  assert.equal(linkedCase?.caseKey, 'non-consulting-service-procurement');
  assert.ok(linkedCase?.answerKey);
  assert.equal(linkedCase.content.steps.length, 4);
  assert.equal(linkedCase.content.steps.reduce((sum, step) => sum + step.points, 0), 100);
});

test('quotation and direct-procurement lesson links a legal-review-required scored case', () => {
  const lesson = ANIMATED_LESSONS.find((item) => item.lessonId === 'quotation-direct-procurement-methods');
  assert.ok(lesson);
  assert.equal(lesson.scenes.length, 7);
  assert.equal(lesson.knowledgeCheck?.length, 4);
  assert.equal(lesson.publicationStatus, 'draft');
  assert.ok(lesson.legalReferences.every((reference) => /कानुनी समीक्षा आवश्यक/.test(reference.verificationNote)));
  assert.ok(statSync(new URL('../../public/videos/quotation-direct-procurement-methods.mp4', import.meta.url)).size > 1_000_000);
  assert.ok(statSync(new URL('../../public/audio/quotation-direct-procurement-methods.ne.mp3', import.meta.url)).size > 100_000);
  assert.ok(statSync(new URL('../../public/posters/quotation-direct-procurement-methods.svg', import.meta.url)).size > 100);

  const subtitles = readFileSync(new URL('../../public/subtitles/quotation-direct-procurement-methods.ne.vtt', import.meta.url), 'utf8');
  const transcript = readFileSync(new URL('../../public/transcripts/quotation-direct-procurement-methods.ne.md', import.meta.url), 'utf8');
  assert.match(subtitles, /^WEBVTT/);
  assert.match(transcript, /synthetic voice-over/);
  assert.equal((transcript.match(/^## दृश्य/gm) ?? []).length, 7);
  const cues = subtitles.trim().split(/\r?\n\r?\n/).slice(1).map((block) => {
    const [timingLine, ...textLines] = block.split(/\r?\n/);
    assert.match(timingLine, /^\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}$/);
    return textLines.join(' ').replace(/\s+/g, ' ').trim();
  });
  assert.deepEqual(cues, lesson.scenes.flatMap((scene) => scene.subtitleCues ?? []));
  assert.doesNotMatch(cues.join(' '), /[\u0400-\u052f\u1800-\u18af\ufffd]/);

  const linkedCase = findLinkedSimulation(lesson, PRACTICAL_SIMULATION_CASES);
  assert.equal(linkedCase?.caseKey, 'quotation-direct-procurement-practice');
  assert.ok(linkedCase?.answerKey);
  assert.equal(linkedCase.content.steps.length, 4);
  assert.equal(linkedCase.content.steps.reduce((sum, step) => sum + step.points, 0), 100);
});

test('special-circumstances lesson includes synchronized media and a scored review case', () => {
  const lesson = ANIMATED_LESSONS.find((item) => item.lessonId === 'special-circumstances-rebid-failure');
  assert.ok(lesson);
  assert.equal(lesson.scenes.length, 7);
  assert.equal(lesson.knowledgeCheck?.length, 4);
  assert.equal(lesson.publicationStatus, 'draft');
  assert.ok(lesson.legalReferences.every((reference) => /कानुनी समीक्षा आवश्यक/.test(reference.verificationNote)));
  assert.ok(lesson.videoAvailable);
  assert.ok(lesson.voiceOverAvailable);
  assert.ok(statSync(new URL('../../public/videos/special-circumstances-rebid-failure.mp4', import.meta.url)).size > 1_000_000);
  assert.ok(statSync(new URL('../../public/audio/special-circumstances-rebid-failure.ne.mp3', import.meta.url)).size > 100_000);
  assert.ok(statSync(new URL('../../public/posters/special-circumstances-rebid-failure.svg', import.meta.url)).size > 100);

  const subtitles = readFileSync(new URL('../../public/subtitles/special-circumstances-rebid-failure.ne.vtt', import.meta.url), 'utf8');
  const transcript = readFileSync(new URL('../../public/transcripts/special-circumstances-rebid-failure.ne.md', import.meta.url), 'utf8');
  assert.match(subtitles, /^WEBVTT/);
  assert.match(transcript, /synthetic voice-over/);
  assert.equal((transcript.match(/^## दृश्य/gm) ?? []).length, 7);
  const cues = subtitles.trim().split(/\r?\n\r?\n/).slice(1).map((block) => {
    const [timingLine, ...textLines] = block.split(/\r?\n/);
    assert.match(timingLine, /^\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}$/);
    return textLines.join(' ').replace(/\s+/g, ' ').trim();
  });
  assert.deepEqual(cues, lesson.scenes.flatMap((scene) => scene.subtitleCues ?? []));
  assert.doesNotMatch(cues.join(' '), /[\u0400-\u052f\u1800-\u18af\ufffd]/);

  const linkedCase = findLinkedSimulation(lesson, PRACTICAL_SIMULATION_CASES);
  assert.equal(linkedCase?.caseKey, 'special-circumstances-rebid-practice');
  assert.ok(linkedCase?.answerKey);
  assert.equal(linkedCase.content.steps.length, 4);
  assert.equal(linkedCase.content.steps.reduce((sum, step) => sum + step.points, 0), 100);
});

test('contract implementation lesson links synchronized media and a scored work-plan case', () => {
  const lesson = ANIMATED_LESSONS.find((item) => item.lessonId === 'contract-implementation-work-plan');
  assert.ok(lesson);
  assert.equal(lesson.scenes.length, 7);
  assert.equal(lesson.knowledgeCheck?.length, 4);
  assert.equal(lesson.publicationStatus, 'draft');
  assert.ok(lesson.legalReferences.every((reference) => /कानुनी समीक्षा आवश्यक/.test(reference.verificationNote)));
  assert.ok(statSync(new URL('../../public/videos/contract-implementation-work-plan.mp4', import.meta.url)).size > 1_000_000);
  assert.ok(statSync(new URL('../../public/audio/contract-implementation-work-plan.ne.mp3', import.meta.url)).size > 100_000);
  assert.ok(statSync(new URL('../../public/posters/contract-implementation-work-plan.svg', import.meta.url)).size > 100);

  const subtitles = readFileSync(new URL('../../public/subtitles/contract-implementation-work-plan.ne.vtt', import.meta.url), 'utf8');
  const transcript = readFileSync(new URL('../../public/transcripts/contract-implementation-work-plan.ne.md', import.meta.url), 'utf8');
  assert.match(subtitles, /^WEBVTT/);
  assert.match(transcript, /synthetic voice-over/);
  assert.equal((transcript.match(/^## दृश्य/gm) ?? []).length, 7);
  const cues = subtitles.trim().split(/\r?\n\r?\n/).slice(1).map((block) => {
    const [timingLine, ...textLines] = block.split(/\r?\n/);
    assert.match(timingLine, /^\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}$/);
    return textLines.join(' ').replace(/\s+/g, ' ').trim();
  });
  assert.deepEqual(cues, lesson.scenes.flatMap((scene) => scene.subtitleCues ?? []));
  assert.doesNotMatch(cues.join(' '), /[\u0400-\u052f\u1800-\u18af\ufffd]/);

  const linkedCase = findLinkedSimulation(lesson, PRACTICAL_SIMULATION_CASES);
  assert.equal(linkedCase?.caseKey, 'contract-implementation-work-plan-practice');
  assert.ok(linkedCase?.answerKey);
  assert.equal(linkedCase.content.steps.length, 4);
  assert.equal(linkedCase.content.steps.reduce((sum, step) => sum + step.points, 0), 100);
});

test('construction progress lesson links synchronized media and a scored measurement case', () => {
  const lesson = ANIMATED_LESSONS.find((item) => item.lessonId === 'construction-progress-quality-measurement');
  assert.ok(lesson);
  assert.equal(lesson.scenes.length, 7);
  assert.equal(lesson.knowledgeCheck?.length, 4);
  assert.equal(lesson.publicationStatus, 'draft');
  assert.ok(lesson.legalReferences.every((reference) => /कानुनी समीक्षा आवश्यक/.test(reference.verificationNote)));
  assert.ok(statSync(new URL('../../public/videos/construction-progress-quality-measurement.mp4', import.meta.url)).size > 1_000_000);
  assert.ok(statSync(new URL('../../public/audio/construction-progress-quality-measurement.ne.mp3', import.meta.url)).size > 100_000);
  assert.ok(statSync(new URL('../../public/posters/construction-progress-quality-measurement.svg', import.meta.url)).size > 100);

  const subtitles = readFileSync(new URL('../../public/subtitles/construction-progress-quality-measurement.ne.vtt', import.meta.url), 'utf8');
  const transcript = readFileSync(new URL('../../public/transcripts/construction-progress-quality-measurement.ne.md', import.meta.url), 'utf8');
  assert.match(subtitles, /^WEBVTT/);
  assert.match(transcript, /synthetic voice-over/);
  assert.equal((transcript.match(/^## दृश्य/gm) ?? []).length, 7);
  const cues = subtitles.trim().split(/\r?\n\r?\n/).slice(1).map((block) => {
    const [timingLine, ...textLines] = block.split(/\r?\n/);
    assert.match(timingLine, /^\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}$/);
    return textLines.join(' ').replace(/\s+/g, ' ').trim();
  });
  assert.deepEqual(cues, lesson.scenes.flatMap((scene) => scene.subtitleCues ?? []));
  assert.doesNotMatch(cues.join(' '), /[\u0400-\u052f\u1800-\u18af\ufffd]/);

  const linkedCase = findLinkedSimulation(lesson, PRACTICAL_SIMULATION_CASES);
  assert.equal(linkedCase?.caseKey, 'construction-progress-quality-measurement-practice');
  assert.ok(linkedCase?.answerKey);
  assert.equal(linkedCase.content.steps.length, 4);
  assert.equal(linkedCase.content.steps.reduce((sum, step) => sum + step.points, 0), 100);
});

test('goods receipt lesson links synchronized media and a scored handover case', () => {
  const lesson = ANIMATED_LESSONS.find((item) => item.lessonId === 'goods-receipt-inspection-handover');
  assert.ok(lesson);
  assert.equal(lesson.scenes.length, 7);
  assert.equal(lesson.knowledgeCheck?.length, 4);
  assert.equal(lesson.publicationStatus, 'draft');
  assert.ok(lesson.legalReferences.every((reference) => /कानुनी समीक्षा आवश्यक/.test(reference.verificationNote)));
  assert.ok(statSync(new URL('../../public/videos/goods-receipt-inspection-handover.mp4', import.meta.url)).size > 1_000_000);
  assert.ok(statSync(new URL('../../public/audio/goods-receipt-inspection-handover.ne.mp3', import.meta.url)).size > 100_000);
  assert.ok(statSync(new URL('../../public/posters/goods-receipt-inspection-handover.svg', import.meta.url)).size > 100);

  const subtitles = readFileSync(new URL('../../public/subtitles/goods-receipt-inspection-handover.ne.vtt', import.meta.url), 'utf8');
  const transcript = readFileSync(new URL('../../public/transcripts/goods-receipt-inspection-handover.ne.md', import.meta.url), 'utf8');
  assert.match(subtitles, /^WEBVTT/);
  assert.match(transcript, /synthetic voice-over/);
  assert.equal((transcript.match(/^## दृश्य/gm) ?? []).length, 7);
  const cues = subtitles.trim().split(/\r?\n\r?\n/).slice(1).map((block) => {
    const [timingLine, ...textLines] = block.split(/\r?\n/);
    assert.match(timingLine, /^\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}$/);
    return textLines.join(' ').replace(/\s+/g, ' ').trim();
  });
  assert.deepEqual(cues, lesson.scenes.flatMap((scene) => scene.subtitleCues ?? []));
  assert.doesNotMatch(cues.join(' '), /[\u0400-\u052f\u1800-\u18af\ufffd]/);

  const linkedCase = findLinkedSimulation(lesson, PRACTICAL_SIMULATION_CASES);
  assert.equal(linkedCase?.caseKey, 'goods-receipt-inspection-handover-practice');
  assert.ok(linkedCase?.answerKey);
  assert.equal(linkedCase.content.steps.length, 4);
  assert.equal(linkedCase.content.steps.reduce((sum, step) => sum + step.points, 0), 100);
});

test('running-bill lesson links synchronized media and a scored payment case', () => {
  const lesson = ANIMATED_LESSONS.find((item) => item.lessonId === 'bills-running-bills-and-payments');
  assert.ok(lesson);
  assert.equal(lesson.scenes.length, 7);
  assert.equal(lesson.knowledgeCheck?.length, 4);
  assert.equal(lesson.publicationStatus, 'draft');
  assert.ok(lesson.legalReferences.every((reference) => /कानुनी समीक्षा आवश्यक/.test(reference.verificationNote)));
  assert.ok(statSync(new URL('../../public/videos/bills-running-bills-and-payments.mp4', import.meta.url)).size > 1_000_000);
  assert.ok(statSync(new URL('../../public/audio/bills-running-bills-and-payments.ne.mp3', import.meta.url)).size > 100_000);
  assert.ok(statSync(new URL('../../public/posters/bills-running-bills-and-payments.svg', import.meta.url)).size > 100);

  const subtitles = readFileSync(new URL('../../public/subtitles/bills-running-bills-and-payments.ne.vtt', import.meta.url), 'utf8');
  const transcript = readFileSync(new URL('../../public/transcripts/bills-running-bills-and-payments.ne.md', import.meta.url), 'utf8');
  assert.match(subtitles, /^WEBVTT/);
  assert.match(transcript, /synthetic voice-over/);
  assert.equal((transcript.match(/^## दृश्य/gm) ?? []).length, 7);
  const cues = subtitles.trim().split(/\r?\n\r?\n/).slice(1).map((block) => {
    const [timingLine, ...textLines] = block.split(/\r?\n/);
    assert.match(timingLine, /^\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}$/);
    return textLines.join(' ').replace(/\s+/g, ' ').trim();
  });
  assert.deepEqual(cues, lesson.scenes.flatMap((scene) => scene.subtitleCues ?? []));
  assert.doesNotMatch(cues.join(' '), /[\u0400-\u052f\u1800-\u18af\ufffd]/);

  const linkedCase = findLinkedSimulation(lesson, PRACTICAL_SIMULATION_CASES);
  assert.equal(linkedCase?.caseKey, 'running-bill-payment-document-practice');
  assert.ok(linkedCase?.answerKey);
  assert.equal(linkedCase.content.steps.length, 4);
  assert.equal(linkedCase.content.steps.reduce((sum, step) => sum + step.points, 0), 100);
});

test('EOT variation adjustment lesson links synchronized media and a scored change case', () => {
  const lesson = ANIMATED_LESSONS.find((item) => item.lessonId === 'eot-variation-price-adjustment');
  assert.ok(lesson);
  assert.equal(lesson.scenes.length, 7);
  assert.equal(lesson.knowledgeCheck?.length, 4);
  assert.equal(lesson.publicationStatus, 'draft');
  assert.ok(lesson.legalReferences.every((reference) => /कानुनी समीक्षा आवश्यक/.test(reference.verificationNote)));
  assert.ok(statSync(new URL('../../public/videos/eot-variation-price-adjustment.mp4', import.meta.url)).size > 1_000_000);
  assert.ok(statSync(new URL('../../public/audio/eot-variation-price-adjustment.ne.mp3', import.meta.url)).size > 100_000);
  assert.ok(statSync(new URL('../../public/posters/eot-variation-price-adjustment.svg', import.meta.url)).size > 100);

  const subtitles = readFileSync(new URL('../../public/subtitles/eot-variation-price-adjustment.ne.vtt', import.meta.url), 'utf8');
  const transcript = readFileSync(new URL('../../public/transcripts/eot-variation-price-adjustment.ne.md', import.meta.url), 'utf8');
  assert.match(subtitles, /^WEBVTT/);
  assert.match(transcript, /synthetic voice-over/);
  assert.equal((transcript.match(/^## दृश्य/gm) ?? []).length, 7);
  const cues = subtitles.trim().split(/\r?\n\r?\n/).slice(1).map((block) => {
    const [timingLine, ...textLines] = block.split(/\r?\n/);
    assert.match(timingLine, /^\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}$/);
    return textLines.join(' ').replace(/\s+/g, ' ').trim();
  });
  assert.deepEqual(cues, lesson.scenes.flatMap((scene) => scene.subtitleCues ?? []));
  assert.doesNotMatch(cues.join(' '), /[\u0400-\u052f\u1800-\u18af\ufffd]/);

  const linkedCase = findLinkedSimulation(lesson, PRACTICAL_SIMULATION_CASES);
  assert.equal(linkedCase?.caseKey, 'eot-variation-price-adjustment-practice');
  assert.ok(linkedCase?.answerKey);
  assert.equal(linkedCase.content.steps.length, 4);
  assert.equal(linkedCase.content.steps.reduce((sum, step) => sum + step.points, 0), 100);
});

test('contract amendment and termination lesson links synchronized media and the existing termination case', () => {
  const lesson = ANIMATED_LESSONS.find((item) => item.lessonId === 'contract-amendment-breach-termination');
  assert.ok(lesson);
  assert.equal(lesson.scenes.length, 7);
  assert.equal(lesson.knowledgeCheck?.length, 4);
  assert.equal(lesson.publicationStatus, 'draft');
  assert.ok(lesson.legalReferences.every((reference) => /कानुनी समीक्षा आवश्यक/.test(reference.verificationNote)));
  assert.ok(statSync(new URL('../../public/videos/contract-amendment-breach-termination.mp4', import.meta.url)).size > 1_000_000);
  assert.ok(statSync(new URL('../../public/audio/contract-amendment-breach-termination.ne.mp3', import.meta.url)).size > 100_000);
  assert.ok(statSync(new URL('../../public/posters/contract-amendment-breach-termination.svg', import.meta.url)).size > 100);

  const subtitles = readFileSync(new URL('../../public/subtitles/contract-amendment-breach-termination.ne.vtt', import.meta.url), 'utf8');
  const transcript = readFileSync(new URL('../../public/transcripts/contract-amendment-breach-termination.ne.md', import.meta.url), 'utf8');
  assert.match(subtitles, /^WEBVTT/);
  assert.match(transcript, /synthetic voice-over/);
  assert.equal((transcript.match(/^## दृश्य/gm) ?? []).length, 7);
  const cues = subtitles.trim().split(/\r?\n\r?\n/).slice(1).map((block) => {
    const [timingLine, ...textLines] = block.split(/\r?\n/);
    assert.match(timingLine, /^\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}$/);
    return textLines.join(' ').replace(/\s+/g, ' ').trim();
  });
  assert.deepEqual(cues, lesson.scenes.flatMap((scene) => scene.subtitleCues ?? []));
  assert.doesNotMatch(cues.join(' '), /[\u0400-\u052f\u1800-\u18af\ufffd]/);

  const linkedCase = findLinkedSimulation(lesson, PRACTICAL_SIMULATION_CASES);
  assert.equal(linkedCase?.caseKey, 'contract-termination-and-reprocurement');
  assert.equal(linkedCase?.content.steps.length, 4);
});

test('performance evaluation lesson links synchronized media and a scored closeout case', () => {
  const lesson = ANIMATED_LESSONS.find((item) => item.lessonId === 'contract-performance-evaluation-learning');
  assert.ok(lesson);
  assert.equal(lesson.scenes.length, 7);
  assert.equal(lesson.knowledgeCheck?.length, 4);
  assert.equal(lesson.publicationStatus, 'draft');
  assert.ok(lesson.legalReferences.every((reference) => /कानुनी समीक्षा आवश्यक/.test(reference.verificationNote)));
  assert.ok(statSync(new URL('../../public/videos/contract-performance-evaluation-learning.mp4', import.meta.url)).size > 1_000_000);
  assert.ok(statSync(new URL('../../public/audio/contract-performance-evaluation-learning.ne.mp3', import.meta.url)).size > 100_000);
  assert.ok(statSync(new URL('../../public/posters/contract-performance-evaluation-learning.svg', import.meta.url)).size > 100);

  const subtitles = readFileSync(new URL('../../public/subtitles/contract-performance-evaluation-learning.ne.vtt', import.meta.url), 'utf8');
  const transcript = readFileSync(new URL('../../public/transcripts/contract-performance-evaluation-learning.ne.md', import.meta.url), 'utf8');
  assert.match(subtitles, /^WEBVTT/);
  assert.match(transcript, /synthetic voice-over/);
  assert.equal((transcript.match(/^## दृश्य/gm) ?? []).length, 7);
  const cues = subtitles.trim().split(/\r?\n\r?\n/).slice(1).map((block) => {
    const [timingLine, ...textLines] = block.split(/\r?\n/);
    assert.match(timingLine, /^\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}$/);
    return textLines.join(' ').replace(/\s+/g, ' ').trim();
  });
  assert.deepEqual(cues, lesson.scenes.flatMap((scene) => scene.subtitleCues ?? []));
  assert.doesNotMatch(cues.join(' '), /[\u0400-\u052f\u1800-\u18af\ufffd]/);

  const linkedCase = findLinkedSimulation(lesson, PRACTICAL_SIMULATION_CASES);
  assert.equal(linkedCase?.caseKey, 'contract-performance-evaluation-practice');
  assert.ok(linkedCase?.answerKey);
  assert.equal(linkedCase.content.steps.length, 4);
  assert.equal(linkedCase.content.steps.reduce((sum, step) => sum + step.points, 0), 100);
});

test('irregularity red-flags lesson links synchronized media and a scored evidence case', () => {
  const lesson = ANIMATED_LESSONS.find((item) => item.lessonId === 'irregularity-red-flags');
  assert.ok(lesson);
  assert.equal(lesson.scenes.length, 7);
  assert.equal(lesson.knowledgeCheck?.length, 4);
  assert.equal(lesson.publicationStatus, 'draft');
  assert.ok(lesson.legalReferences.every((reference) => /कानुनी समीक्षा आवश्यक/.test(reference.verificationNote)));
  assert.ok(statSync(new URL('../../public/videos/irregularity-red-flags.mp4', import.meta.url)).size > 1_000_000);
  assert.ok(statSync(new URL('../../public/audio/irregularity-red-flags.ne.mp3', import.meta.url)).size > 100_000);
  assert.ok(statSync(new URL('../../public/posters/irregularity-red-flags.svg', import.meta.url)).size > 100);

  const subtitles = readFileSync(new URL('../../public/subtitles/irregularity-red-flags.ne.vtt', import.meta.url), 'utf8');
  const transcript = readFileSync(new URL('../../public/transcripts/irregularity-red-flags.ne.md', import.meta.url), 'utf8');
  assert.match(subtitles, /^WEBVTT/);
  assert.match(transcript, /synthetic voice-over/);
  assert.equal((transcript.match(/^## दृश्य/gm) ?? []).length, 7);
  const cues = subtitles.trim().split(/\r?\n\r?\n/).slice(1).map((block) => {
    const [timingLine, ...textLines] = block.split(/\r?\n/);
    assert.match(timingLine, /^\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}$/);
    return textLines.join(' ').replace(/\s+/g, ' ').trim();
  });
  assert.deepEqual(cues, lesson.scenes.flatMap((scene) => scene.subtitleCues ?? []));
  assert.doesNotMatch(cues.join(' '), /[\u0400-\u052f\u1800-\u18af\ufffd]/);

  const linkedCase = findLinkedSimulation(lesson, PRACTICAL_SIMULATION_CASES);
  assert.equal(linkedCase?.caseKey, 'irregularity-red-flags-practice');
  assert.ok(linkedCase?.answerKey);
  assert.equal(linkedCase.content.steps.length, 4);
  assert.equal(linkedCase.content.steps.reduce((sum, step) => sum + step.points, 0), 100);
});

test('collusion conflict lesson links synchronized media and a scored integrity case', () => {
  const lesson = ANIMATED_LESSONS.find((item) => item.lessonId === 'collusion-restricted-terms-conflict');
  assert.ok(lesson);
  assert.equal(lesson.scenes.length, 7);
  assert.equal(lesson.knowledgeCheck?.length, 4);
  assert.equal(lesson.publicationStatus, 'draft');
  assert.ok(lesson.legalReferences.every((reference) => /कानुनी समीक्षा आवश्यक/.test(reference.verificationNote)));
  assert.ok(statSync(new URL('../../public/videos/collusion-restricted-terms-conflict.mp4', import.meta.url)).size > 1_000_000);
  assert.ok(statSync(new URL('../../public/audio/collusion-restricted-terms-conflict.ne.mp3', import.meta.url)).size > 100_000);
  assert.ok(statSync(new URL('../../public/posters/collusion-restricted-terms-conflict.svg', import.meta.url)).size > 100);

  const subtitles = readFileSync(new URL('../../public/subtitles/collusion-restricted-terms-conflict.ne.vtt', import.meta.url), 'utf8');
  const transcript = readFileSync(new URL('../../public/transcripts/collusion-restricted-terms-conflict.ne.md', import.meta.url), 'utf8');
  assert.match(subtitles, /^WEBVTT/);
  assert.match(transcript, /synthetic voice-over/);
  assert.equal((transcript.match(/^## दृश्य/gm) ?? []).length, 7);
  const cues = subtitles.trim().split(/\r?\n\r?\n/).slice(1).map((block) => {
    const [timingLine, ...textLines] = block.split(/\r?\n/);
    assert.match(timingLine, /^\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}$/);
    return textLines.join(' ').replace(/\s+/g, ' ').trim();
  });
  assert.deepEqual(cues, lesson.scenes.flatMap((scene) => scene.subtitleCues ?? []));
  assert.doesNotMatch(cues.join(' '), /[\u0400-\u052f\u1800-\u18af\ufffd]/);

  const linkedCase = findLinkedSimulation(lesson, PRACTICAL_SIMULATION_CASES);
  assert.equal(linkedCase?.caseKey, 'collusion-restricted-terms-conflict-practice');
  assert.ok(linkedCase?.answerKey);
  assert.equal(linkedCase.content.steps.length, 4);
  assert.equal(linkedCase.content.steps.reduce((sum, step) => sum + step.points, 0), 100);
});

test('complaint review lesson links synchronized media and a scored dispute case', () => {
  const lesson = ANIMATED_LESSONS.find((item) => item.lessonId === 'complaint-review-dispute-resolution');
  assert.ok(lesson);
  assert.equal(lesson.scenes.length, 7);
  assert.equal(lesson.knowledgeCheck?.length, 4);
  assert.equal(lesson.publicationStatus, 'draft');
  assert.ok(lesson.legalReferences.every((reference) => /कानुनी समीक्षा आवश्यक/.test(reference.verificationNote)));
  assert.ok(statSync(new URL('../../public/videos/complaint-review-dispute-resolution.mp4', import.meta.url)).size > 1_000_000);
  assert.ok(statSync(new URL('../../public/audio/complaint-review-dispute-resolution.ne.mp3', import.meta.url)).size > 100_000);
  assert.ok(statSync(new URL('../../public/posters/complaint-review-dispute-resolution.svg', import.meta.url)).size > 100);

  const subtitles = readFileSync(new URL('../../public/subtitles/complaint-review-dispute-resolution.ne.vtt', import.meta.url), 'utf8');
  const transcript = readFileSync(new URL('../../public/transcripts/complaint-review-dispute-resolution.ne.md', import.meta.url), 'utf8');
  assert.match(subtitles, /^WEBVTT/);
  assert.match(transcript, /synthetic voice-over/);
  assert.equal((transcript.match(/^## दृश्य/gm) ?? []).length, 7);
  const cues = subtitles.trim().split(/\r?\n\r?\n/).slice(1).map((block) => {
    const [timingLine, ...textLines] = block.split(/\r?\n/);
    assert.match(timingLine, /^\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}$/);
    return textLines.join(' ').replace(/\s+/g, ' ').trim();
  });
  assert.deepEqual(cues, lesson.scenes.flatMap((scene) => scene.subtitleCues ?? []));
  assert.doesNotMatch(cues.join(' '), /[\u0400-\u052f\u1800-\u18af\ufffd]/);

  const linkedCase = findLinkedSimulation(lesson, PRACTICAL_SIMULATION_CASES);
  assert.equal(linkedCase?.caseKey, 'complaint-review-dispute-resolution-practice');
  assert.ok(linkedCase?.answerKey);
  assert.equal(linkedCase.content.steps.length, 4);
  assert.equal(linkedCase.content.steps.reduce((sum, step) => sum + step.points, 0), 100);
});

test('procurement record management lesson links synchronized media and a scored audit case', () => {
  const lesson = ANIMATED_LESSONS.find((item) => item.lessonId === 'procurement-record-management-audit');
  assert.ok(lesson);
  assert.equal(lesson.scenes.length, 7);
  assert.equal(lesson.knowledgeCheck?.length, 4);
  assert.equal(lesson.publicationStatus, 'draft');
  assert.ok(lesson.legalReferences.every((reference) => /कानुनी समीक्षा आवश्यक/.test(reference.verificationNote)));
  assert.ok(statSync(new URL('../../public/videos/procurement-record-management-audit.mp4', import.meta.url)).size > 1_000_000);
  assert.ok(statSync(new URL('../../public/audio/procurement-record-management-audit.ne.mp3', import.meta.url)).size > 100_000);
  assert.ok(statSync(new URL('../../public/posters/procurement-record-management-audit.svg', import.meta.url)).size > 100);

  const subtitles = readFileSync(new URL('../../public/subtitles/procurement-record-management-audit.ne.vtt', import.meta.url), 'utf8');
  const transcript = readFileSync(new URL('../../public/transcripts/procurement-record-management-audit.ne.md', import.meta.url), 'utf8');
  assert.match(subtitles, /^WEBVTT/);
  assert.match(transcript, /synthetic voice-over/);
  assert.equal((transcript.match(/^## दृश्य/gm) ?? []).length, 7);
  const cues = subtitles.trim().split(/\r?\n\r?\n/).slice(1).map((block) => {
    const [timingLine, ...textLines] = block.split(/\r?\n/);
    assert.match(timingLine, /^\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}$/);
    return textLines.join(' ').replace(/\s+/g, ' ').trim();
  });
  assert.deepEqual(cues, lesson.scenes.flatMap((scene) => scene.subtitleCues ?? []));
  assert.doesNotMatch(cues.join(' '), /[\u0400-\u052f\u1800-\u18af\ufffd]/);

  const linkedCase = findLinkedSimulation(lesson, PRACTICAL_SIMULATION_CASES);
  assert.equal(linkedCase?.caseKey, 'procurement-record-audit-readiness-practice');
  assert.ok(linkedCase?.answerKey);
  assert.equal(linkedCase.content.steps.length, 4);
  assert.equal(linkedCase.content.steps.reduce((sum, step) => sum + step.points, 0), 100);
});

test('transparency ethics lesson links synchronized media and a scored integrity case', () => {
  const lesson = ANIMATED_LESSONS.find((item) => item.lessonId === 'transparency-accountability-ethics');
  assert.ok(lesson);
  assert.equal(lesson.scenes.length, 7);
  assert.equal(lesson.knowledgeCheck?.length, 4);
  assert.equal(lesson.publicationStatus, 'draft');
  assert.ok(lesson.legalReferences.every((reference) => /कानुनी समीक्षा आवश्यक/.test(reference.verificationNote)));
  assert.ok(statSync(new URL('../../public/videos/transparency-accountability-ethics.mp4', import.meta.url)).size > 1_000_000);
  assert.ok(statSync(new URL('../../public/audio/transparency-accountability-ethics.ne.mp3', import.meta.url)).size > 100_000);
  assert.ok(statSync(new URL('../../public/posters/transparency-accountability-ethics.svg', import.meta.url)).size > 100);

  const subtitles = readFileSync(new URL('../../public/subtitles/transparency-accountability-ethics.ne.vtt', import.meta.url), 'utf8');
  const transcript = readFileSync(new URL('../../public/transcripts/transparency-accountability-ethics.ne.md', import.meta.url), 'utf8');
  assert.match(subtitles, /^WEBVTT/);
  assert.match(transcript, /synthetic voice-over/);
  assert.equal((transcript.match(/^## दृश्य/gm) ?? []).length, 7);
  const cues = subtitles.trim().split(/\r?\n\r?\n/).slice(1).map((block) => {
    const [timingLine, ...textLines] = block.split(/\r?\n/);
    assert.match(timingLine, /^\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}$/);
    return textLines.join(' ').replace(/\s+/g, ' ').trim();
  });
  assert.deepEqual(cues, lesson.scenes.flatMap((scene) => scene.subtitleCues ?? []));
  assert.doesNotMatch(cues.join(' '), /[\u0400-\u052f\u1800-\u18af\ufffd]/);

  const linkedCase = findLinkedSimulation(lesson, PRACTICAL_SIMULATION_CASES);
  assert.equal(linkedCase?.caseKey, 'transparency-accountability-ethics-practice');
  assert.ok(linkedCase?.answerKey);
  assert.equal(linkedCase.content.steps.length, 4);
  assert.equal(linkedCase.content.steps.reduce((sum, step) => sum + step.points, 0), 100);
});

test('lesson scene narration, objectives and legal review status are present', () => {
  for (const lesson of ANIMATED_LESSONS) {
    assert.ok(lesson.learningObjectives.length > 0);
    assert.ok(lesson.keyPoints.length > 0);
    assert.ok(lesson.scenes.every((scene) => scene.narration && scene.takeaway));
    assert.ok(lesson.legalReferences.every((reference) => reference.officialUrl && reference.verificationNote));
  }
});

test('every registered lesson has complete media, subtitles, transcript and a 100-point simulation', () => {
  assert.equal(ANIMATED_LESSONS.length, 30);

  for (const lesson of ANIMATED_LESSONS) {
    assert.equal(lesson.scenes.length, 7, lesson.lessonId);
    const knowledgeCheckCount = lesson.knowledgeCheck?.length ?? 0;
    assert.ok(
      knowledgeCheckCount >= 3 && knowledgeCheckCount <= 5,
      `${lesson.lessonId}: knowledge check count ${knowledgeCheckCount}`,
    );
    assert.ok(lesson.videoAvailable, lesson.lessonId);
    assert.ok(lesson.voiceOverAvailable, lesson.lessonId);
    assert.doesNotMatch([
      lesson.title,
      lesson.description,
      lesson.fictionalExample ?? '',
      ...lesson.learningObjectives,
      ...lesson.keyPoints,
      ...lesson.scenes.flatMap((scene) => [
        scene.title,
        scene.narration,
        scene.takeaway,
        ...(scene.subtitleCues ?? []),
      ]),
    ].join(' '), /[\u0400-\u052f\u1800-\u18af\ufffd]/, lesson.lessonId);

    const poster = statSync(new URL(`../../public${lesson.posterPath}`, import.meta.url));
    const video = statSync(new URL(`../../public${lesson.videoPath}`, import.meta.url));
    const audio = statSync(new URL(`../../public${lesson.voiceOverPath}`, import.meta.url));
    const subtitles = statSync(new URL(`../../public${lesson.subtitlePath}`, import.meta.url));
    const transcript = statSync(new URL(`../../public${lesson.transcriptPath}`, import.meta.url));
    assert.ok(poster.size > 100, lesson.posterPath);
    assert.ok(video.size > 1_000_000, lesson.videoPath);
    assert.ok(audio.size > 100_000, lesson.voiceOverPath);
    assert.ok(subtitles.size > 100, lesson.subtitlePath);
    assert.ok(transcript.size > 100, lesson.transcriptPath);

    const linkedCase = findLinkedSimulation(lesson, PRACTICAL_SIMULATION_CASES);
    assert.ok(linkedCase, `${lesson.lessonId}: ${lesson.linkedSimulationId}`);
    assert.ok(linkedCase.answerKey, lesson.linkedSimulationId);
    assert.ok(
      linkedCase.content.steps.length >= 3 && linkedCase.content.steps.length <= 4,
      `${lesson.linkedSimulationId}: step count ${linkedCase.content.steps.length}`,
    );
    assert.equal(
      linkedCase.content.steps.reduce((sum, step) => sum + step.points, 0),
      100,
      lesson.linkedSimulationId,
    );
  }
});

test('Nepali transcript and WebVTT cover all seven scenes with ordered timed cues', () => {
  const transcript = readFileSync(new URL('../../public/transcripts/annual-procurement-plan.ne.md', import.meta.url), 'utf8');
  const subtitles = readFileSync(new URL('../../public/subtitles/annual-procurement-plan.ne.vtt', import.meta.url), 'utf8');
  assert.equal((transcript.match(/^## दृश्य/gm) ?? []).length, 7);
  assert.match(subtitles, /^WEBVTT/);
  const cues = [...subtitles.matchAll(/^(\d{2}:\d{2}:\d{2}\.\d{3}) --> (\d{2}:\d{2}:\d{2}\.\d{3})$/gm)];
  assert.ok(cues.length >= 7);
  const toMilliseconds = (time: string) => {
    const [hours, minutes, seconds] = time.split(':');
    const [wholeSeconds, milliseconds] = seconds.split('.');
    return Number(hours) * 3_600_000 + Number(minutes) * 60_000
      + Number(wholeSeconds) * 1000 + Number(milliseconds);
  };
  for (let index = 0; index < cues.length; index += 1) {
    const start = toMilliseconds(cues[index][1]);
    const end = toMilliseconds(cues[index][2]);
    assert.ok(end > start);
    if (index > 0) assert.ok(start >= toMilliseconds(cues[index - 1][2]));
  }
});
