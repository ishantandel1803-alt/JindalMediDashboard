# Jindal Employee Health Dashboard — Flow & Information Architecture

Oct 2, 2026 · @PickSipGo

## The problem

Every employee gets an annual medical checkup at Aster Hospital. Aster hands the employee their report. The employee carries it to the company nurse, who reads it and retypes the relevant fields into a personal Excel sheet. That sheet is the only record of who's compliant and who isn't.

This breaks in predictable ways: nobody outside the nurse can see compliance status without asking her directly; manual retyping introduces errors with no way to catch them; there's no automatic flag when someone's next checkup is overdue; the entire record lives in one person's local file with no backup, no audit trail, and no access control beyond "don't open my laptop."

## Roles and access

Access stays admin-configurable rather than hardcoded: a Super Admin screen lets the sponsor adjust who can do what as the pilot proves itself out, without a rebuild. Four roles:

| Role | View full report detail | View status only | Upload a report | Search / stats / flags / reminders | Manage Admin access |
| --- | --- | --- | --- | --- | --- |
| Employee | Own record only | Own record only | No | No | No |
| Doctor | Yes, all | Yes, all | Yes | No | No |
| Admin | No (default) | Yes, all | No | Yes | No |
| Super Admin | Configurable | Configurable | Configurable | Configurable | Yes |

Super Admin is the one role that can change what Admin can see and do — Admin's own access is itself a setting, not a fixed tier. Every toggle in this table is a setting, not a code change.

## End-to-end flow

> The live doc has an interactive diagram here (checkup-to-dashboard flow · 5 steps, 1 feedback loop). See the link in the repo README for the up-to-date version — diagrams don't export to markdown.

The doctor's upload is the only entry point now — no separate employee submission step. A flagged result routes to Admin, who sends a reminder and gets a new appointment booked, closing the loop; a normal result and a flagged-then-followed-up one both land on the dashboard. A background check still compares each employee's next-due date against today and surfaces who's missed their checkup, feeding Admin's reminder list.

## Information architecture: entities, fields, relationships

Five entities carry the whole system. Everything else in the product is a view over these.

**Employee**

| Field | Notes |
| --- | --- |
| id |  |
| name, department, job title |  |
| next checkup due date | drives the overdue flag and Admin's reminder list |

**Appointment**

| Field | Notes |
| --- | --- |
| id |  |
| employee (ref) |  |
| doctor (ref, optional) |  |
| date, purpose | checkup or follow-up |
| status | scheduled, completed, missed — missed drives Admin's reminder list |

**Health report** — one row per checkup

| Field | Notes |
| --- | --- |
| id |  |
| employee (ref) |  |
| appointment (ref, optional) | the appointment it was produced from |
| checkup date |  |
| uploaded file | the original PDF/scan |
| full report detail | findings as entered by the doctor |
| status | normal, or flagged for follow-up |
| uploaded by (ref: Doctor) |  |
| uploaded at |  |
| doctor notes |  |

**User**

| Field | Notes |
| --- | --- |
| id |  |
| name, email |  |
| linked employee (ref, optional) | set when the user is also an employee getting checkups |
| role (ref: Role) |  |

**Role** — managed by Super Admin, not hardcoded

| Field | Notes |
| --- | --- |
| id, name | Employee, Doctor, Admin, Super Admin — Super Admin can add more |
| permission flags | view full detail, view status only, upload a report, search/stats/flags/reminders, manage Admin access |

Relationships: an Employee has many Appointments and many Health reports. A Health report is uploaded by a Doctor and optionally traces back to the Appointment it came from. A missed Appointment is what feeds Admin's reminder list, and a flagged Health report is what sends an employee back for a new Appointment. A User has one Role, and a Role carries the permission flags from the table above — so Super Admin adjusting what Admin can do is an edit to the Role record, not a code change.

## Screens: what pages/views exist for each role

**Employee**

- Report details: view own past reports and findings.
- Profile overview: own basic info and current status.
- Upcoming appointments: scheduled checkups and follow-ups.
- Analyse report: trends across your own reports over time.

**Doctor**

- Upload report: pick the employee (and appointment, if there is one), attach the checkup file, enter findings and date; status (normal or flagged) is set from what's entered.

**Admin**

- Search: look up any employee's report by name or department.
- Stats: aggregate compliance numbers across the company.
- Flagged employees: list of reports flagged for follow-up.
- Missed checkups: who's overdue or missed an appointment, with a button to send a reminder.
- Tracker board: a board view of report and appointment status across employees.

**Super Admin**

- Admin access: grant or adjust what Admin (and other roles) can see and do, via the permission flags above.

## Open questions and decisions still needed before build

- **Data residency**: this pilot sits on a personal n8n Cloud account. Real employees' medical data is involved from day one, not just the pilot phase — what's the plan and timeline for moving to Jindal-owned infrastructure, and is personal-account hosting acceptable to whoever authorized this in the meantime?
- **File storage**: where do uploaded reports (the actual files) live — inside n8n, or a separate storage service n8n writes to?
- **Identity**: how do employees and the nurse log in — existing Jindal accounts (SSO) or new credentials created for this system?
- **Extracted vs. typed findings**: does the nurse retype findings from the PDF into structured fields (closest to today's process), or does the system just store the file and let her add a status + notes on top?
- **Overdue checkup cadence**: is the checkup interval the same for every employee (e.g. annual), or does it vary by role/exposure, which would change how "next checkup due" gets set?
- **Notifications**: who gets notified when a report is confirmed, needs resubmission, or goes overdue — the employee, the nurse, both?
- **Resubmission path**: when the nurse sends a report back, does the employee upload a fresh file, or edit the same submission?

No build work — data tables, workflows, or anything else — starts until these are talked through and you give the go-ahead.
