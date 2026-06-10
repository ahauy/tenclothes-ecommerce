# Project Memory - TenClothes

## Architecture Updates
- **Admin Login Implementation (2026-04-29):**
    - Created `admin` module with React 19, Vite, and Tailwind v4.
    - Implemented "Split Screen Luxury" login page.
    - Tech Stack: Zod (Validation), Zustand (State), React Hook Form, Sonner (Toasts), Lucide React (Icons).
    - Integrated with Backend `authShareController`.
- **Backend Quarkus Migration (2026-05-28):**
    - Successfully migrated remaining Admin User Management and Admin Order Management features from Express backend to Quarkus.
    - Implemented `AdminUserService` & `AdminUserResource` for user querying, status updates, and soft deletion.
    - Implemented `AdminOrderService` & `AdminOrderResource` supporting complex MongoDB aggregation queries for global/today order statistics, status updates, and batch operations.
- **MoMo Order Flow Optimization (2026-06-08):**
    - Fixed order creation issue where unpaid MoMo orders were visible in user history and admin stats.
    - Implemented query filtering on client order history (`getMyOrdersService`), admin order lists (`getListOrderAdminService`), and admin stats aggregations (`getOrderStatsAdminService`) to hide MoMo orders unless they are paid or refunded.
    - Updated Socket.io notifications (`newOrder` event) to only trigger immediately for COD orders, and defer for MoMo orders until confirmation of successful payment via the IPN webhook.
- **Admin Review Management (2026-06-08):**
    - Designed and implemented the Admin Review Management interface (`/reviews`) in React 19 following the "Quiet Luxury" visual guidelines.
    - Added strict TypeScript definitions (`IReviewAdmin`, `IReviewUser`, etc.) in `review.interface.ts`.
    - Added filter dropdowns for moderation status (`pending`, `approved`, `rejected`) and AI safety ratings (`approved`, `flagged`, `rejected`).
    - Added approve/reject patch actions and a comprehensive review detail modal with an image lightbox.
- **User Strike Warning System & Tooltips Unified (2026-06-09):**
    - Built user strike warning mechanism where admin can issue warnings to users posting profane comments.
    - Automatically sends warning emails, hides profane comments, and bans user accounts after 3 strikes.
    - Unified icon button tooltip mechanism across Products and Reviews page using native browser `title` tooltips for maximum performance and design consistency.

## Learnings
- TypeScript `verbatimModuleSyntax` requires `import type` for type-only imports.
- Tailwind v4 requires explicit installation of plugins like `@tailwindcss/typography`.
- Quarkus Panache MongoDB active record operations are extremely simple, but for complex reporting/aggregations, native `MongoClient` aggregation pipelines should be used to avoid loading large document sets into JVM memory and bypass entity state tracking side effects.
- Fetching item counts for stats blocks can be performed efficiently by requesting lists with `limit: 1` and retrieving `totalItems` from pagination headers/bodies.


