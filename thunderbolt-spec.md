# Thunderbolt Dispatch OS - MVP Specification

## 1. Overview
Thunderbolt Dispatch OS is an end-to-end platform for managing trucking operations, focusing on Dump Trucks (MVP) with extensibility to Water Trucks, Floats, Hydroseeders, and Sweepers. It replaces manual tools (texts, emails, spreadsheets) with unified workflows for order intake, dispatching, driver execution, approvals, billing, assets, archiving, reporting, and notifications.

- **Tech Stack**:
  - Frontend: React Native (for cross-platform mobile apps on iOS/Android for Drivers; also bundled for Web UI in browsers via React Native Web).
  - Backend: Node.js (with Express/NestJS for APIs; REST + GraphQL for queries).
  - Database: SQL Server (Azure SQL Database; schema with tables for jobs, users, assets, etc.; use Sequelize ORM for Node.js).
  - Hosting: Azure Web App (single app hosting Node.js backend and serving React Native Web build; mobile apps deployed separately to app stores).
  - Integrations: QuickBooks Online (Canada) for billing; Geotab for GPS; Google Maps for geocoding/routing; FCM (Firebase) + Twilio for notifications.
  - Other: Offline sync (IndexedDB/Service Workers in React Native); RBAC (JWT auth); PIPEDA compliance (data residency in Canada East).

- **Deployment**: GitHub Actions CI/CD for building/testing/deploying to Azure Web App. Backend serves static React Native Web assets.

## 2. High-Level Requirements
### Functional Requirements
- **Order Intake**: Customer portal (web/mobile) for job submissions (truck type, material, quantity, location, timing); email parsing (rule-based + optional AI); Google Maps validation; attachments; multi-load/stop support.
- **Dispatch & Scheduling**: Load Board (Kanban/Timeline/Map views) with drag-drop assignment; real-time Geotab GPS pins; proximity calculations; inline edits.
- **Driver Mobile App**: Job feed; one-tap status updates (En Route, On Site, Loading, In Transit, Dumping, Complete); photo/signature capture; ticket PDF generation; offline queue with auto-sync.
- **Approvals & Billing**: Multi-step approvals (variances); QBO sync (instant/batch invoices); project/cost code linking.
- **Assets Management**: Truck registry; Geotab linkage; availability/idle reporting.
- **Archive & Search**: Full-text search; audit trails; 7+ year retention.
- **Reporting**: Dashboards (jobs/day, on-time %, tonnage); exports.
- **Notifications**: Push/SMS/email for changes; preferences.
- **Admin UI**: Configuration (pricing, workflows, RBAC); user management.
- **Security**: RBAC (Dispatcher, Driver, Admin, Customer); MFA; audit events.

### Non-Functional Requirements
- Performance: UI <1.5s; sync <5s; scale to 200 jobs/day.
- Availability: 99.5% uptime; offline mobile.
- Security: PIPEDA; TLS; AES-256; incident response.
- Data: Canada residency; retention policies.
- Usability: WCAG 2.1 AA; English (French Phase 2).
- Integrations: Retries/throttling handling.
- Testing: Unit/E2E; 60-day warranty.
- Metrics: Invoice cycle ≤1h; on-time ≥90%.

## 3. Architecture & Components
- **Frontend (React Native)**: Shared codebase for mobile (iOS/Android via Expo) and web (React Native Web). Use Redux for state; React Navigation for routing; libraries: react-native-maps (Google Maps), @react-native-firebase (FCM), react-native-signature-capture, react-native-pdf-lib (tickets), @react-native-async-storage (offline).
- **Backend (Node.js)**: Express/NestJS; APIs (/api/jobs, /api/dispatch); Sequelize for SQL Server; BullMQ for queues (syncs); JWT for auth; Nodemailer/Twilio SDK.
- **Database (SQL Server)**: Tables: Users (id, role, email), Jobs (id, status, truck_type, location, photos), Assets (id, geotab_id), Audits. Use migrations (Sequelize CLI).
- **Integrations**: QBO (quickbooks SDK); Geotab (geotab-js); Google Maps (google-maps-services-js); FCM/Twilio.
- **CI/CD**: GitHub Actions YAML for build/test/deploy.

## 4. UI Flows
### 4.1 Admin UI (Web Browser via React Native Web)
- Dashboard: Overview metrics, user management.
- Config: Pricing rules, truck types, RBAC roles.
- Assets: Add/edit trucks, link Geotab.

### 4.2 Order Entry UI (Web Browser via React Native Web; Customer Portal)
- Form: Select truck type, material, quantity, location (Google Maps picker), timing, attachments.
- Review/Submit: Validation, email confirmation.

### 4.3 Driver Face UI (Mobile App on iOS/Android)
- Login: JWT/MFA.
- Job List: Sorted by priority; map view.
- Job Detail: Status buttons, photo upload, signature pad, PDF gen, offline sync.
- Notifications: Push for assignments.

## 5. Data Models (SQL Server Schema)
- Users: id (PK), username, password_hash, role (enum: admin, dispatcher, driver, customer), email.
- Jobs: id (PK), status (enum), truck_type (enum), material, quantity, location_lat, location_long, timing_start, timing_end, photos_json, signature, ticket_pdf_url, driver_id (FK), approver_id (FK).
- Assets: id (PK), name, type (enum), geotab_id, availability (bool).
- Audits: id (PK), action, user_id (FK), timestamp.

## 6. CI/CD YAML for GitHub Actions
The YAML should:
- Build React Native Web (expo build:web).
- Build Node.js backend.
- Bundle frontend into backend's public folder.
- Deploy to Azure Web App (using azure/webapps-deploy action).
- Triggers: On push to main.
- Secrets: AZURE_WEBAPP_NAME, AZURE_WEBAPP_PUBLISH_PROFILE.

## 7. Implementation Guidelines
- Use TypeScript throughout.
- Offline: Use Redux-offline or similar for mobile.
- Security: Validate inputs, rate-limit APIs.
- Testing: Jest for unit; React Native Testing Library for UI.
- Deployment: Azure Web App with Node.js runtime; SQL on Azure SQL.