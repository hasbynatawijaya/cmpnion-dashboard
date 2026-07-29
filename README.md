# CMPNION — Hotel Service Management Dashboard

A dashboard for hotel front-desk staff to monitor, search, and process guest
service requests (room service, housekeeping, laundry, extra beds, spa) through
their full lifecycle, with SLA and failed-payment visibility for a busy shift.

Built as a take-home assignment. The visual language deliberately follows
CMPNION's own product — a warm cream + sage-green operational console — rather
than a generic dashboard template.

---

## Table of contents

- [Feature overview](#feature-overview)
- [Tech stack](#tech-stack)
- [Getting started (Bun)](#getting-started-bun)
- [Running tests](#running-tests)
- [Architecture](#architecture)
- [State management](#state-management)
- [API & data approach](#api--data-approach)
- [Handling loading & error states](#handling-loading--error-states)
- [Technical decisions](#technical-decisions)
- [Assumptions](#assumptions)
- [What I'd do with another day](#what-id-do-with-another-day)

---

## Feature overview

**Core**

- **Dashboard overview** — Active Guests, Pending Orders, Revenue Today,
  Completed Orders, Average Order Value, Top Selling Services, plus a
  _Needs Attention_ panel deep-linking to SLA breaches and failed payments.
- **Order management** — table (desktop) / cards (mobile) showing order ID,
  guest, room, service, quantity, time, status, payment, and amount.
- **Search** — across guest name, order ID, and room number.
- **Filters** — by order status, service type, and payment status; compose with
  search.
- **Sorting** — newest / oldest first.
- **Order details** — a right-hand drawer with the full order and contextual
  actions; deep-linkable via `?order=ORD-1001`.
- **Lifecycle actions** — Acknowledge → Start → Complete, and Cancel from any
  non-final state (behind a confirmation dialog), enforced by a status machine.
- **SLA highlight** — orders that stay _New_ for more than 15 minutes get a red
  row accent + badge, a quick-filter with a live count, and a dashboard callout.
  SLA state is re-evaluated on a timer, so an order crosses the threshold on
  screen without a refetch.

**Bonus implemented**

- **Optimistic updates** with rollback + toast on failure.
- **URL-based state** for search, filters, sort, and the open order.
- **Unit & component tests** on Bun's test runner.
- Light **and** dark mode, responsive mobile navigation, an API abstraction
  layer, and a reusable UI primitive set.

---

## Tech stack

| Concern            | Choice                                             |
| ------------------ | -------------------------------------------------- |
| Runtime / PM / test| **Bun**                                            |
| Build tool         | **Vite**                                           |
| Framework          | **React 19 + TypeScript** (functional components)  |
| Styling            | **Tailwind CSS v4** (CSS-variable theme tokens)    |
| UI primitives      | Hand-built on **Radix UI** (shadcn/ui style)       |
| Server state       | **TanStack Query**                                 |
| Routing            | **React Router**                                   |
| Mock API           | **MSW** (Mock Service Worker)                      |
| Validation         | **Zod** (validates the API boundary)               |
| Toasts             | **sonner**                                         |
| Testing            | **bun test** + Testing Library + happy-dom         |

---

## Getting started (Bun)

Requires [Bun](https://bun.sh) (`curl -fsSL https://bun.sh/install | bash`).

```bash
bun install        # install dependencies
bun dev            # start the dev server → http://localhost:5173
bun run build      # type-check + production build to dist/
bun run preview    # preview the production build
```

No backend or environment variables are needed — the app boots a mock API in the
browser (see [API & data approach](#api--data-approach)).

> **Try the required states:** the flask icon in the header toggles
> _fail loading orders_ and _fail order actions_ to preview the error state and
> optimistic-update rollback on demand.

---

## Running tests

```bash
bun test           # run the unit + component suite
bun run typecheck  # tsc project-references type-check
```

Coverage focuses on the pure domain logic (status machine, SLA, search/filter/
sort, metrics) plus a component render test.

---

## Architecture

Organised **by feature**, with a framework-agnostic domain core at the centre:

```
src/
├─ domain/        Pure, framework-free business logic (fully unit-tested)
│   ├─ types.ts               Order model + enums
│   ├─ orderStatusMachine.ts  Allowed transitions & available actions
│   ├─ sla.ts                 15-minute SLA rule
│   ├─ orderFilters.ts        Search + filter + sort (pure)
│   └─ metrics.ts             Dashboard KPIs derived from orders
├─ api/           Abstraction layer over HTTP (client + orders API + Zod)
├─ mocks/         MSW handlers, in-memory store, seed data, failure toggles
├─ features/
│   ├─ dashboard/ KPI cards, top services, attention panel
│   └─ orders/    Table, mobile cards, filters, drawer, actions, query hooks
├─ components/    App shell, shared states (Empty/Error), and ui/ primitives
├─ providers/     Theme + TanStack Query providers
├─ hooks/         useDebounce, useNow (live SLA ticker)
└─ lib/           cn(), formatters
```

**Why this shape**

- **Domain isolation.** Business rules live in `domain/` as pure functions with
  no React or network imports, so they're easy to test in isolation. Keeping all
  status transitions in one table also means the UI can't request an illegal move.
- **Feature folders** keep the components, hooks, and UI for a slice together,
  which holds up better than type-based folders as the app grows.
- **Owned UI primitives.** The `components/ui` layer is small and built on Radix
  for accessibility (focus management, keyboard nav, ARIA), so I get full control
  of the styling without pulling in a heavier component library.

---

## State management

State is split deliberately by _who owns it_:

| Kind             | Where it lives              | Examples                                   |
| ---------------- | --------------------------- | ------------------------------------------ |
| **Server/async** | TanStack Query cache        | the orders list                            |
| **URL**          | `useSearchParams`           | search, status/service filter, sort, open order |
| **Derived**      | `useMemo` selectors         | dashboard metrics, filtered list, SLA count |
| **Local UI**     | `useState`                  | theme, mobile-nav open, confirm-dialog open |

- **Server state isn't copied into local state.** The orders query is the one
  source the table, drawer, and dashboard all read from.
- **View state lives in the URL** (`useOrderFilters`), so a filtered view or an
  open order is shareable, survives a refresh, and works with the back button.
- **Metrics are derived, not stored**, so the KPI cards always match the table.

---

## API & data approach

There is **no backend**. A **Mock Service Worker** intercepts real `fetch` calls,
so the app exercises genuine asynchronous behaviour — real loading, retries, and
error handling — rather than fake promises.

- `GET /api/orders` — returns the seeded dataset after a simulated delay.
- `PATCH /api/orders/:id/status` — applies a lifecycle action, re-validating the
  transition server-side against the same status machine.
- The **seed data** (~40 orders) is generated with times relative to _now_, so
  the SLA highlight is live on every load. A couple of orders are pinned to
  guarantee a visible SLA breach and a failed payment for review.
- The **API abstraction layer** (`api/orders.api.ts`) is the only module that
  knows the HTTP shape; responses are validated with **Zod** at the boundary.
  Swapping MSW for a real server is a one-file change.

---

## Handling loading & error states

Every async surface renders one of four states:

- **Loading** — skeletons that mirror the real table/card layout (no layout shift).
- **Empty** — a distinct message for "no orders yet" vs "nothing matches your
  filters" (the latter offers a _Clear filters_ action).
- **Error** — a clear message with a **Retry** button that refetches; 4xx
  application errors aren't retried automatically, 5xx transient errors are
  retried a couple of times.
- **Success** — the full dashboard / order experience.

Order actions are **optimistic**: the UI updates immediately, and on failure it
**rolls back** to the previous cache snapshot and shows an error toast. It then
re-fetches to sync with the server. Toggle _fail order actions_ in the header to
see this.

---

## Technical decisions

- **Component structure** — feature-first, with a pure domain core and a thin,
  owned UI-primitive layer. Business rules are decoupled from React so they can be
  tested and reused independently.
- **State** — server state in TanStack Query, view state in the URL, everything
  else derived or local. Nothing is duplicated across those boundaries.
- **Loading/errors** — handled per query with skeletons, an empty/error/success
  split, retry, and optimistic mutations with rollback.
- **Accessibility** — Radix primitives, semantic table markup, `aria-label`s on
  icon-only controls, focus-visible rings, and full keyboard support in the
  drawer, dialog, and menus.
- **Styling** — Tailwind v4 with a CSS-variable design-token theme, so light and
  dark modes and all status colours derive from one place.
