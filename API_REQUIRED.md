# Civic Issue Reporting System - API Contract

## 1. Base Configuration

- **Frontend Origin**: `http://localhost:5173`
- **Backend Base URL**: `http://localhost:8000/api`

All API calls use this base URL.

---

## 2. Authentication Endpoints

- `POST /auth/login`
- `POST /auth/register`
- `GET /users/me`

---

## 3. Issue Endpoints

- `GET /issues`
- `GET /issues/my`
- `GET /issues/{id}`
- `POST /issues`
- `PATCH /issues/{id}/status`
- `PATCH /issues/{id}/assign`

---

## 4. Response Format

All issue objects must explicitly follow this structure:

```json
{
  "id": number,
  "title": string,
  "description": string,
  "category": string,
  "priority": string,
  "status": string,
  "location_text": string,
  "assigned_to": number | null
}
```

---

## 5. Status Values

The `status` field strictly accepts only these values:

- `submitted`
- `assigned`
- `in_progress`
- `resolved`

---

## 6. Role Values

Supported user roles in the system:

- `citizen`
- `admin`
- `authority`

---

## 7. Environment Variables

**Frontend `.env` file structure:**
```env
VITE_API_URL=http://localhost:8000/api
```

**Frontend implementation:**
```js
const BASE_URL = import.meta.env.VITE_API_URL;
```

---

## 8. Critical Notes for Backend Team

- **Do NOT** change field names in the JSON structures.
- Follow the exact response format defined above.
- Ensure **CORS** allows the frontend origin: `http://localhost:5173`
- Return standardized **JSON responses** ONLY.
