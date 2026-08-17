# Enterprise Registry

## Purpose

The Enterprise Registry is the central directory of the TESDA Albay Enterprise Core Platform (TAECP).

Its responsibility is to register and provide access to framework services, business modules, and future enterprise extensions.

The Registry contains no business logic.

## Responsibilities

- Register Enterprise Services
- Register Business Modules
- Prevent duplicate registrations
- Retrieve registered objects
- List registered objects
- Support future plugin architecture

## Public API

registerService()

getService()

hasService()

listServices()

registerModule()

getModule()

hasModule()

listModules()

## Development Rule

Business modules must never instantiate enterprise services directly.

Always obtain services through the Registry.