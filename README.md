# Take‑Home Assessment

## ✔️ Assessment Review: Objective Completion

### 💻 Frontend (React)

1. **Memory Leak**
   - **Status:** ✅ Fixed
   - **Details:** The `Items.js` component uses an `AbortController` to cancel fetch requests if the component unmounts, preventing memory leaks.

2. **Pagination & Search**
   - **Status:** ✅ Implemented
   - **Details:** The item list supports both pagination and server-side search. The frontend sends `q`, `limit`, and `page` parameters to the backend, which returns filtered and paginated data.

3. **Performance (Virtualization)**
   - **Status:** ✅ Implemented
   - **Details:** The list uses `react-window` (`FixedSizeList`) for virtualization, ensuring smooth performance even with large datasets.

4. **UI/UX Polish (optional)**
   - **Status:** ✅ Enhanced
   - **Details:** The UI was improved with modern CSS, animated skeleton loaders, styled buttons, user feedback for empty search results, and a better navigation experience.

---

### 🔧 Backend (Node.js)

1. **Refactor blocking I/O**
   - **Status:** ✅ Refactored
   - **Details:** All file read/write operations in `src/routes/items.js` were converted to asynchronous using `fs.promises`, eliminating blocking I/O.

2. **Performance (`/api/stats`)**
   - **Status:** ✅ Optimized
   - **Details:** The `/api/stats` endpoint now uses in-memory caching, which is automatically invalidated when the data file changes, avoiding unnecessary recalculation.
   - **Extra:** The cache is invalidated in real time using `fs.watch`, so stats are only recalculated when the data changes. This fully meets the assessment's performance goal for this endpoint.

---

## Summary

All required and optional objectives from the assessment have been fully addressed, including UX and performance improvements.  
The project is ready for review and use!
