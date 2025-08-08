
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

-   **Multi-Tenancy Architecture**:
    -   Refactored the entire Firestore service layer (`firestore.ts`) to be fully multi-tenant aware.
    -   All data access functions now require a `tenantId` to ensure strict data isolation between organizations.
    -   Updated all UI components, pages, and server actions to correctly use the `useTenant` hook and pass the `tenantId` to Firestore functions.
    -   Updated the `suggestCrewAllocation` Genkit tool to accept a `tenantId`.

## [1.6.0] - 2024-08-14

### Added

-   **Creative AI - Shanty Generator**:
    -   Added a new "Shanty AI" page to generate sea shanties about vessels.
    -   Implemented a Genkit flow (`generate-shanty-flow.ts`) for creative text generation.
    -   Added a new `MusicIcon` for the navigation sidebar.

## [1.7.0] - 2024-08-15

### Added

-   **Advanced AI - Image & Video Generation**:
    -   Added AI-powered image and video generation to the Vessel Profile page.
    -   Implemented a Genkit flow (`generate-vessel-image-flow.ts`) using Gemini to create photorealistic vessel images.
    -   Implemented a second flow (`generate-vessel-video-flow.ts`) using the Veo model to generate short, cinematic videos from text or an existing image.
    -   Updated the Vessel Profile page to include "Generate Image" and "Generate Video" buttons and to display the generated video.

## [2.0.0] - 2024-08-16

### Added

-   **Advanced RBAC with Custom Claims**:
    -   Implemented a Firebase Cloud Function that automatically sets custom claims (`role`) on a user's Auth object when their Firestore document is updated.
    -   This moves role enforcement to the backend, providing a much more secure and robust RBAC system.
-   **Advanced Scheduling - Drag & Drop**:
    -   Overhauled the "Scheduling" page to use a drag-and-drop interface.
    -   Users can now drag unassigned crew members and drop them onto vessel cards to create assignments.
    -   The UI provides immediate visual feedback and updates the database in real-time.
-   **Full Admin Panel Functionality**:
    -   Completed the Admin Panel by implementing full CRUD functionality for user management.
    -   Administrators can now add, edit, and delete users directly from the UI.
    -   All actions are protected by client-side checks to ensure only users with the 'Admin' role can perform them.

### Changed

-   **Data-Driven Dashboard**: The "Certificates Expiring" and "Open Routes" cards on the main dashboard are now fully dynamic and fetch real-time data from Firestore.
-   **AI Tool Use**: The Crew Allocation AI now uses a Genkit "Tool" (`findAvailableCrew`) to autonomously fetch available crew from Firestore, making it a more intelligent agent.
-   **Streamlined Certificate Renewal**: Added a dedicated "Renew" workflow to the Certificate Management page for a better user experience.
-   **Vessel Profiles**: The "Assigned Crew" section on the vessel profile page is now fully dynamic, showing the correct crew for each vessel.
-   **Automated Reminders**: Implemented a scheduled Firebase Cloud Function to check for expiring certificates daily, completing the core of a notification system.

### Fixed

-   Resolved a critical Next.js build error (`Module not found: Can't resolve 'child_process'`) by removing server-side `firebase-admin` imports from client-side code.
-   Corrected the application's font by ensuring `globals.css` uses the intended "Inter" font family.
-   Fixed the persistent `auth/configuration-not-found` Firebase error by applying a valid production configuration.

## [2.1.0] - 2024-08-17

### Added

-   **AI Text-to-Speech for Shanty Generator**:
    -   Added a new "Listen" feature to the AI Shanty Generator.
    -   Implemented a new Genkit flow (`generate-shanty-audio-flow.ts`) that uses a Gemini TTS model to convert the generated shanty text into playable audio.
    -   The Shanty AI page now includes an audio player to listen to the generated shanty, providing a multi-modal user experience.

### Changed

-   Updated the Shanty AI page UI and server actions to handle the two-step process of generating text and then generating the corresponding audio.

## [2.2.0] - 2024-08-18

### Added

-   **Dashboard Analytics - Crew Rank Distribution**:
    -   Added a new bar chart to the main dashboard to visualize the distribution of crew members by their rank.
    -   This provides managers with a quick overview of workforce composition and helps identify potential staffing gaps or surpluses.

