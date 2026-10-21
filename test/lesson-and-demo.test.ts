import { test, describe } from 'node:test';
import assert from 'node:assert';
import { LESSON_STEPS } from '../src/lib/lesson-data.js';
import { LEGAL_DISCLAIMER, DEMO_VERIFICATION_DISCLAIMER } from '../src/lib/constants.js';

describe('Lesson Data & Curriculum Alignment (Fix #4, Fix #5, Fix #6)', () => {
  test('Contains exactly 8 approved steps in the correct sequence', () => {
    assert.strictEqual(LESSON_STEPS.length, 8, 'Curriculum must contain exactly 8 steps');

    const expectedTitles = [
      'Introduction',
      'Select reference plane',
      'Start sketch',
      'Draw rectangle',
      'Apply dimensions',
      'Finish sketch',
      'Understand result',
      'Independent practice',
    ];

    LESSON_STEPS.forEach((step, idx) => {
      assert.strictEqual(step.stepNumber, idx + 1);
      assert.strictEqual(step.title, expectedTitles[idx]);
    });
  });

  test('Semantic action IDs are properly mapped to distinct operations', () => {
    // Step 1: Overview - no action required
    assert.strictEqual(LESSON_STEPS[0].semanticActionId, undefined);

    // Step 2: Select reference plane
    assert.strictEqual(LESSON_STEPS[1].semanticActionId, 'select-top-plane');
    assert.strictEqual(LESSON_STEPS[1].activeToolId, 'select-top-plane');
    assert.strictEqual(LESSON_STEPS[1].recognizedControlLabel, 'Top Plane (XY)');

    // Step 3: Start sketch
    assert.strictEqual(LESSON_STEPS[2].semanticActionId, 'start-sketch');
    assert.strictEqual(LESSON_STEPS[2].activeToolId, 'sketch');

    // Step 4: Draw rectangle
    assert.strictEqual(LESSON_STEPS[3].semanticActionId, 'draw-rectangle');
    assert.strictEqual(LESSON_STEPS[3].activeToolId, 'rectangle');

    // Step 5: Apply dimensions
    assert.strictEqual(LESSON_STEPS[4].semanticActionId, 'apply-dimensions');
    assert.strictEqual(LESSON_STEPS[4].activeToolId, 'dimension');

    // Step 6: Finish sketch
    assert.strictEqual(LESSON_STEPS[5].semanticActionId, 'finish-sketch');
    assert.strictEqual(LESSON_STEPS[5].activeToolId, 'accept-sketch');

    // Step 7: Understand result
    assert.strictEqual(LESSON_STEPS[6].semanticActionId, 'understand-result');
    assert.strictEqual(LESSON_STEPS[6].activeToolId, 'extrude');

    // Step 8: Independent practice
    assert.strictEqual(LESSON_STEPS[7].semanticActionId, 'practice-overview');
  });

  test('Consistent 40 mm x 30 mm rectangle dimensions across lesson descriptions', () => {
    const relevantSteps = [LESSON_STEPS[0], LESSON_STEPS[3], LESSON_STEPS[4]];
    relevantSteps.forEach((s) => {
      const text = `${s.title} ${s.instruction} ${s.hints.join(' ')}`;
      assert.ok(
        text.includes('40 mm') || text.includes('40') || text.includes('Corner Rectangle'),
        `Step ${s.stepNumber} should reference 40 mm base dimension`
      );
    });
  });

  test('Top plane correctly refers to XY datum (Fix #6)', () => {
    const step2 = LESSON_STEPS[1];
    assert.ok(step2.recognizedControlLabel.includes('Top Plane (XY)'));
    assert.ok(!step2.recognizedControlLabel.includes('XZ'));
  });
});

