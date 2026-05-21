---
name: build-confidence-by-trying-to-prove-incorrect
description: Resolve a decision, claim, or plan you are not fully confident in by dispatching an adversarial Agent whose job is to disprove it. Use before committing to a non-trivial or hard-to-reverse next step while ambiguity or low confidence remains. Trigger phrases — "I have a feeling but want to be sure", "is this the right next step?", "prove this wrong before I act", "I keep wanting to second-guess this".
context: fork
---

# Build confidence by trying to prove it incorrect

When you have a hypothesis, plan, or next step you are not fully confident in,
do not guess and do not proceed. Dispatch an adversarial `Agent()` whose
explicit job is to **disprove** it. Proceed only once the claim survives a
genuine attack.

## Steps

1. Write the claim/plan as a single falsifiable statement, plus the concrete
   next step it would justify and why the step is hard to reverse.
2. Dispatch `Agent(run_in_background: true)` with an adversarial brief: its job
   is to prove the claim wrong, unsafe, or that a better option exists — NOT to
   agree. Instruct it to verify empirically wherever possible, cite official or
   primary sources, and to state explicitly if it cannot disprove the claim.
3. Require the agent to write its findings to a file and return a short
   verdict: which claims survived, which were disproven, and the corrected
   next step.
4. If a claim is disproven, adopt the correction. If confidence is still not
   sufficient, repeat from step 1 on the corrected claim.
5. If the claim survives a genuine attack, confidence is sufficient — proceed.

## Stop condition

You are done debating when you no longer feel you would need another round to
prove the next step wrong. Lingering "do nothing until proven correct"
hesitation means another round is needed.

## Notes

- The adversary must genuinely attack — an agreeable reviewer gives false
  confidence. Frame the brief so agreement is failure.
- Empirical disproof beats argument: prefer an agent that can run a test.
- This is for uncertainty, not for every decision — skip it when the next step
  is obvious and easily reversible.
