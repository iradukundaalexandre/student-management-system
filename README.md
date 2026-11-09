# Student Management System (React JS)

A responsive administrator dashboard demonstrating the nine requested React event-handling requirements.

## Requirements
- Node.js 18 or newer
- npm
- VS Code (recommended)

## Run the project
1. Extract `student-management-system.zip`.
2. Open the extracted `student-management-system` folder in VS Code.
3. Open Terminal > New Terminal.
4. Install dependencies:

   ```bash
   npm install
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open the local URL printed in the terminal (normally `http://localhost:5173`).

To create a production build, run `npm run build`.

## Features and where they are implemented

1. **Register students — controlled components:** form fields use React state (`value` and `onChange`) in `src/App.jsx`.
2. **Display students — dynamic lists and `map()`:** student table rows are rendered with `filteredStudents.map()`.
3. **Search students — debouncing:** a 350ms `setTimeout` effect delays filtering until typing pauses.
4. **Delete students — event handling and `filter()`:** delete handler confirms then removes a record with `filter()`.
5. **View student details — passing arguments:** `setSelectedStudent(student)` passes the selected student object to the details view.
6. **Validate registration form — form events:** `onSubmit`, `preventDefault()`, and `validateForm()` validate required fields and email/phone formats.
7. **Keyboard shortcuts — custom hooks:** `src/hooks/useKeyboardShortcuts.js` implements Ctrl/Cmd + K to focus search and Escape to close details.
8. **Nested clicks — event bubbling:** row click opens details; action buttons call `event.stopPropagation()` so their clicks do not trigger the row.
9. **Prevent repeated actions — throttling:** `src/hooks/useThrottle.js` limits the Clear action to once per 1.5 seconds.

## Data storage
Student records are saved in the browser's `localStorage`, so they remain after refresh in the same browser. This is a frontend demonstration; it does not include a server/database or secure multi-user authentication.

## Reset sample data
Clear the browser's local storage for this site using Developer Tools > Application > Local Storage, then refresh. Alternatively, register and delete records through the interface.
