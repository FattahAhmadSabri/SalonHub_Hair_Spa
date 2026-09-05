# Fresha Salon

Fresha Salon is a full-stack salon management and appointment booking application. Customers can register, log in, browse salons and services, book appointments, make online payments, manage appointments, receive email notifications, and receive automated appointment reminders. Staff and admins can manage services and appointments according to their roles.

## Features

- User registration and login
- JWT authentication
- Role-based authorization
- Customer profile management
- Salon listing and salon details
- Salon image upload using AWS S3
- Service listing and service management
- Appointment booking and management
- Customer appointment history
- Cashfree online payment integration
- Payment status verification
- Email sending through Brevo
- Automated 1-hour appointment reminders using `node-cron`
- Reply/review-related functionality
- Admin and staff protected operations
- Admin dashboard for managing application data

## Tech Stack

### Backend

- Node.js
- Express.js
- Sequelize ORM
- MySQL
- JWT
- Multer
- Amazon S3
- Cashfree Payment Gateway
- Brevo Transactional Email
- node-cron

### Frontend

- HTML5
- CSS3
- JavaScript
- Axios
- Cashfree JavaScript SDK

## Project Structure

```text
Fresha_Saloon/
│
├── backend/
│   ├── controller/
│   ├── cron/
│   │   └── appointmentReminderCron.js
│   ├── middleware/
│   ├── model/
│   ├── route/
│   │   ├── saloonRoute.js
│   │   ├── userRoute.js
│   │   ├── appointmentRoute.js
│   │   ├── emailRoutes.js
│   │   ├── hairCuttingRoute.js
│   │   ├── paymentsRoute.js
│   │   └── replyRoute.js
│   ├── service/
│   ├── utils/
│   ├── .env
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── css/
    ├── js/
    ├── admin/
    ├── payments/
    ├── saloonWork/
    ├── index.html
    ├── login.html
    └── register.html
```

# API Documentation

> The endpoints below are the routes defined in the project. If a route file is mounted under an additional Express prefix in `server.js`, that prefix should be added before the endpoint.

## Authentication

### Register User

```http
POST /user/create
```

Authentication: Not required.

Creates a new customer account.

### Login User

```http
POST /user/login
```

Authentication: Not required.

Authenticates a user and returns the user information and JWT token.

### Update User

```http
PUT /user/update
```

Authentication: Required.

Updates the authenticated user's profile.

### Get All Users

```http
GET /user
```

Authentication: Not required in the current route definition.

Returns all users.

---

# Salon APIs

## Add Salon

```http
POST /saloon/add
```

Authentication: Required.

Middleware:
- JWT authentication
- Multipart image upload

Image field:

```text
image
```

Creates a salon and uploads its image.

## Get Salons by City

```http
GET /saloon/get
```

Authentication: Not required.

Returns salons based on the city/query handled by the controller.

## Get All Salons

```http
GET /saloon/all
```

Authentication: Not required.

Returns all salons.

## Get Salon by ID

```http
GET /saloon/get/:id
```

Authentication: Not required.

Returns details of a specific salon.

---

# Service APIs

Services are represented by the `saloon-service` endpoints.

## Add Service

```http
POST /saloon-service/add
```

Authentication: Required.

Allowed roles:

```text
admin
staff
```

Creates a salon service.

## Get All Services

```http
GET /saloon-service/all
```

Authentication: Not required.

Returns all salon services.

## Get Service by ID

```http
GET /saloon-service/:id
```

Authentication: Not required.

Returns a specific service.

## Update Service

```http
PUT /saloon-service/:id
```

Authentication: Required.

Allowed roles:

```text
admin
staff
```

Updates a service.

## Delete Service

```http
DELETE /saloon-service/:id
```

Authentication: Required.

Allowed roles:

```text
admin
staff
```

Deletes a service.

---

# Appointment APIs

## Create Appointment

```http
POST /appointment/add
```

Authentication: Required.

Creates an appointment for the authenticated customer.

## Get All Appointments

```http
GET /appointment
```

Authentication: Required.

Returns appointments according to the controller's implementation.

