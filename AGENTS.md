<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Chat-Ease Development Guidelines

## 1. Theming and UI Consistency
- Always adhere to the established project theme (e.g., dark aesthetics, glassmorphism, glowing accents, and smooth transitions).
- **CRITICAL RULE**: Do not use hardcoded Tailwind color classes (like `teal-500` or `blue-900`). Instead, always use the semantic `primary-*` utility classes (e.g., `bg-primary-950`, `text-primary-400`).
- The semantic theme colors are defined in `app/globals.css` using CSS variables. Changing the variables in `globals.css` should automatically update the theme across the entire application without needing to modify components.

## 2. Reusable and Modular Code
- Write clean, highly reusable code. If a UI element or logic block is used in more than one place, extract it into a shared component or utility function.
- **Do not write long, monolithic components.** Keep components short, modular, and focused on a single responsibility.
- Break down complex pages into smaller sub-components (placed in the appropriate `components/` directory) to keep the codebase easy to read, navigate, and maintain over time.

## 3. Code Quality
- Ensure strict TypeScript typing.
- Handle loading, error, and success states gracefully to ensure a robust user experience.
- Maintain consistent formatting and keep logic clean and predictable.
