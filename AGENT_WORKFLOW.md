# AI Agent Workflow Log

## Agents Used
- Cursor Agent (workspace-aware planning, edits, and refactors)
- GitHub Copilot (inline completions/boilerplate)

## Prompts & Outputs
- Example 1 (Stabilize frontend data flow)
  - Prompt: “The frontend shows repeated results and actions don’t reflect errors. Add robust error handling to HTTP adapters and avoid refetch loops.”
  - Output snippet (edited for brevity):
    ```ts
    const res = await fetch(url);
    if (!res.ok) throw new Error(...)
    return res.json();
    ```
  - Applied in `HttpRouteAdapter`, `HttpBankingAdapter`, `HttpComplianceAdapter`.
- Example 2 (Pooling validation)
  - Prompt: “Disable create pool unless rules are satisfied (sum ≥ 0, at least one deficit).”
  - Output snippet integrated:
    ```ts
    const canCreatePool = selectedShips.length > 0 && poolSum >= 0 && hasDeficitSelected && !loading;
    ```
    Added helper messages and disabled state.

## Validation / Corrections
- Verified backend route wiring (`app.ts`) to ensure `/banking` endpoints are mounted.
- Confirmed pooling use-case enforces rules; guarded UI to prevent invalid requests.
- Tested UI states: successful fetch, 4xx/5xx handling, disabled buttons with informative hints.

## Observations
- Saved time on boilerplate error handling and UI guard conditions.
- Occasional hallucination around missing imports; validated by reading actual files before edits.
- Combined Cursor Agent for multi-file changes with Copilot for small completions.

## Best Practices Followed
- Hexagonal separation maintained (ports/adapters).
- Minimal UI changes; focused on correctness and feedback.
- Memoized loaders to prevent repeated effects.
- Clear error surfaces via toasts and disabled actions.


