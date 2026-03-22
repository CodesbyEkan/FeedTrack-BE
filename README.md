# FeedTrack-BE — Testing Guide

## Step 1 — Set up your .env file

Copy `.env.example` to `.env` and fill in your values:

```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/feedtrack
JWT_SECRET=any_long_random_string_here
EXPIRE_COOKIE=3
CLIENT_ORIGIN=http://localhost:5173
```

> ⚠️  Rotate your old MongoDB URI and JWT_SECRET — they were committed in git.
> Generate a new secret with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

---

## Step 2 — Install dependencies and start the server

```bash
npm install
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB connected successfully by <host>
```

If you see a port error, change PORT in .env. If you see a MongoDB error, check your MONGO_URI.

---

## Step 3 — Test with a REST client

Use one of:
- **Bruno** (recommended, free, offline) — https://www.usebruno.com
- **Postman** — https://www.postman.com
- **Insomnia** — https://insomnia.rest
- **curl** (command line, examples below)

Set the base URL to: `http://localhost:5000`

---

## Step 4 — Test every endpoint in order

Work through these in sequence — each step produces data needed by the next.

---

### AUTH

#### 1. Sign up as a business owner

```
POST /api/v1/auth/signup-owner
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@mybusiness.com",
  "password": "password123",
  "businessName": "Grand Hotel Lagos",
  "businessType": "Hotel",
  "businessPhone": "+2348012345678"
}
```

✅ Expect: `201` with `success: true`, `user` object, and `accessToken`.
❌ Try again with the same email — expect `400 User already Exists`.
❌ Try with a short password (< 6 chars) — expect `422` validation error.

Save the `accessToken` from the response — you need it for all protected routes.

---

#### 2. Log in

```
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@mybusiness.com",
  "password": "password123"
}
```

✅ Expect: `200` with a new `accessToken`.
❌ Wrong password — expect `401 Invalid Email or password`.
❌ Empty fields — expect `422` validation error.

---

#### 3. Get current user (protected)

```
GET /api/v1/auth/me
Authorization: Bearer <your_token>
```

✅ Expect: `200` with your user object.
❌ No token — expect `401`.
❌ Fake token — expect `401 Invalid or expired token`.

---

#### 4. Create a staff member (protected, owner only)

```
POST /api/v1/auth/staff
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@mybusiness.com",
  "password": "staffpass123"
}
```

✅ Expect: `201` with new staff user.
Save Jane's user ID — you'll need it to test complaint assignment.

---

#### 5. Log out

```
POST /api/v1/auth/logout
Authorization: Bearer <your_token>
```

✅ Expect: `200 Logged out successfully`. Cookie is cleared.

---

### FEEDBACK (no auth required for submission — simulates guest QR scan)

You need your business ID. Get it from Step 1's response: `user.business`.

---

#### 6. Submit a complaint (public — no token needed)

```
POST /api/v1/feedbacks
Content-Type: application/json

{
  "businessId": "<your_business_id>",
  "type": "complaint",
  "guestName": "Michael A.",
  "message": "The room was not cleaned when I arrived."
}
```

✅ Expect: `201` with the new feedback object.
Save the feedback `_id` — you'll need it below.

---

#### 7. Submit a compliment

```
POST /api/v1/feedbacks
Content-Type: application/json

{
  "businessId": "<your_business_id>",
  "type": "compliment",
  "guestName": "Sarah B.",
  "message": "The front desk staff were incredibly helpful."
}
```

✅ Expect: `201`.

---

#### 8. Submit a suggestion

```
POST /api/v1/feedbacks
Content-Type: application/json

{
  "businessId": "<your_business_id>",
  "type": "suggestion",
  "message": "It would be great to have a pool on the rooftop."
}
```

✅ Expect: `201`. Note: `guestName` is optional.

---

#### 9. Get all feedback for your business (protected)

```
GET /api/v1/feedbacks/business/all
Authorization: Bearer <your_token>
```

✅ Expect: `200` with array of all 3 feedbacks you submitted.

---

#### 10. Get feedbacks by type (protected)

```
GET /api/v1/feedbacks/complaints
GET /api/v1/feedbacks/compliments
GET /api/v1/feedbacks/suggestions
```
Add `Authorization: Bearer <your_token>` to each.

✅ Each should return only feedbacks of that type.

---

#### 11. Get a single feedback (protected)

```
GET /api/v1/feedbacks/<feedback_id>
Authorization: Bearer <your_token>
```

✅ Expect: `200` with the full feedback object.
❌ Fake ID — expect `400` or `404`.

---

#### 12. Assign a complaint to staff (protected)