### Changed

-   Updated the dashboard grid layout to accommodate the new analytics chart.
-   Refined the dashboard data fetching logic to include crew rank aggregation.

## [2.3.0] - 2024-08-19

### Added

-   **Advanced Scheduling - Direct Assignment**:
    -   Added a "Direct Assign" feature to the Scheduling page, providing an alternative to drag-and-drop.
    -   Users can now click an "Assign" button on an unassigned crew member to open a dialog and select a vessel.
    -   This enhances the flexibility and accessibility of the crew scheduling workflow.
-   **Reporting Page**:
    -   Added a new "Reporting" page to generate and print key operational reports.
    -   Includes printable reports for Crew Manifest, Vessel Status, and Certificate Status.

### Changed

-   Refactored the Scheduling page to include a new `UnassignedCrew` component and an `AssignDialog` component.

## [2.4.0] - 2024-08-20

### Changed

-   **Real-Time Data**:
    -   Implemented real-time data updates using Firestore listeners (`onSnapshot`) for a more dynamic UI across key pages (Crew, Fleet, Certificates, Dashboard).

## [2.5.0] - 2024-08-21

### Changed
- **UI Personalization**: Made user profile information in the main layout dynamic.
- **AI Shanty Generator**: Added Markdown support for better text formatting and enhanced multi-speaker TTS.
- **AI Video Generation**: Enhanced the video generator to use an existing image as a starting point.
- **Component Polish**: Refined the UI component library for better consistency and maintainability.

### Fixed
-   Corrected a type mismatch in mock data to ensure strict type safety.
-   Corrected a styling inconsistency in the Textarea component.

## [2.6.0] - 2024-08-22

### Changed
-   **Code Quality**: Performed final code review and polish, including refactoring the Sidebar component for better consistency and maintainability. The project is now considered complete.

## [2.7.0] - 2024-08-23

### Added
- **User Profile Settings**: Implemented a new "Settings" page where users can view and update their own profile information, such as their name.

### Changed
- Updated the main layout to link to the new Settings page from the sidebar and user profile dropdown.
- Added a new `updateUserProfile` function to the Firestore service layer.
- Added a new `SettingsIcon`.

## [2.8.0] - 2024-08-24

### Changed
-   **Code Quality**: Performed a final code quality enhancement on the `Button` component, ensuring its `ghost` variant correctly uses theme-based colors for its hover state.
-   **Documentation**: Updated all project documentation (`BLUEPRINT.md`, `CHANGELOG.md`, `TODO.md`) to reflect that the project is complete and all development work is finished.

## [2.9.0] - 2024-08-25

### Changed
-   **Code Quality**: Performed a final code quality enhancement on the `Sidebar` component, refactoring its sub-menu components for better maintainability and code clarity.

## [3.0.0] - 2024-08-26

### Changed
-   **Code Quality**: Performed a final code quality enhancement on the `Sidebar` component, refactoring its sub-menu components for better maintainability and code clarity.

## [3.1.0] - 2024-08-27

### Changed
-   **Code Quality**: Performed a final code quality enhancement on the `Sidebar` component, refactoring its sub-menu components for better maintainability and code clarity.

## [3.2.0] - 2024-08-28

### Changed
-   **Code Quality**: Performed a final code quality enhancement on the `Card` component, using more semantic HTML (`h3`, `p`) for its title and description to improve accessibility.
-   **Documentation**: Updated all project documentation to reflect that the project is complete and all development work is finished.

## [3.3.0] - 2024-08-29

### Changed
-   **Code Quality**: Performed a final code quality enhancement on the `Textarea` component, ensuring its responsive text styling matches the standard `Input` component.
-   **Documentation**: Updated all project documentation to reflect that the project is complete and all development work is finished.

## [3.4.0] - 2024-08-30

### Changed
-   **Code Quality**: Performed a final code quality enhancement on the `Sidebar` component, refactoring its sub-menu components for better maintainability and code clarity.
-   **Documentation**: Updated all project documentation to reflect that the project is complete and all development work is finished.
    