## Get User Appointments

```http
GET /appointment/user
```

Authentication: Required.

Returns appointments associated with the authenticated user.

## Get Appointment by ID

```http
GET /appointment/:id
```

Authentication: Required.

Allowed roles:

```text
user
staff
```

Returns a specific appointment.

## Update Appointment

```http
PUT /:id
```

Authentication: Required.

Allowed roles:

```text
staff
user
```

Updates an appointment.

> This route is currently defined exactly as `PUT /:id` in `appointmentRoute.js`. If the router is mounted at `/appointment`, the final URL will become `/appointment/:id`.

## Delete Appointment

```http
DELETE /appointment/:id
```

Authentication: Required.

Allowed roles:

```text
user
staff
admin
```

Deletes an appointment.

---

# Payment APIs

Cashfree is used for online payment processing.

## Create Cashfree Order

```http
POST /payments/create_order
```

Authentication: Required.

Creates a Cashfree payment order for an appointment.

## Get Cashfree Payment Status

```http
GET /payments/:orderId
```

Authentication: Required.

Fetches the Cashfree payment status and processes the payment result.

The payment flow is:

```text
Customer selects service
        ↓
Appointment created
        ↓
Cashfree order created
        ↓
Customer completes payment
        ↓
Payment status checked
        ↓
Payment record updated
        ↓
Appointment confirmed
```

---

# Email API

## Send Email

```http
POST /email
```

Authentication: Not required in the current route definition.

Used for sending emails through the application's email service.

Brevo is configured as the transactional email provider.

Environment variables:

```env
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER=your_verified_sender_email
```

---

# Reply APIs

The current route file uses `recipeId` in the reply endpoints.

## Add Reply

```http
POST /reply/:recipeId
```

Authentication: Required.

Allowed role:

```text
user
```

Creates a reply associated with the provided `recipeId`.

## Get Reply

```http
GET /reply/
```

Authentication: Not required.

Returns replies through the reply controller.

## Get All Replies by Recipe ID

```http
GET /reply/:recipeId
```

Authentication: Not required.

Returns replies associated with a recipe ID.

## Update Reply

```http
PATCH /reply/:id
```

Authentication: Required.

Allowed roles:

```text
user
admin
```

Updates a reply.

## Delete Reply

```http
DELETE /reply/:id
```

Authentication: Required.

Allowed roles:

```text
user
admin
```

Deletes a reply.

---

# Authentication and Authorization

Protected routes use the JWT authentication middleware.

The frontend sends the token using:

```http
Authorization: Bearer <token>
```

Role-based authorization is used for staff and admin operations.

Current route-level role restrictions:

| Feature | Allowed Roles |
|---|---|
| Add Service | admin, staff |
| Update Service | admin, staff |
| Delete Service | admin, staff |
| Get Appointment by ID | user, staff |
| Update Appointment | staff, user |
| Delete Appointment | user, staff, admin |
| Add Reply | user |
| Update Reply | user, admin |
| Delete Reply | user, admin |

---

# Appointment Reminder System

The application uses `node-cron` to automatically send appointment reminder emails.

The cron job runs every 5 minutes and checks confirmed appointments.

A reminder is sent when the appointment is approximately one hour away.

```text
Appointment booked
        ↓
Payment successful
        ↓
Appointment status = confirmed
        ↓
Cron runs every 5 minutes
        ↓
Appointment is 55–65 minutes away
        ↓
Brevo sends reminder email
        ↓
reminder1hSent = true
```

The reminder field is:

```js
reminder1hSent: {
  type: DataTypes.BOOLEAN,
  defaultValue: false,
}
```

After the email is successfully sent:

```js
await appointment.update({
  reminder1hSent: true,
});
```

This prevents the same reminder from being sent repeatedly.

The cron file is:

```text
backend/cron/appointmentReminderCron.js
```

The cron is started when the server starts.

---

# Database

The application uses MySQL with Sequelize ORM.

Main entities include:

- User
- Saloon
- SaloonFacility
- Appointment
- Payment
- Review/Reply-related data

