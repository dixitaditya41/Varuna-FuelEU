### Reflection on AI Agent Usage

Using Cursor Agent and Copilot accelerated repetitive tasks (HTTP error handling, memoizing hooks, validation guardrails) while keeping architectural boundaries intact. The main gain was speed in multi-file edits with consistent patterns.

What I learned:
- Keep agents grounded by opening/reading files before editing to avoid incorrect assumptions.
- Small, focused prompts produce better code than broad requests.

Efficiency vs manual coding:
- Error handling and UI guard logic were ~3x faster to implement.
- Cross-checking wiring (routers/use-cases) still required manual inspection.

Improvements next time:
- Add scripted smoke tests earlier to catch regressions.
- Use agent-generated test templates to increase coverage more quickly.


