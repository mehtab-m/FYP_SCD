# FYP Committee Dashboard - API Documentation

This document outlines all the API endpoints required for the FYP Committee Dashboard functionality.

## Base URL
All endpoints are prefixed with `/api/admin`

---

## 1. Get Project Registrations

**Endpoint:** `GET /api/admin/projects/registrations`

**Description:** Retrieves all project registrations submitted by student groups. This endpoint should return projects with their group details, supervisor preferences, and current status.

**Request:** No parameters required

**Response Format:**
```json
[
  {
    "id": 1,
    "title": "AI-Powered Learning Management System",
    "abstractText": "A comprehensive system for managing online learning...",
    "status": "pending", // Options: "pending", "accepted", "rejected", "approved"
    "groupId": 5,
    "groupMembers": [
      {
        "id": 101,
        "name": "John Doe",
        "email": "john.doe@university.edu",
        "semester": "5th",
        "isLeader": true
      },
      {
        "id": 102,
        "name": "Jane Smith",
        "email": "jane.smith@university.edu",
        "semester": "5th",
        "isLeader": false
      },
      {
        "id": 103,
        "name": "Bob Johnson",
        "email": "bob.johnson@university.edu",
        "semester": "5th",
        "isLeader": false
      },
      {
        "id": 104,
        "name": "Alice Williams",
        "email": "alice.williams@university.edu",
        "semester": "5th",
        "isLeader": false
      }
    ],
    "supervisorPreferences": [
      {
        "preferenceOrder": 1,
        "supervisorId": 10,
        "supervisorName": "Dr. Sarah Ahmed",
        "supervisorEmail": "sarah.ahmed@university.edu"
      },
      {
        "preferenceOrder": 2,
        "supervisorId": 15,
        "supervisorName": "Dr. Muhammad Ali",
        "supervisorEmail": "muhammad.ali@university.edu"
      },
      {
        "preferenceOrder": 3,
        "supervisorId": 20,
        "supervisorName": "Dr. Fatima Khan",
        "supervisorEmail": "fatima.khan@university.edu"
      }
    ],
    "assignedSupervisor": {
      "id": 10,
      "name": "Dr. Sarah Ahmed",
      "email": "sarah.ahmed@university.edu"
    },
    "rejectionReason": null // Only present if status is "rejected"
  }
]
```

**Notes:**
- Each project must have exactly 3 supervisor preferences (1st, 2nd, 3rd)
- Group must have exactly 4 members (1 leader + 3 members)
- If project is rejected, include `rejectionReason` field
- If supervisor is assigned, include `assignedSupervisor` object

---

## 2. Get Available Supervisors

**Endpoint:** `GET /api/admin/supervisors/available`

**Description:** Retrieves all available supervisors that can be assigned to projects.

**Request:** No parameters required

**Response Format:**
```json
[
  {
    "id": 10,
    "name": "Dr. Sarah Ahmed",
    "email": "sarah.ahmed@university.edu",
    "department": "Computer Science"
  },
  {
    "id": 15,
    "name": "Dr. Muhammad Ali",
    "email": "muhammad.ali@university.edu",
    "department": "Software Engineering"
  }
]
```

---

## 3. Assign Supervisor to Project

**Endpoint:** `POST /api/admin/projects/assign-supervisor`

**Description:** Assigns a supervisor to a project. This can be done before or after accepting the project.

**Request Body:**
```json
{
  "projectId": 1,
  "supervisorId": 10
}
```

**Request Parameters:**
- `projectId` (Long, required): The ID of the project
- `supervisorId` (Long, required): The ID of the supervisor to assign

**Response Format:**
```json
{
  "success": true,
  "message": "Supervisor assigned successfully",
  "assignedSupervisor": {
    "id": 10,
    "name": "Dr. Sarah Ahmed",
    "email": "sarah.ahmed@university.edu"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message here"
}
```

**Business Rules:**
- Supervisor must exist and be available
- Project must exist
- Supervisor can be assigned even if project status is "pending"
- If supervisor is already assigned, update the assignment

---

## 4. Accept Project Registration

**Endpoint:** `POST /api/admin/projects/accept`

