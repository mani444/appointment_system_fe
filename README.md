# Virtual Wellness Platform

A modern wellness management platform built with React, TypeScript, Tailwind CSS, and shadcn/ui components.

## Tech Stack

- **React 19.1.0** with TypeScript 5.8.3
- **Vite 5.4.19** for build tooling and development server
- **Tailwind CSS 3.4.17** for styling
- **shadcn/ui 0.0.4** for component library
- **Lucide React 0.525.0** for icons
- **Radix UI** primitives for accessible components
- **Class Variance Authority** for component variants

## Prerequisites

- **Node.js 20** or higher
- **npm** (comes with Node.js)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/mani444/appointments_system_FE.git
cd virtual-wellness-platform
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) with your browser to see the application.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/
│   ├── ui/           # shadcn/ui components
│   └── Sidebar.tsx   # Custom components
├── pages/            # Page components
│   ├── UpcomingAppointments.tsx
│   ├── Clients.tsx
│   ├── AppointmentForm.tsx
│   └── ClientForm.tsx
├── layout/           # Layout components
│   └── Layout.tsx
├── lib/              # Utilities
│   └── utils.ts
└── App.tsx
```

## Features

- **Dashboard** - View upcoming appointments and wellness overview
- **Client Management** - Add, view, and search wellness clients
- **Appointment Scheduling** - Create, edit, and cancel appointments
- **Responsive Design** - Works on desktop and mobile devices

## Development

This project uses:

- **TypeScript** for type safety
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** components with CSS variables for theming

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request
