# Manager Library Demo Seeder

Node.js utility that creates demonstration books, members, and loans only through the Laravel API. It does not connect to PostgreSQL directly and does not print credentials or tokens.

## Run

Use Node.js 22.12 or newer. Set `API_BASE_URL` (default `http://localhost:8081/api/v1`), `ADMIN_USERNAME`, and `ADMIN_PASSWORD`, then run:

```powershell
npm run seed
```

The seeder reuses matching demo books and members and creates up to 40 books, 10 members, and 15 demo loans. The tool reports API errors in English.

## Acceptance evidence gap

The task asks for three overdue loan items, but the public contract sets `due_at` to the server time plus 14 days and does not accept a historical `loaned_at` or `due_at`. The seeder therefore cannot create overdue records immediately while honoring the API-only requirement. Add a controlled test-clock or documented demo-only API capability to the specification before claiming that acceptance criterion is met; this tool does not bypass the API to edit database rows.
