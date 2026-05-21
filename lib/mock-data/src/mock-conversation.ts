/**
 * @farish/mock-data — mock generation conversation.
 *
 * Provides a realistic pre-built conversation demonstrating the full Generate
 * page flow: prompt input → spec-clarification Q&A → live agent-loop steps.
 * Used by the Generate page demo mode so visitors can see the feature without
 * a real API key.
 */

/** A single clarification question the AI asks to refine the model spec. */
export interface MockClarificationQuestion {
  /** Unique identifier within the conversation. */
  id: string;
  /** The question text displayed to the user. */
  question: string;
  /** How the user answers: radio buttons or free text. */
  answerType: 'radio' | 'text';
  /** Options shown for radio-type questions. */
  options?: readonly string[];
  /** The pre-filled mock answer used in demo mode. */
  mockAnswer: string;
}

/** One step of the live agent execution loop. */
export interface MockAgentStep {
  /** Unique identifier within the conversation. */
  id: string;
  /** Short label shown in the progress feed. */
  label: string;
  /** Optional detail text for the step. */
  detail?: string;
  /** Simulated wall-clock duration (informational only). */
  durationMs: number;
}

/** The complete mock generation conversation for demo mode. */
export interface MockGenerationConversation {
  /** The prompt the user "typed". */
  promptText: string;
  /** The clarification questions the AI asks (already answered in demo). */
  clarificationQuestions: MockClarificationQuestion[];
  /** The sequence of agent-loop execution steps. */
  agentSteps: MockAgentStep[];
  /** A human-readable summary of what was built (shown in the result area). */
  resultSummary: string;
}

/**
 * Return a deterministic mock generation conversation.
 *
 * The same `seed` always returns the same conversation — snapshots stay stable.
 * Currently only one conversation template exists; the seed parameter is
 * reserved for future variety.
 *
 * @param _seed - Reserved; currently unused.
 */
export function mockGenerationConversation(
  _seed = 1,
): MockGenerationConversation {
  return {
    promptText:
      'A low-poly dragon perched on a rocky spire, wings spread wide, breathing a cone of geometric fire',

    clarificationQuestions: [
      {
        id: 'q-scale',
        question: 'What scale should this model target?',
        answerType: 'radio',
        options: ['Miniature (tabletop scale)', 'Mid-size (game asset)', 'Hero prop (cinematic)'],
        mockAnswer: 'Miniature (tabletop scale)',
      },
      {
        id: 'q-interior',
        question: 'Should the dragon body include interior topology (hollow, riggable)?',
        answerType: 'radio',
        options: ['Solid exterior only', 'Hollow with rib cage', 'Full interior skeleton topology'],
        mockAnswer: 'Solid exterior only',
      },
      {
        id: 'q-texture',
        question: 'Describe any specific colour palette or texture style:',
        answerType: 'text',
        mockAnswer: 'Deep emerald scales with amber underbelly; fire effect in orange-gold gradient',
      },
    ],

    agentSteps: [
      {
        id: 'step-parse',
        label: 'Parsing prompt',
        detail: 'Identified key subjects: dragon, spire, wings, fire cone',
        durationMs: 320,
      },
      {
        id: 'step-clarify',
        label: 'Reviewing spec answers',
        detail: 'Scale: miniature · Interior: solid · Palette: emerald / amber',
        durationMs: 180,
      },
      {
        id: 'step-skeleton',
        label: 'Building base skeleton mesh',
        detail: '862 vertices · 1 704 tris',
        durationMs: 1200,
      },
      {
        id: 'step-wings',
        label: 'Generating wing geometry',
        detail: 'Membrane panels: 8 · strut count: 12',
        durationMs: 940,
      },
      {
        id: 'step-spire',
        label: 'Constructing rocky spire',
        detail: 'Procedural rock geometry · 420 faces',
        durationMs: 760,
      },
      {
        id: 'step-fire',
        label: 'Generating fire cone geometry',
        detail: 'Layered cone with 6 gradient bands',
        durationMs: 580,
      },
      {
        id: 'step-materials',
        label: 'Applying low-poly materials',
        detail: 'Flat-shaded · vertex colour bake · UV unwrap complete',
        durationMs: 1100,
      },
      {
        id: 'step-optimise',
        label: 'Optimising mesh',
        detail: 'Final: 3 186 vertices · 6 240 faces · LOD0 ready',
        durationMs: 640,
      },
    ],

    resultSummary:
      'Low-poly dragon on spire — 6 240 faces · emerald/amber palette · export-ready OBJ',
  };
}