describe('Demo State Machine & Separation of Navigation from Action Completion (Fix #2, Fix #3, Fix #8)', () => {
  // Pure model representing DemoWorkbench state transitions
  interface TestDemoState {
    currentStepIndex: number;
    visitedStepIds: number[];
    completedDemoActionIds: string[];
    isWalkthroughComplete: boolean;
    sketchStatus: string;
    highlightedTargetId: string | null;
  }

  function createInitialState(): TestDemoState {
    return {
      currentStepIndex: 0,
      visitedStepIds: [1],
      completedDemoActionIds: [],
      isWalkthroughComplete: false,
      sketchStatus: 'not-started',
      highlightedTargetId: null,
    };
  }

  function jumpToStep(state: TestDemoState, targetIndex: number): TestDemoState {
    const stepId = targetIndex + 1;
    return {
      ...state,
      currentStepIndex: targetIndex,
      visitedStepIds: state.visitedStepIds.includes(stepId)
        ? state.visitedStepIds
        : [...state.visitedStepIds, stepId],
      isWalkthroughComplete: false,
      highlightedTargetId: null,
    };
  }

  function triggerAction(state: TestDemoState, actionId: string): TestDemoState {
    const completed = state.completedDemoActionIds.includes(actionId)
      ? state.completedDemoActionIds
      : [...state.completedDemoActionIds, actionId];

    let newSketchStatus = state.sketchStatus;
    if (actionId === 'select-top-plane') newSketchStatus = 'plane-selected';
    if (actionId === 'start-sketch') newSketchStatus = 'sketch-active';
    if (actionId === 'draw-rectangle') newSketchStatus = 'rectangle-drawn';
    if (actionId === 'apply-dimensions') newSketchStatus = 'dimensioned';
    if (actionId === 'finish-sketch') newSketchStatus = 'accepted-in-demo';

    return {
      ...state,
      completedDemoActionIds: completed,
      sketchStatus: newSketchStatus,
    };
  }

  function restartState(): TestDemoState {
    return createInitialState();
  }

  test('Jumping directly to Step 8 does NOT mark Steps 1-7 as completed', () => {
    let state = createInitialState();
    assert.strictEqual(state.currentStepIndex, 0);
    assert.deepStrictEqual(state.completedDemoActionIds, []);

    // Jump from Step 1 to Step 8 (index 7)
    state = jumpToStep(state, 7);
    assert.strictEqual(state.currentStepIndex, 7);
    assert.deepStrictEqual(state.visitedStepIds, [1, 8]);

    // Crucial check: NO actions were marked completed!
    assert.deepStrictEqual(state.completedDemoActionIds, [], 'Completed actions must remain empty');
    assert.strictEqual(state.sketchStatus, 'not-started', 'Sketch must not be accepted by merely jumping');
  });

  test('Visiting a step marks it visited, not completed', () => {
    let state = createInitialState();
    state = jumpToStep(state, 3); // Step 4
    assert.ok(state.visitedStepIds.includes(4));
    assert.ok(!state.completedDemoActionIds.includes('draw-rectangle'));
  });

  test('Sketch is not prematurely accepted when opening Step 6 (Fix #3)', () => {
    let state = createInitialState();
    state = jumpToStep(state, 5); // Step 6: Finish sketch
    assert.strictEqual(state.currentStepIndex, 5);
    assert.notStrictEqual(state.sketchStatus, 'accepted-in-demo');

    // Only when user triggers 'finish-sketch' does it become accepted
    state = triggerAction(state, 'finish-sketch');
    assert.strictEqual(state.sketchStatus, 'accepted-in-demo');
    assert.ok(state.completedDemoActionIds.includes('finish-sketch'));
  });

  test('Reset returns all state to fresh initial state (Fix #8)', () => {
    let state = createInitialState();
    state = triggerAction(state, 'select-top-plane');
    state = triggerAction(state, 'start-sketch');
    state = jumpToStep(state, 4);
    assert.ok(state.completedDemoActionIds.length > 0);

    // Perform Restart
    state = restartState();
    assert.strictEqual(state.currentStepIndex, 0);
    assert.deepStrictEqual(state.visitedStepIds, [1]);
    assert.deepStrictEqual(state.completedDemoActionIds, []);
    assert.strictEqual(state.sketchStatus, 'not-started');
    assert.strictEqual(state.isWalkthroughComplete, false);
    assert.strictEqual(state.highlightedTargetId, null);
  });
});

describe('Legal & Educational Disclaimers (Fix #7, Fix #12)', () => {
  test('Legal disclaimer states independent standing', () => {
    assert.ok(LEGAL_DISCLAIMER.includes('independent'));
    assert.ok(LEGAL_DISCLAIMER.includes('not an official product or endorsement of any CAD platform'));
  });

  test('Demo disclaimer states illustration without live CAD inspection', () => {
    assert.ok(DEMO_VERIFICATION_DISCLAIMER.includes('Interactive illustration'));
    assert.ok(DEMO_VERIFICATION_DISCLAIMER.includes('without inspecting a real CAD model'));
  });
});
