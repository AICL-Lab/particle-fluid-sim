---
name: verify
description: Run the full validation pipeline (lint → typecheck → test:coverage → build) matching CI
---

Run the complete validation pipeline for this project:

```bash
npm run lint && npm run typecheck && npm run test:coverage && npm run build
```

This matches the CI workflow order. Report any failures and suggest fixes.
