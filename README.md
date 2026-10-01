# Jindal Employee Health Dashboard

Replaces the manual process at Jindal Shadeed Iron & Steel where employees carry paper/PDF checkup reports from Aster Hospital to the company nurse, who retypes findings into a personal Excel sheet. This project tracks employee health records in a proper system, with admin-configurable role access.

**Status: planning only.** No build work (data tables, workflows, app code) has started. See the open-questions section in the plan below before anything gets built.

## Roles

- **Employee** — views own report details, profile, upcoming appointments, and trends over their own reports.
- **Doctor** — uploads checkup reports (findings, file, date) for an employee.
- **Admin** — searches any employee's report, views stats, flagged employees, missed checkups, sends reminders, tracker board.
- **Super Admin** — manages what Admin can see and do (access is a setting, not a fixed tier).

## Planning doc

- [`docs/flow-and-information-architecture.md`](docs/flow-and-information-architecture.md) — static export: problem statement, roles/access, entities and fields, screens per role, open questions.
- Live version (with the interactive flow diagram): https://claude.ai/artifact/YLSspRx3EJHfw4v1jtArJs

## Hosting

Pilot runs on a personal n8n Cloud account, with a planned migration to Jindal-owned infrastructure before a full rollout — see "Data residency" in the open questions.

## Repo layout (as the project grows)

```
docs/       planning docs, architecture notes
n8n/        exported n8n workflow/data-table definitions (once build starts)
```
