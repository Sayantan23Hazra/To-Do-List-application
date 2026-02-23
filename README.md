# To-Do List Application (Week 6 Assignment)

A micro-frontend style To-Do List application built with Vue 3, Pinia, Element Plus, and Vite.

## Tech Stack

- Vue 3
- Pinia (state management)
- Element Plus (UI library)
- Vite (build tool)

## Features

- Add new tasks
- Mark tasks as done / undone
- Update existing task text (inline edit)
- Remove specific tasks
- Clear all tasks
- Persistent storage using `localStorage` so tasks survive page refreshes

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Then open the printed local URL (by default `http://localhost:5173`) in your browser.

## Micro-Frontend Usage (Library Build)

The Vite config is set up to build this app as a small library bundle, which can be hosted and consumed as a micro-frontend. To build:

```bash
npm run build
```

This produces an embeddable bundle under `dist/` that exposes the `Todo` entry.
