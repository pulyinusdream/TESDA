# Enterprise Authentication Package

## Purpose

Provides enterprise authentication for all TAESF applications.

The package is responsible for:

- Login
- Logout
- Session Management
- Current User
- Authentication State

It contains no user interface.

## Components

authentication.service.js

session.service.js

## Development Rule

Business modules must never manipulate session data directly.

Always use the Authentication Service.