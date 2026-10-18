## Feature

Act as a senior Angular engineer, when creating a UI element, use Angular Material UI. Don't generate tests.

### Folder structure

- `data-access`: NgRx Signal Store for `POST`, `PATCH`, and `PUT` requests. Use the `httpResource` API for `GET` requests where there is no local state management.
- `features`: For different feature displays.
- `interfaces`: For types/interfaces starting with `I`, for example `ISignInPayload`. No type should be defined directly in components or services. Use barrel exports.
- `ui`: For visual elements with no direct interaction with the store avoid gradients colors or backgrounds, prefer rounded-md for cards.
