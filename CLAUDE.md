# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

An AI-powered learning platform that enables users to create personalized learning sessions. Users provide a topic prompt, and the system generates structured learning modules with AI-assisted chat interactions for each module.

## Tech Stack

- **Frontend**: React 19.0.0, TypeScript 5, Tailwind 3.4.18, shadcn/ui, Next.js 16.0.4 (App Router)
- **Backend**: Next.js Server Actions, Prisma 6.19.0 (ORM)
- **Database**: PostgreSQL (hosted on Neon)
- **Authentication**: NextAuth 5.0.0-beta.29
- **AI**: LangChain (@langchain/openai) with ChatOpenAI (gpt-4o-mini default)
- **State Management**: TanStack Query 5.90.8 (React Query)
- **Form Handling**: React Hook Form 7.65.0 with Zod 4.1.12 validation
- **Testing**: Vitest 4.0.1, @testing-library/react 16.3.0, jsdom 27.0.1

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Run tests with Vitest
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Database Commands

```bash
# Generate Prisma Client after schema changes
npx prisma generate

# Create and apply migrations
npx prisma migrate dev --name <migration_name>

# Open Prisma Studio (database GUI)
npx prisma studio

# Push schema changes without creating migrations (development only)
npx prisma db push

# Clean database (delete all data)
npm run clean

# Seed database with test data
npm run seed
```

## Architecture

This full-stack application follows a three-layer architectural pattern:

1. **Server Actions** (`src/lib/actions/`): Next.js server actions containing business logic
2. **Custom Hooks**: React Query abstractions that wrap server actions
3. **Components**: UI components that consume hooks for data and mutations

### Database Schema Hierarchy

The application follows a hierarchical data model:

```
User
   LearningSession (1:many)
       name, description, originalPrompt
       Module (1:many)
           name, overview, content, order, isComplete
           messages: Json[]              # Stored as JSON array
           currentFollowUps: Json[]      # AI-generated follow-up questions
```

**Key Schema Details**:
- All IDs use UUID (`@db.Uuid`)
- PostgreSQL column names use snake_case (e.g., `user_id`, `learning_session_id`)
- Prisma models use camelCase with `@map()` directives
- Chat messages stored as JSON array in Module table (not separate table)
- NextAuth models: Account, Session, VerificationToken

### Server Actions Layer

The application is organized by feature with server actions in `src/lib/actions/`:

#### Session Actions (`sessionActions.ts`)
- `createLearningSession({ userId, topic, description?, length?, complexity? })` - Creates session with AI-generated modules
- `getLearningSessions(userId)` - Retrieves all user sessions
- `getLearningSessionById(sessionId)` - Retrieves single session with modules
- AI Integration: Uses LLMProvider with `gpt-4o-mini` to generate 3-5 modules
- Parameters:
  - `length`: short | medium | long (affects module count)
  - `complexity`: beginner | intermediate | advanced (affects content depth)

#### Module Actions (`moduleActions.ts`)
- `getModules(sessionId)` - Returns all modules for a session
- `getModuleById(moduleId)` - Returns module with session context
- `toggleModuleCompletion(moduleId)` - Toggles module completion status

#### Chat Actions (`chatActions.ts`)
- `getMessages(moduleId, userId)` - Retrieves chat messages from Module.messages JSON
- `addMessage(moduleId, message, userId)` - Appends message to JSON array
- `createFollowUpQuestions(moduleId, userId)` - Generates follow-up questions via LangChain
- Real-time AI responses streamed via SSE API route (`src/app/api/chat/route.ts`)

#### User Actions (`userActions.ts`)
- `getUser(userId)` - Fetches user profile
- `updateUserProfile(userId, data)` - Updates name, bio, or image

### AI Integration Layer

**LangChain** (`@langchain/openai`):
- `ChatOpenAI` used for all LLM calls (chat streaming, follow-up questions, course generation)
- No custom abstraction layer — uses LangChain directly

**SSE Chat Streaming** (`src/app/api/chat/route.ts`):
- POST endpoint that streams AI responses via Server-Sent Events
- Saves messages to DB, builds LangChain message history, streams response chunks
- Client reads stream via `fetch()` + `ReadableStream` reader

**Prompts** (`src/lib/prompts/`):
- Centralized prompt management via `getPrompt()` function
- Prompts organized by feature (tutor system prompt, follow-up questions)

### Project Structure

```
src/
   app/                            # Next.js App Router
       layout.tsx                  # Root layout
       page.tsx                    # Landing page
       providers.tsx               # React Query provider
       MarkdownRenderer.tsx        # Markdown/LaTeX renderer for module content

       api/auth/[...nextauth]/     # NextAuth endpoints
       api/chat/route.ts           # SSE streaming chat endpoint

       home/                       # Home page (session list)
           page.tsx
           hooks.ts                # useGetSessions, useCreateSession
           components/
               SessionCard.tsx
               AddSessionButton.tsx

       session/[sessionId]/        # Session detail page (module list)
           page.tsx
           hooks.ts
           components/
               ModuleCard.tsx
               ModuleList.tsx
               SessionDescription.tsx
               SessionProgressBar.tsx

           module/[moduleId]/      # Module page (chat + content)
               page.tsx
               hooks.ts
               components/
                   Content.tsx
                   SessionHeader.tsx
                   ai_pane/
                       AIPane.tsx
                       AIPaneInput.tsx
                       ChatMessage.tsx
                       FollowUpQuestions.tsx

   components/
       Header.tsx                  # Global header with auth dropdown
       ui/                         # shadcn/ui components

   lib/
       db.ts                       # Prisma client singleton
       auth.ts                     # NextAuth configuration
       api.ts                      # API utilities for client-side calls
       utils.ts                    # cn() for class merging

       actions/                    # Server actions
           sessionActions.ts
           moduleActions.ts
           chatActions.ts
           userActions.ts
           __tests__/              # Action tests

       ai/
           types.ts                # Message type, providers map

       prompts/
           index.ts                # Prompt loading and parsing
           tutorSystemPrompt.md    # AI tutor system prompt
           followUpQuestions.md    # Follow-up question generation prompt

   hooks/
       useGetUser.ts               # Get current user from NextAuth
prisma/schema.prisma               # Database schema
scripts/                           # Database utilities (clean, seed, test)
```

