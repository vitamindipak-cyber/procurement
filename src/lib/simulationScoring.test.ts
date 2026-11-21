import assert from 'node:assert/strict';
import test from 'node:test';
import {
  PRACTICAL_SIMULATION_CASES,
  SIMULATION_LEGAL_REFERENCES,
} from '../data/practicalSimulationCases';
import {
  calculateBoqTotals,
  calculateSimulationResult,
  classifySimulationScore,
} from './simulationScoring';

test('starter and additional cases have unique keys and a complete 100-point rubric', () => {
  assert.ok(PRACTICAL_SIMULATION_CASES.length >= 25);
  assert.equal(
    new Set(PRACTICAL_SIMULATION_CASES.map((simulationCase) => simulationCase.caseKey)).size,
    PRACTICAL_SIMULATION_CASES.length,
    'case keys must be unique',
  );

  for (const simulationCase of PRACTICAL_SIMULATION_CASES) {
    assert.equal(
      simulationCase.content.steps.reduce((total, step) => total + step.points, 0),
      100,
      `${simulationCase.caseKey} must have a 100-point rubric`,
    );
    assert.deepEqual(
      new Set(simulationCase.content.steps.map((step) => step.criterion)),
      new Set(['decision', 'legal-basis', 'process', 'reasoning']),
    );
    assert.ok(simulationCase.answerKey, `${simulationCase.caseKey} must have an answer key`);
    assert.deepEqual(
      new Set(Object.keys(simulationCase.answerKey)),
      new Set(simulationCase.content.steps.map((step) => step.id)),
      `${simulationCase.caseKey} must define an answer for every step`,
    );
  }
});

test('case citations resolve to the local legal reference catalogue', () => {
  const referenceIds = new Set(SIMULATION_LEGAL_REFERENCES.map((reference) => reference.id));
  for (const simulationCase of PRACTICAL_SIMULATION_CASES) {
    const referencedIds = [
      ...simulationCase.content.legalReferenceIds,
      ...simulationCase.content.steps.flatMap((step) => step.legalReferenceIds),
    ];
    assert.ok(
      referencedIds.every((id) => referenceIds.has(id)),
      `${simulationCase.caseKey} contains an unknown legal reference`,
    );
  }
});

test('choice scoring awards partial credit and applies the 70-point pass threshold', () => {
  const simulationCase = PRACTICAL_SIMULATION_CASES[0];
  const result = calculateSimulationResult(simulationCase, {
    'plan-action': 'approve-plan',
    'plan-law': 'rule-8',
    'plan-fields': 'partial-fields',
    'plan-risk': 'avoid-fragmentation',
  });

  assert.equal(result.score, 90);
  assert.equal(result.passed, true);
  assert.equal(result.breakdown.find((row) => row.stepId === 'plan-fields')?.pointsEarned, 10);
  assert.equal(classifySimulationScore(70), 'उत्तीर्ण');
  assert.equal(classifySimulationScore(69), 'थप अभ्यास आवश्यक');
});

test('BOQ math uses integer paisa and applies half-up basis-point rounding', () => {
  const totals = calculateBoqTotals([
    { description: 'वस्तु A', quantity: 12, unitPricePaisa: 125000 },
    { description: 'वस्तु B', quantity: 3, unitPricePaisa: 480000 },
  ], 60000, 1300);

  assert.equal(totals.subtotalPaisa, 2940000);
  assert.equal(totals.taxPaisa, 390000);
  assert.equal(totals.grandTotalPaisa, 3390000);
});

test('BOQ math rejects invalid and unsafe amounts rather than returning a partial total', () => {
  assert.throws(
    () => calculateBoqTotals([{ description: 'वस्तु', quantity: -1, unitPricePaisa: 100 }], 0, 1300),
    /गैर-ऋणात्मक सुरक्षित पूर्णांक/,
  );
  assert.throws(
    () => calculateBoqTotals([{ description: 'वस्तु', quantity: 1, unitPricePaisa: 100 }], 0, -1),
    /सुरक्षित पूर्णांक/,
  );
});

test('numeric case scoring does not treat an empty response as zero', () => {
  const simulationCase = PRACTICAL_SIMULATION_CASES.find((item) => item.caseKey === 'boq-cost-estimate');
  assert.ok(simulationCase);

  const result = calculateSimulationResult(simulationCase, { 'boq-grand-total': '' });
  assert.equal(result.breakdown[0].pointsEarned, 0);
});