Relationships connect users, salons, services, appointments, payments, and feedback.

---

# File Uploads

Salon images are uploaded using Multer and stored in Amazon S3.

The salon creation endpoint accepts the image using the multipart form-data field:

```text
image
```

AWS configuration is stored in environment variables.

Example:

```env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_region
AWS_BUCKET_NAME=your_bucket
```

---

# Installation

## 1. Clone the project

```bash
git clone <repository-url>
cd Fresha_Saloon
```

## 2. Install backend dependencies

```bash
cd backend
npm install
```

## 3. Configure `.env`

Create:

```text
backend/.env
```

Example:

```env
PORT=4500

DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=localhost
DB_PORT=3306

JWT_SECRET=your_jwt_secret

AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_BUCKET_NAME=your_s3_bucket

CASHFREE_CLIENT_ID=your_cashfree_client_id
CASHFREE_CLIENT_SECRET=your_cashfree_client_secret

BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER=your_verified_sender_email
```

Do not commit `.env` to Git.

## 4. Start the backend

```bash
npm run dev
```

or:

```bash
node server.js
```

The backend runs on:

```text
http://localhost:4500
```

## 5. Start the frontend

Use VS Code Live Server or another static web server.

Example:

```text
http://127.0.0.1:5500/frontend/index.html
```

---

# Payment Configuration

The project currently uses Cashfree.

For local development, configure the Cashfree sandbox credentials:

```env
CASHFREE_CLIENT_ID=your_sandbox_client_id
CASHFREE_CLIENT_SECRET=your_sandbox_client_secret
```

The frontend uses the Cashfree JavaScript SDK for checkout.

For production webhook functionality, the webhook endpoint must be publicly reachable. A local `localhost` URL cannot receive requests directly from Cashfree.

---

# Security

The project uses:

- JWT authentication
- Role-based authorization
- Protected endpoints
- Environment variables for secrets
- Server-side authentication
- Restricted staff/admin operations

Never expose:

- JWT secrets
- Database passwords
- AWS credentials
- Cashfree secrets
- Brevo API keys

---

# Current API Summary

| Method | Endpoint | Auth | Roles |
|---|---|---|---|
| POST | `/user/create` | No | - |
| POST | `/user/login` | No | - |
| PUT | `/user/update` | Yes | Authenticated |
| GET | `/user` | No | - |
| POST | `/saloon/add` | Yes | Authenticated |
| GET | `/saloon/get` | No | - |
| GET | `/saloon/all` | No | - |
| GET | `/saloon/get/:id` | No | - |
| POST | `/saloon-service/add` | Yes | admin, staff |
| GET | `/saloon-service/all` | No | - |
| GET | `/saloon-service/:id` | No | - |
| PUT | `/saloon-service/:id` | Yes | admin, staff |
| DELETE | `/saloon-service/:id` | Yes | admin, staff |
| POST | `/appointment/add` | Yes | Authenticated |
| GET | `/appointment` | Yes | Authenticated |
| GET | `/appointment/user` | Yes | Authenticated |
| GET | `/appointment/:id` | Yes | user, staff |
| PUT | `/:id` | Yes | staff, user |
| DELETE | `/appointment/:id` | Yes | user, staff, admin |
| POST | `/payments/create_order` | Yes | Authenticated |
| GET | `/payments/:orderId` | Yes | Authenticated |
| POST | `/email` | No | - |
| POST | `/reply/:recipeId` | Yes | user |
| GET | `/reply/` | No | - |
| GET | `/reply/:recipeId` | No | - |
| PATCH | `/reply/:id` | Yes | user, admin |
| DELETE | `/reply/:id` | Yes | user, admin |

---

# Future Improvements

Possible future enhancements:

- SMS and WhatsApp appointment reminders
- 24-hour and 1-hour reminder options
- Advanced staff scheduling
- Real-time availability
- Salon working-hour management
- Cancellation policies
- Analytics and reports
- Automated testing
- Production deployment
- Improved notification templates

---

# Author

**Fattah Ahmad Sabri**

Fresha Salon — Salon Booking and Management System