**Path Aliases**: `@/*` maps to `./src/*` (configured in tsconfig.json)

### Hooks Pattern

Each page defines custom React Query hooks in a co-located `hooks.ts` file:
- Hooks wrap server actions with `useQuery` or `useMutation`
- Handle loading states, error handling, cache invalidation, and navigation
- Example: `src/app/home/hooks.ts` exports `useGetSessions()` and `useCreateSession()`

## SSE Chat Streaming

AI chat responses are streamed via Server-Sent Events through a Next.js API route:

**Endpoint**: `POST /api/chat` (`src/app/api/chat/route.ts`)
- Request: `{ moduleId, message, userId, model? }`
- Auth: Validates NextAuth session
- Streams: `data: {"type":"chunk","content":"..."}\n\n`
- Event types: `chunk`, `complete`, `error`

**Client** (`useAIChat` hook in module page):
- Uses `fetch()` with `ReadableStream` reader
- Parses SSE events and updates streaming state
- Supports `AbortController` for cancellation

## Testing Framework

### Setup
- **Test Runner**: Vitest 4.0.1
- **Test Utilities**: @testing-library/react 16.3.0, @testing-library/user-event 14.6.1
- **Environment**: jsdom 27.0.1 (simulates browser environment)
- **Config**: `vitest.config.ts` - Node environment, global test utilities, v8 coverage provider
- **Setup File**: `vitest.setup.ts` - Mocks environment variables (DATABASE_URL, OPENAI_API_KEY)

### Test Organization
All server action tests are located in `src/lib/actions/__tests__/`:
- `chatService.test.ts` - Chat message handling tests
- `sessionService.test.ts` - Session creation and AI generation tests
- `moduleService.test.ts` - Module management and completion tests
- `userService.test.ts` - User profile CRUD tests
- Database tests: `src/lib/__tests__/db.test.ts`

### Mocking Patterns
- **Prisma**: Mocked via `vi.mock('@/lib/db')` with `vi.mocked(prisma.model.method)`
- **LangChain**: Mock `@langchain/openai` ChatOpenAI class
- **Environment Variables**: Set in `vitest.setup.ts` to avoid missing .env in CI/CD

### Running Tests
```bash
npm test                 # Run all tests
npm run test:ui          # Run with Vitest UI
npm run test:coverage    # Run with coverage report
```

## AI Integration

**Model**: gpt-4o-mini (fast and cost-effective for educational content)

**LangChain Integration**:
- `ChatOpenAI` from `@langchain/openai` used for all LLM calls
- Course generation uses dedicated LangChain agents (`src/lib/course_generation/`)
- Chat streaming and follow-up questions use `ChatOpenAI` directly

**Prompts**:
- Centralized in `src/lib/prompts/index.ts` via `getPrompt()` function
- Markdown template files with `{{variable}}` interpolation

**Streaming Flow**:
1. User sends message via `fetch('/api/chat')`
2. API route saves message, builds LangChain messages, calls `chatModel.stream()`
3. Chunks sent as SSE events (`data: {"type":"chunk","content":"..."}\n\n`)
4. Complete message saved to DB, `complete` event sent to client

**Module Content Rendering**:
- Markdown rendered with `react-markdown`
- LaTeX math support via `remark-math` and `rehype-katex`
- Code syntax highlighting via `react-syntax-highlighter`
- GFM (GitHub Flavored Markdown) support via `remark-gfm`

## Environment Variables

Required in `.env`:
```
DATABASE_URL="postgresql://..."           # Neon PostgreSQL connection string
OPENAI_API_KEY="sk-..."                   # OpenAI API key
AUTH_SECRET="..."                         # NextAuth secret (generate with `openssl rand -base64 32`)
NEXTAUTH_URL="http://localhost:3000"      # Application URL
```

**Note**: `vitest.setup.ts` mocks these for testing to avoid requiring .env in CI/CD environments.

## Important Notes

### Authentication
- Uses NextAuth 5 (beta) with Google OAuth provider
- Session handling via database sessions (not JWT)
- Auth configuration in `src/lib/auth.ts`
- Protected routes check session via `auth()` from NextAuth

### Database
- All operations go through Prisma ORM
- Connection pooling enabled
- UUIDs for all primary keys
- JSON columns for messages and follow-up questions (not separate tables)

### Real-Time Features
- AI chat streaming via SSE (Server-Sent Events) through `/api/chat` route
- Single `npm run dev` process — no separate server needed
- Auto-generates follow-up questions after each AI response

### TypeScript
- Strict mode enabled
- Path alias `@/*` for `./src/*`
- Server actions must have `'use server'` directive
- Client components must have `'use client'` directive

### UI Components
- shadcn/ui components in `src/components/ui/`
- Tailwind CSS 3.4.18 (not v4)
- `cn()` utility in `src/lib/utils.ts` for class merging
- Lucide React for icons

### Data Flow Pattern
1. User interacts with component
2. Component calls custom hook (React Query)
3. Hook calls server action
4. Server action performs business logic with Prisma
5. React Query handles caching, loading states, and revalidation
