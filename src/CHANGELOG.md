# Changelog

## [0.1.0] - 2024-07-30

### Added

-   Initial project setup with Next.js, TypeScript, and ShadCN UI.
-   Basic dashboard layout with navigation for core features.
-   Mock data for crew, vessels, certificates, and users.
-   Light and dark theme support with a theme toggler.
-   Login page with a mock authentication flow.

### Changed

-   Updated `globals.css` with the primary, background, and accent colors from the style guide.
-   Set "Inter" as the primary font for the application.

## [0.2.0] - 2024-07-31

### Added

-   **Crew Allocation AI**:
    -   New "Crew AI" page for generating crew allocation suggestions.
    -   Genkit flow (`suggest-crew-allocation.ts`) to process allocation requests.
    -   Server action (`getCrewSuggestion`) to connect the UI with the AI flow.
    -   Client component (`CrewAllocationClient`) to manage the form and display results.
-   Added `Bot` icon to the dashboard sidebar for the "Crew AI" page.

## [0.3.0] - 2024-08-01

### Added

-   **Firebase Authentication**:
    -   Created a Firebase project and integrated the Firebase SDK.
    -   Implemented `signInWithEmailAndPassword` for user login on the login page.
    -   Added a logout button to the dashboard layout that calls `signOut`.
    -   Included basic error handling and loading states for the login process.

## [0.4.0] - 2024-08-02

### Added

-   **Fleet Operations**:
    -   Implemented full CRUD (Create, Read, Update, Delete) functionality for vessels.
    -   Connected the Fleet Operations UI to a Firestore database.
    -   Created a form (`vessel-form.tsx`) for adding and editing vessel details.
    -   Added loading skeletons and toast notifications for user feedback.

### Changed

-   Removed authentication and tenant selection to simplify development and focus on core modules. The app now defaults to the dashboard.
-   Updated Firestore service (`firestore.ts`) to include vessel management functions.

### Fixed

-   Resolved persistent `auth/configuration-not-found` Firebase error by ensuring correct initialization order.
-   Fixed application routing to correctly redirect from the root to the `/dashboard` page.

## [0.5.0] - 2024-08-03

### Changed

-   **Crew Allocation AI**:
    -   Updated the Crew AI page to use live data from Firestore instead of mock data.
    -   The allocation form now dynamically populates with crew and vessels from the database.
    -   Server action now fetches real data to provide more accurate AI suggestions.

## [0.6.0] - 2024-08-04

### Added

-   **Certificate Management**:
    -   Implemented full CRUD functionality for certificates, connecting the UI to Firestore.
    -   Created a form (`certificate-form.tsx`) for adding and editing certificates with date pickers.
    -   The main page now fetches data from Firestore and dynamically calculates the status ('Valid', 'Expiring Soon', 'Expired') based on the expiry date.

### Changed

-   Updated Firestore service (`firestore.ts`) to include certificate management functions.
-   Updated `types.ts` to support both the base `Certificate` type and a `CertificateWithStatus` type for the UI.

## [0.7.0] - 2024-08-05

### Added

-   **Crew Management**:
    -   Implemented full CRUD functionality for crew members, connecting the UI to Firestore.
    -   Created a form (`crew-form.tsx`) for adding and editing crew details.
    -   Replaced mock data on the crew page with live data, skeletons, and toast notifications.

### Changed

-   Updated `firestore.ts` to include crew management functions.

## [0.8.0] - 2024-08-06

### Added

-   **Crew Profile Pages**:
    -   Created a dynamic route (`/dashboard/crew/[id]`) to display detailed profiles for each crew member.
    -   The profile page shows key details like status, assigned vessel, certifications, and medical records.
    -   Added a `getCrewMemberById` function to the Firestore service.
    -   The "View Details" option in the crew list now links to the corresponding profile page.

### Changed

-   Updated `lib/firestore.ts` to include sample data for `certifications` and `medicalRecords` when creating a new crew member to better demonstrate profile pages.

## [0.9.0] - 2024-08-07

### Added

-   **Dashboard Analytics**:
    -   Connected the main dashboard to Firestore to display live data.
    -   Summary cards for 'Total Crew' and 'Vessels In Service' are now dynamic.
    -   The 'Recent Crew Members' table and 'Fleet Status' list now show real-time information.
    -   Added loading skeletons for a better user experience while data is being fetched.

### Changed

-   Converted the dashboard page to a client component (`'use client'`) to enable data fetching hooks.

## [1.0.0] - 2024-08-08

### Added

-   **Dashboard Chart**:
    -   Added a pie chart to the main dashboard to visualize the distribution of vessels by their operational status ('In Service', 'In Maintenance', 'Docked').
    -   The chart is interactive, with a tooltip showing the count for each status.

### Changed

-   Updated the dashboard grid layout to better accommodate the new analytics chart.

## [1.1.0] - 2024-08-09

### Added

-   **Route Optimizer AI**:
    -   New "Route AI" page for generating optimal shipping route suggestions.
    -   Genkit flow (`suggest-route-flow.ts`) to process route requests based on start/end ports and vessel type.
    -   New `RouteIcon` for navigation.

## [1.2.0] - 2024-08-10

### Added

-   **Predictive Maintenance AI**:
    -   New "Maintenance AI" page for generating predictive maintenance forecasts for vessels.
    -   Genkit flow (`predictive-maintenance-flow.ts`) to analyze vessel data and suggest proactive maintenance.
    -   New `MaintenanceIcon` for navigation.

## [1.3.0] - 2024-08-11

### Added

-   **Safety Report Analysis AI**:
    -   New "Safety AI" page for analyzing incident reports.
    -   Genkit flow (`analyze-safety-report-flow.ts`) to identify risks and suggest corrective actions.
    -   New `SafetyIcon` for navigation.

