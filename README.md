# Fresha Salon

Fresha Salon is a full-stack salon management and appointment booking
application. Customers can discover salons, view services, book
appointments, make online payments, receive booking notifications and
automated reminders, and manage their profiles. Admins can manage
salons, services, customers, and appointments from a centralized
dashboard.

## Features

### User Authentication and Profiles

-   Customer registration and login
-   JWT-based authentication
-   Role-based authorization
-   Customer profile management
-   Protected API routes

### Service Management

-   Salon service listings
-   Service descriptions
-   Service duration and pricing
-   Salon-specific services

### Staff Management

-   Staff profiles
-   Staff specializations
-   Staff availability
-   Service assignment based on staff skills and schedules

### Appointment Booking

-   Search and select salons
-   Browse available services
-   Select appointment date and time
-   Book appointments
-   View detailed appointment information
-   Appointment status management

### Booking Confirmation

-   Automated booking/payment flow
-   Email notifications
-   Payment confirmation

### Appointment Reminders

-   Automated reminders using `node-cron`
-   Reminder email approximately 1 hour before an appointment
-   Brevo transactional email integration
-   Duplicate reminder prevention using `reminder1hSent`

### Appointment Management

-   View appointments
-   Update appointments
-   Cancel/delete appointments
-   Customer appointment history
-   Admin management of all appointments

### Online Payments

-   Cashfree payment gateway integration
-   Payment order creation
-   Payment status verification
-   Payment records
-   Appointment confirmation after successful payment
-   Cashfree frontend checkout

### Reviews and Feedback

-   Customers can submit reviews
-   Reviews are associated with customers and salons
-   Review management
-   Staff/salon response functionality

### Admin Dashboard

-   Dashboard statistics
-   Salon management
-   Service management
-   Appointment management
-   Customer/user management
-   Appointment status monitoring
-   Role-protected admin operations

## Tech Stack

### Backend

-   Node.js
-   Express.js
-   Sequelize ORM
-   MySQL
-   JWT
-   Multer
-   Amazon S3
-   Cashfree
-   Brevo Transactional Email
-   node-cron

### Frontend

-   HTML5
-   CSS3
-   JavaScript
-   Axios
-   Cashfree JavaScript SDK

## Project Structure

``` text
Fresha_Saloon/
│
├── backend/
│   ├── controller/
│   ├── cron/
│   │   └── appointmentReminderCron.js
│   ├── middleware/
│   ├── model/
│   ├── route/
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
    │   ├── adminindex.html
    │   ├── adminindex.js
    │   └── adminindex.css
    ├── payments/
    │   ├── payment-success.html
    │   ├── payment-success.js
    │   └── payment-success.css
    ├── saloonWork/
    │   ├── saloon.html
    │   ├── booking.html
    │   └── appointment.html
    ├── index.html
    ├── login.html
    └── register.html
```

## Installation

### 1. Clone the repository

``` bash
git clone <repository-url>
cd Fresha_Saloon
```

### 2. Install backend dependencies

``` bash
cd backend
npm install
```

### 3. Configure environment variables

Create a `.env` file inside `backend`.

``` env
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

Never commit `.env` or API keys to Git.

### 4. Start the backend

``` bash
npm run dev
```

or:

``` bash
node server.js
```

Backend:

``` text
http://localhost:4500
```

### 5. Start the frontend

Open the frontend using VS Code Live Server or another static web
server.

Example:

``` text
http://127.0.0.1:5500/frontend/index.html
```

## Appointment Reminder System

The reminder system uses `node-cron` to check confirmed appointments
every 5 minutes.

``` text
Customer books appointment
        ↓
Payment completed
        ↓
Appointment becomes confirmed
        ↓
Cron checks appointments every 5 minutes
        ↓
Appointment is approximately 1 hour away
        ↓
Brevo sends reminder email
        ↓
reminder1hSent = true
        ↓
Duplicate reminder is prevented
```

The cron job is located at:

``` text
backend/cron/appointmentReminderCron.js
```

The appointment model uses:

``` js
reminder1hSent: {
  type: DataTypes.BOOLEAN,
  defaultValue: false,
}
```

After a successful email:

``` js
await appointment.update({
  reminder1hSent: true,
});
```

## Payment Flow

``` text
Customer selects service
        ↓
Appointment created
        ↓
Cashfree order created
        ↓
Customer completes payment
        ↓
Payment status verified
        ↓
Payment record updated
        ↓
Appointment confirmed
        ↓
Customer redirected to payment success page
```

For production webhook testing, Cashfree requires a publicly reachable
webhook URL. A local `localhost` webhook URL is suitable for local
development only.

## Authentication

The application uses JWT authentication.

After successful login, the frontend stores the authentication token and
user information in browser local storage.

Protected requests use:

``` http
Authorization: Bearer <token>
```

Role-based authorization protects administrative functionality.

## Main API Areas

The backend provides APIs for:

-   User registration and login
-   User/profile management
-   Salon management
-   Salon services
-   Appointment creation and management
-   Payment order creation
-   Payment status verification
-   Payment records
-   Reviews
-   Admin operations

API base URL:

``` text
http://localhost:4500
```

## Database

The project uses MySQL with Sequelize ORM.

Main entities include:

-   User
-   Saloon
-   SaloonFacility
-   Appointment
-   Payment
-   Review

These entities are connected through Sequelize relationships.

## File Uploads

Salon images are uploaded using Multer and stored in Amazon S3.

The salon image is sent as multipart form data using the field:

``` text
image
```

The backend processes the upload and stores the image information with
the salon.

## Admin Dashboard

The admin dashboard provides centralized management for:

-   Dashboard statistics
-   Salons
-   Services
-   Appointments
-   Users/customers

Administrators can view and manage records from a single dashboard.

## Security

The application includes:

-   JWT authentication
-   Role-based authorization
-   Protected routes
-   Environment variables for secrets
-   Password authentication
-   Server-side validation
-   Restricted administrative operations

For production, use HTTPS and a secure secret-management solution.

## Development Notes

The reminder cron is started when the backend server starts:

``` js
const appointmentReminderCron = require("./cron/appointmentReminderCron");

appointmentReminderCron();
```

The cron runs every five minutes and sends the reminder when an
appointment falls within the configured one-hour window.

## Future Improvements

Potential future improvements include:

-   SMS and WhatsApp reminders
-   Multiple reminder intervals such as 24 hours and 1 hour
-   Advanced staff scheduling
-   Real-time slot availability
-   Salon working-hours management
-   Automatic cancellation policies
-   Advanced analytics and reports
-   Production deployment
-   Automated testing
-   Improved notification templates

## License

This project is developed for educational and project purposes.

## Author

**Fattah Ahmad Sabri**

SalonHub_Hair_Spa
