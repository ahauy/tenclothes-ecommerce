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

## Learnings
- TypeScript `verbatimModuleSyntax` requires `import type` for type-only imports.
- Tailwind v4 requires explicit installation of plugins like `@tailwindcss/typography`.
- Quarkus Panache MongoDB active record operations are extremely simple, but for complex reporting/aggregations, native `MongoClient` aggregation pipelines should be used to avoid loading large document sets into JVM memory and bypass entity state tracking side effects.