## [1.4.0] - 2024-08-12

### Added

-   **Offline Data Caching**:
    -   Enabled Firestore's offline persistence in `firebase.ts`.
    -   The application now caches data locally, allowing users to view and modify data even when offline. Changes are synced automatically upon reconnection.

## [1.5.0] - 2024-08-13

### Changed

-   **Admin Panel**:
    -   Refactored the `getUsers` function in `firestore.ts` to query all tenant sub-collections, ensuring it fetches all users across the entire system.
    -   Removed the mock data population from `getUsers`, making the Admin Panel fully data-driven.

## [1.6.0] - 2024-08-14

### Added

-   **Vessel Profile Pages**:
    -   Created a dynamic route (`/dashboard/fleet/[id]`) to display detailed profiles for each vessel.
    -   The profile page shows key details like IMO, type, status, and maintenance schedules.
    -   Added a `getVesselById` function to the Firestore service.
    -   The "View Details" option in the fleet list now links to the corresponding profile page.

## [1.7.0] - 2024-08-15

### Added
- **Crew Scheduling UI**:
  - Created a new "Scheduling" page at `/dashboard/scheduling`.
  - Added a `SchedulingIcon` for the navigation sidebar.
  - Implemented a basic weekly calendar view to serve as the foundation for future drag-and-drop scheduling.

## [1.8.0] - 2024-08-16
### Changed
- **Enhanced Crew Scheduling UI**:
  - The scheduling page now dynamically fetches and displays crew and vessel data from Firestore.
  - Added a "Vessel Assignments" card that lists assigned crew members under their respective vessels, complete with avatars.
  - The "Unassigned Crew" list now correctly filters for active, unassigned crew members.

## [1.9.0] - 2024-08-17
### Added
- **Firebase Authentication**:
    - Re-implemented Firebase Authentication with a dedicated login page (`/login`).
    - Added email/password sign-in and a logout button in the user menu.
    - Implemented a protected route system to redirect unauthenticated users to the login page.
### Changed
- The application's root now redirects to `/login` instead of `/dashboard`.

## [2.0.0] - 2024-08-18
### Added
- **Reporting Module**:
  - Created a new "Reporting" page at `/dashboard/reporting`.
  - Added a `ReportingIcon` and navigation link.
  - Implemented the first report: a printable "Crew Manifest" that lists all crew members.
  
## [2.1.0] - 2024-08-19
### Added
- **Vessel Status Report**:
  - Added a "Vessel Status Report" to the Reporting page.
  - The report fetches all vessels from Firestore and displays their status in a printable table.
  - Refactored the reporting page to cleanly support multiple report components.

## [2.2.0] - 2024-08-20
### Added
- **Certificate Status Report**:
  - Added a "Certificate Status Report" to the Reporting page.
  - This report fetches all certificates, calculates their status (Valid, Expiring Soon, Expired), and displays the results in a printable table.
  
## [2.3.0] - 2024-08-21
### Added
- **Dashboard Analytics Chart**:
  - Added a "Crew Status Distribution" bar chart to the main dashboard.
  - The chart visualizes the breakdown of crew members by their status ('Active', 'On Leave', 'Inactive').
  
## [2.4.0] - 2024-08-22
### Added
- **Advanced Certificate Management**:
  - Implemented a "Renew Certificate" workflow.
  - Users can now click a "Renew" action on a certificate, which opens a dialog with a simplified form to set a new expiry date.
  
## [2.5.0] - 2024-08-23
### Added
- **Advanced Role-Based Access Control (RBAC)**:
  - Created a `useCurrentUser` hook to efficiently provide user role information across the application.
  - Implemented UI-level restrictions to disable or hide sensitive actions (Add, Edit, Delete) for users without 'Admin' or 'Manager' roles on all relevant pages.
  
## [2.6.0] - 2024-08-24
### Added
- **Tenant Selection Screen**:
    - Created a tenant selection page that appears after login.
    - Updated routing logic to direct users to this page before accessing the main dashboard.

## [2.7.0] - 2024-08-25
### Added
- **Notifications**:
    - Implemented an in-app notification system with a dedicated page and a dropdown in the header.
    - Added a `NotificationsIcon` for navigation.
    - The UI includes mock notifications for certificate expiries and maintenance reminders as a proof-of-concept.

## [2.8.0] - 2024-08-26
### Added
- **AI Shanty Generator**:
    - Added a new creative AI tool to generate sea shanties about vessels.
    - Created a new Genkit flow (`generate-shanty-flow.ts`) for the AI logic.
    - Implemented a "Shanty AI" page with a form to select a vessel and display the generated song.
    - Added a `MusicIcon` for navigation.

## [2.9.0] - 2024-08-27
### Changed
- **Dynamic Notifications**:
    - Replaced mock notification data with a real-time system that generates alerts for expiring and expired certificates.
    - Created a new `notifications.ts` service to handle the logic for fetching and processing notification-worthy events.
    - The header dropdown and the main notifications page now display live, actionable alerts.

## [2.9.1] - 2024-08-28
### Fixed
- **Code Cleanup**: Removed an obsolete and unused layout file from `src/dashboard/` to maintain a clean codebase.

## [2.9.2] - 2024-08-29
### Fixed
- **Authentication Flow**: Corrected the post-login redirect path in `login/page.tsx` to point to `/dashboard/select-tenant`, ensuring user data is loaded correctly by the `useCurrentUser` hook.

## [2.9.3] - 2024-08-30
### Added
- **Advanced Scheduling**: Implemented an "Assign to Vessel" action on the scheduling page, allowing managers to directly assign unassigned crew members to a vessel via a dropdown menu.

    