```
PUT /api/v1/feedbacks/assign/complaint
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "feedbackId": "<your_complaint_feedback_id>",
  "staffId": "<jane_smith_user_id>",
  "notes": "Guest reported this at 2pm. Please follow up."
}
```

✅ Expect: `200`. Feedback status changes to `in-progress`.
❌ Try assigning a compliment — expect `400 Only complaints can be assigned`.

---

#### 13. Get in-progress complaints (protected)

```
GET /api/v1/feedbacks/complaints/in-progress
Authorization: Bearer <your_token>
```

✅ Expect: the complaint you just assigned.

---

#### 14. Get open complaints (protected)

```
GET /api/v1/feedbacks/complaints/open
Authorization: Bearer <your_token>
```

✅ Should be empty now (the one complaint was moved to in-progress).

---

#### 15. Resolve a complaint (protected)

```
PUT /api/v1/feedbacks/resolve/complaint
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "feedbackId": "<your_complaint_feedback_id>",
  "notes": "Housekeeping attended to the room. Guest was satisfied."
}
```

✅ Expect: `200`. Feedback status changes to `resolved`, `resolvedAt` is set.

---

#### 16. Get resolved complaints (protected)

```
GET /api/v1/feedbacks/complaints/resolved
Authorization: Bearer <your_token>
```

✅ Expect: the complaint you just resolved.

---

#### 17. Get your staff (protected)

```
GET /api/v1/feedbacks/staff
Authorization: Bearer <your_token>
```

✅ Expect: list of staff users for your business.

---

### NOTIFICATIONS

When you submitted feedback in Step 6, a notification was created for the owner.

---

#### 18. Get all notifications (protected)

```
GET /api/v1/notifications
Authorization: Bearer <your_token>
```

✅ Expect: list of notifications. You should see a `new_feedback` notification.
Save the notification `_id`.

---

#### 19. Get a single notification (protected)

```
GET /api/v1/notifications/<notification_id>
Authorization: Bearer <your_token>
```

✅ Expect: `200` with the notification. Note `read: false`.

---

#### 20. Mark notification as read (protected)

```
PATCH /api/v1/notifications/<notification_id>/read
Authorization: Bearer <your_token>
```

✅ Expect: `200`. Notification now has `read: true`.
❌ Call it again — expect `400 Notification already marked as read`.

---

### QR CODE

---

#### 21. Generate a QR code

```
GET /api/v1/qr/<your_business_id>
```

No auth needed. Open in a browser — you'll see a JSON response with a base64-encoded QR image.

✅ Expect: `200` with `qrCode` (data URL) and `link`.
Paste the `link` value into a browser to simulate a guest scanning the QR code.

---

### REAL-TIME (Socket.io)

To test real-time events, open the `guestpulse/index.html` file in a browser while the server is running.

1. Log in with your owner account.
2. In a second browser tab, open `index.html?businessId=<your_business_id>` (simulates a guest).
3. Submit feedback as the guest.
4. In the first tab (dashboard), you should see a toast notification appear instantly — no page refresh needed.

Alternatively, use a Socket.io test client:
- Go to https://amritb.github.io/socketio-client-tool/
- Connect to `http://localhost:5000`
- Emit `join` with your user ID as a string
- Submit feedback via Postman and watch the `new-notification` event arrive

---https://guestpulse-hospitality-management.netlify.app/?businessId=69be2b0414560af2d32553b9

## Step 5 — Test the frontend

```bash
# From the project root, open the frontend directly in your browser:
open guestpulse/index.html
# or on Windows:
start guestpulse/index.html
```

Walk through the full user journey:
1. Create an account (fills onboarding steps 1–4)
2. View the generated QR code on step 4
3. Open a second tab with `?businessId=<id>` to simulate a guest
4. Submit feedback as the guest
5. Back on the dashboard, see the complaint appear
6. Click it, assign a staff member, resolve it
7. Check the Analytics screen

---

## Common errors and fixes

| Error | Cause | Fix |
|---|---|---|
| `Cannot connect to MongoDB` | Wrong MONGO_URI or IP not whitelisted | Check Atlas → Network Access → add your IP |
| `JWT malformed` | Token copied incorrectly | Re-login and copy the full token |
| `401 Authentication missing` | Forgot the Authorization header | Add `Authorization: Bearer <token>` |
| `404 on /business/feedback` | Old route — renamed | Use `/feedbacks/business/all` |
| `Route not found` | Wrong base URL | All routes start with `/api/v1/` |
| Socket events not firing | Double server bug (pre-fix) | Make sure you're using the fixed `server.js` and `app.js` |
