# Virtual Wellness Platform

A React-based appointment management system for wellness professionals to manage clients and schedule appointments.

## Setup Instructions

### Prerequisites

- Node.js 20 or higher
- npm (comes with Node.js)
- Rails backend running on port 3000 (separate repository)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/mani444/appointments_system_FE.git
cd appointments_system_fe
```

2. Install dependencies:

```bash
npm install
```

3. Create environment file:

```bash
# Create .env file in project root
echo "VITE_API_URL=http://localhost:3000" > .env
```

4. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Available Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Tech Stack

- **React 19.1.0** - Frontend framework
- **TypeScript 5.8.3** - Type safety
- **Vite 5.4.19** - Build tool and development server
- **Tailwind CSS 3.4.17** - Styling
- **shadcn/ui** - UI component library
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Axios** - HTTP client
- **React Router DOM** - Client-side routing
- **React Context API** - State management

## Architecture Decisions

### State Management

Chose React Context API over Redux for simplicity. The application has straightforward state requirements that don't justify Redux's complexity.

### Form Handling

React Hook Form with Zod validation provides excellent developer experience and performance with minimal re-renders.

### API Integration

Custom hooks with Context providers abstract API complexity while providing clean interfaces to components.

## Assumptions Made

### Backend API

- Rails backend follows RESTful conventions
- API responses use format: `{ success: boolean, data: T, message?: string }`
- Error responses include `errors` array for validation failures
- CORS is configured to allow frontend requests

### Business Logic

- Email addresses must be unique across clients
- Appointments can be edited and cancelled
- Time slots don't have conflict validation
- Client search should work across name, email, and phone

## API Integration

The frontend connects to a Rails backend through a service layer:

### Error Handling Strategy

1. **Client-side validation** - Immediate feedback using Zod schemas
2. **API error parsing** - Axios interceptors convert backend errors to user-friendly messages
3. **Graceful degradation** - App shows friendly errors when backend is unavailable
4. **Duplicate prevention** - Email uniqueness checked both client and server-side

### Service Layer

- `clientsApi` - CRUD operations for client management
- `appointmentsApi` - CRUD operations for appointment scheduling
- Centralized error handling and response formatting

## Current Implementation

### ✅ Core Features

- Display list of clients (name, email, phone)
- Show upcoming appointments
- Schedule new appointments
- Edit existing appointments
- Cancel appointments with confirmation
- Search/filter clients

### ✅ Technical Features

- Fully responsive design
- TypeScript throughout
- Form validation with error handling
- Loading states and error boundaries
- Clean component architecture

## Time Spent

- **Initial setup and architecture**: 2 hours
- **Core client management**: 2 hours
- **Appointment scheduling system**: 3 hours
- **Form validation and error handling**: 1.5 hours
- **UI/UX polish and responsiveness**: 1 hour
- **API integration and testing**: 1.5 hours
- **Code cleanup and documentation**: 1 hour

**Total: ~12 hours**
