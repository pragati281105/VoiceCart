# Approach Write-Up

**Problem:** Shopping is a repetitive, hands-busy task. Typing out a grocery list while cooking or holding bags is friction that a voice interface removes entirely.

**Approach:** I started from the constraint — Web Speech API (free, browser-native) — and designed around it. The core flow is: voice → transcript → NLP parser → API call → UI update. Each step is a clean module boundary, so any layer can be swapped without touching the others.

For NLP, I chose a regex-based intent parser over a library. At the scale of shopping commands, a small rule set covers 95% of realistic inputs and adds zero runtime cost or bundle weight. The quantity/unit parser handles both numeric ("2 kg") and word-form ("two liters") inputs with a straightforward mapping table.

Categorization uses a keyword-to-category dictionary — fast, deterministic, and easy to maintain. The same principle applies to suggestions: a month-indexed seasonal table and a static substitutes map deliver meaningful results without any ML infrastructure.

The biggest architectural decision was keeping the backend thin: SQLite over a full database server means zero setup friction for local dev, and better-sqlite3's synchronous API keeps the Express routes simple and readable. History tracking is a simple frequency counter that accumulates as the user adds items — no separate pipeline needed.

**Trade-offs made:** The Web Speech API is Chrome/Edge-only and requires a network connection (Google processes audio server-side). The NLP parser won't handle highly ambiguous or grammatically unusual phrasing. These are acceptable constraints for a local-dev demo within an 8-hour budget.
