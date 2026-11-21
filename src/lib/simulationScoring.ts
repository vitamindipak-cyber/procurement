import {
  SimulationAttempt,
  SimulationCaseVersion,
  SimulationResult,
  SimulationScoreRow,
} from '../types/simulation';

export const PASSING_SCORE = 70;

export const classifySimulationScore = (score: number): string => {
  if (score >= 90) return 'उत्कृष्ट';
  if (score >= 80) return 'धेरै राम्रो';
  if (score >= PASSING_SCORE) return 'उत्तीर्ण';
  if (score >= 50) return 'थप अभ्यास आवश्यक';
  return 'पुनः अभ्यास आवश्यक';
};

const formatExpectedAnswer = (
  simulationCase: SimulationCaseVersion,
  stepId: string,
): string => {
  const key = simulationCase.answerKey?.[stepId];
  if (!key) return 'मूल्याङ्कन विवरण उपलब्ध छैन।';

  if (key.type === 'number') {
    return `${key.expectedValue.toLocaleString('ne-NP')} ${simulationCase.content.steps.find((step) => step.id === stepId)?.numberUnit ?? ''}`.trim();
  }

  const option = simulationCase.content.steps
    .find((step) => step.id === stepId)
    ?.options?.find((item) => item.id === key.correctOptionId);
  return option?.label ?? key.correctOptionId;
};

export const calculateSimulationResult = (
  simulationCase: SimulationCaseVersion,
  answers: SimulationAttempt['answers'],
  completedAt = new Date().toISOString(),
): SimulationResult => {
  if (!simulationCase.answerKey) {
    throw new Error('यो केसको उत्तर-सूची उपलब्ध छैन; server-side मूल्याङ्कन आवश्यक छ।');
  }

  const breakdown: SimulationScoreRow[] = simulationCase.content.steps.map((step) => {
    const key = simulationCase.answerKey?.[step.id];
    if (!key) {
      throw new Error(`प्रश्न ${step.id} का लागि मूल्याङ्कन नियम उपलब्ध छैन।`);
    }

    const answer = answers[step.id];
    let percentage = 0;
    let isCorrect = false;

    if (key.type === 'single-choice' && typeof answer === 'string') {
      percentage = key.optionScores[answer] ?? 0;
      isCorrect = answer === key.correctOptionId;
    } else if (key.type === 'number' && (typeof answer === 'number' || typeof answer === 'string')) {
      const enteredNumber = typeof answer === 'number'
        ? answer
        : answer.trim() === '' ? Number.NaN : Number(answer.trim());
      if (Number.isFinite(enteredNumber)) {
        isCorrect = Math.abs(enteredNumber - key.expectedValue) <= key.tolerance;
        percentage = isCorrect ? 100 : 0;
      }
    }

    const pointsEarned = Math.round((step.points * percentage) / 100);
    return {
      stepId: step.id,
      pointsEarned,
      pointsAvailable: step.points,
      isCorrect,
      explanation: key.explanation,
      correctAnswer: formatExpectedAnswer(simulationCase, step.id),
    };
  });

  const score = breakdown.reduce((total, row) => total + row.pointsEarned, 0);
  return {
    score,
    passed: score >= PASSING_SCORE,
    breakdown,
    completedAt,
  };
};

export interface BoqLine {
  description: string;
  quantity: number;
  unitPricePaisa: number;
}

export interface BoqTotals {
  lines: Array<{ description: string; amountPaisa: number }>;
  subtotalPaisa: number;
  otherCostsPaisa: number;
  taxPaisa: number;
  grandTotalPaisa: number;
}

const roundBasisPointAmount = (amountPaisa: number, basisPoints: number): number => {
  if (!Number.isSafeInteger(amountPaisa) || !Number.isSafeInteger(basisPoints) || basisPoints < 0) {
    throw new Error('BOQ रकम र प्रतिशत सुरक्षित पूर्णांक हुनुपर्छ।');
  }

  const amount = BigInt(amountPaisa);
  const rate = BigInt(basisPoints);
  return Number((amount * rate + 5000n) / 10000n);
};

export const calculateBoqTotals = (
  lines: BoqLine[],
  otherCostsPaisa: number,
  taxBasisPoints: number,
): BoqTotals => {
  if (!Number.isSafeInteger(otherCostsPaisa) || otherCostsPaisa < 0) {
    throw new Error('अन्य लागत शून्य वा सकारात्मक सुरक्षित पूर्णांक हुनुपर्छ।');
  }

  const calculatedLines = lines.map((line) => {
    if (!Number.isSafeInteger(line.quantity) || line.quantity < 0
      || !Number.isSafeInteger(line.unitPricePaisa) || line.unitPricePaisa < 0) {
      throw new Error(`${line.description}: परिमाण र एकाइ दर गैर-ऋणात्मक सुरक्षित पूर्णांक हुनुपर्छ।`);
    }
    const amountPaisa = line.quantity * line.unitPricePaisa;
    if (!Number.isSafeInteger(amountPaisa)) {
      throw new Error(`${line.description}: रकम सुरक्षित पूर्णांक सीमाभन्दा ठूलो छ।`);
    }
    return { description: line.description, amountPaisa };
  });

  const subtotalPaisa = calculatedLines.reduce((total, line) => total + line.amountPaisa, 0);
  if (!Number.isSafeInteger(subtotalPaisa)) {
    throw new Error('BOQ उप-जम्मा सुरक्षित पूर्णांक सीमाभन्दा ठूलो छ।');
  }
  const taxablePaisa = subtotalPaisa + otherCostsPaisa;
  if (!Number.isSafeInteger(taxablePaisa)) {
    throw new Error('करयोग्य रकम सुरक्षित पूर्णांक सीमाभन्दा ठूलो छ।');
  }

  const taxPaisa = roundBasisPointAmount(taxablePaisa, taxBasisPoints);
  const grandTotalPaisa = taxablePaisa + taxPaisa;
  if (!Number.isSafeInteger(grandTotalPaisa)) {
    throw new Error('BOQ कुल रकम सुरक्षित पूर्णांक सीमाभन्दा ठूलो छ।');
  }

  return {
    lines: calculatedLines,
    subtotalPaisa,
    otherCostsPaisa,
    taxPaisa,
    grandTotalPaisa,
  };
};
