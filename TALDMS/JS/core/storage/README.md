# Enterprise Storage Package

## Purpose

The Enterprise Storage Package provides a storage abstraction layer for all
TESDA Albay Enterprise applications.

Business modules never access Local Storage, IndexedDB, or databases directly.

All storage operations must go through the Storage Service.

## Architecture

Business Module

↓

Storage Service

↓

Storage Provider

↓

Storage Medium

## Current Provider

- Local Storage

## Future Providers

- IndexedDB
- SQLite
- SQL Server
- REST API
- Firebase

## Development Rule

Business modules must never call:

localStorage

directly.

Always use:

TAESF.Services.Storage