**Description:** Accepts a project registration. This changes the status from "pending" to "accepted".

**Request Body:**
```json
{
  "projectId": 1
}
```

**Request Parameters:**
- `projectId` (Long, required): The ID of the project to accept

**Response Format:**
```json
{
  "success": true,
  "message": "Project registration accepted successfully",
  "project": {
    "id": 1,
    "status": "accepted"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message here"
}
```

**Business Rules:**
- Project status must be "pending" to accept
- After acceptance, project status becomes "accepted"
- Supervisor can be assigned before or after acceptance

---

## 5. Reject Project Registration

**Endpoint:** `POST /api/admin/projects/reject`

**Description:** Rejects a project registration. This changes the status from "pending" to "rejected" and stores the rejection reason.

**Request Body:**
```json
{
  "projectId": 1,
  "reason": "Project does not meet the required standards. Please revise and resubmit."
}
```

**Request Parameters:**
- `projectId` (Long, required): The ID of the project to reject
- `reason` (String, required): The reason for rejection

**Response Format:**
```json
{
  "success": true,
  "message": "Project registration rejected successfully",
  "project": {
    "id": 1,
    "status": "rejected",
    "rejectionReason": "Project does not meet the required standards. Please revise and resubmit."
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message here"
}
```

**Business Rules:**
- Project status must be "pending" to reject
- Rejection reason is mandatory
- After rejection, project status becomes "rejected"
- Rejected projects should not be assignable to supervisors

---

## 6. Approve Project (Finalize)

**Endpoint:** `POST /api/admin/projects/approve`

**Description:** Approves a project after supervisor assignment. This finalizes the project and changes status from "accepted" to "approved". This action should only be possible after a supervisor has been assigned.

**Request Body:**
```json
{
  "projectId": 1
}
```

**Request Parameters:**
- `projectId` (Long, required): The ID of the project to approve

**Response Format:**
```json
{
  "success": true,
  "message": "Project approved successfully",
  "project": {
    "id": 1,
    "status": "approved",
    "assignedSupervisor": {
      "id": 10,
      "name": "Dr. Sarah Ahmed",
      "email": "sarah.ahmed@university.edu"
    }
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message here"
}
```

**Business Rules:**
- Project status must be "accepted" to approve
- Supervisor must be assigned before approval
- After approval, project status becomes "approved"
- Approved projects are finalized and cannot be modified

---

## Status Flow

The project status follows this flow:

1. **pending** → (Accept) → **accepted** → (Assign Supervisor) → (Approve) → **approved**
2. **pending** → (Reject) → **rejected**

**Important Notes:**
- Projects can have supervisor assigned at any point after acceptance
- Approval requires both acceptance AND supervisor assignment
- Rejected projects cannot be accepted or approved
- Once approved, project is finalized

---

## Error Handling

All endpoints should return appropriate HTTP status codes:
- `200 OK`: Successful operation
- `400 Bad Request`: Invalid request parameters
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

Error responses should follow this format:
```json
{
  "success": false,
  "message": "Descriptive error message"
}
```

---

## Database Considerations

### Project Status Enum
- `pending`: Initial status when project is registered
- `accepted`: Project has been accepted by FYP committee
- `rejected`: Project has been rejected by FYP committee
- `approved`: Project is finalized with supervisor assigned

### Required Fields
- Project must have: `id`, `title`, `abstractText`, `status`, `groupId`
- Group must have exactly 4 members
- Project must have exactly 3 supervisor preferences
- Supervisor preferences must have: `preferenceOrder` (1, 2, or 3), `supervisorId`, `supervisorName`, `supervisorEmail`

---

## Additional Notes for Backend Development

1. **Authentication**: All endpoints should require FYP Committee member authentication
2. **Authorization**: Verify that the user making the request has FYP Committee role
3. **Validation**: 
   - Validate project exists before any operation
   - Validate supervisor exists before assignment
   - Validate project status before status changes
4. **Notifications**: Consider sending notifications to students when:
   - Project is accepted/rejected
   - Supervisor is assigned
   - Project is approved
5. **Audit Trail**: Consider logging all status changes for audit purposes

