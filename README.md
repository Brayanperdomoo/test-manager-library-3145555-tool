# Manager Library Demo Seeder

Utilities for loading demonstration data into Manager Library through the public API. The tool must never write directly to the database.

## Requirements

- Call the Laravel API using its HTTP contract
- Load at least 40 books, 10 members, and 15 loans, including 3 overdue loan items
- Keep all documentation, output, and diagnostics in English
- Read the API base URL and credentials from environment variables

## Development status

Implementation is in progress. The seeder should be repeatable where practical, report failures clearly, and avoid logging passwords or tokens.

## Related repositories

- [Product specification](https://github.com/code-sena/test-manager-library-3145555-docs)
- `test-manager-library-3145555-api` — Laravel backend
- `test-manager-library-3145555-infra` — local containers and PostgreSQL
