import { createBrowserRouter, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import RoleRoute from './RoleRoute'
import { ROUTES } from './routePaths'
import PatientLayout from '@/layouts/PatientLayout'
import DoctorLayout from '@/layouts/DoctorLayout'
import ReceptionistLayout from '@/layouts/ReceptionistLayout'
import AdminLayout from '@/layouts/AdminLayout'
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import AdminLoginPage from '@/pages/auth/AdminLoginPage'
import AdminSignupPage from '@/pages/auth/AdminSignupPage'
import PatientDashboard from '@/pages/patient/DashboardPage'
import PatientAppointments from '@/pages/patient/AppointmentsPage'
import PatientMedicalHistory from '@/pages/patient/MedicalHistoryPage'
import PatientPrescriptions from '@/pages/patient/PrescriptionsPage'
import PatientInsurance from '@/pages/patient/InsuranceClaimsPage'
import PatientProfile from '@/pages/patient/ProfilePage'
import DoctorDashboard from '@/pages/doctor/DashboardPage'
import DoctorSchedule from '@/pages/doctor/SchedulePage'
import DoctorAppointments from '@/pages/doctor/AppointmentsPage'
import DoctorPatientSearch from '@/pages/doctor/PatientSearchPage'
import DoctorPatientDetail from '@/pages/doctor/PatientDetailPage'
import DoctorProfile from '@/pages/doctor/ProfilePage'
import ReceptionistDashboard from '@/pages/receptionist/DashboardPage'
import ReceptionistCalendar from '@/pages/receptionist/CalendarPage'
import ReceptionistPatientList from '@/pages/receptionist/PatientListPage'
import ReceptionistBookAppointment from '@/pages/receptionist/BookAppointmentPage'
import ReceptionistCheckInOut from '@/pages/receptionist/CheckInOutPage'
import ReceptionistInsuranceClaims from '@/pages/receptionist/InsuranceClaimsPage'
import AdminDashboard from '@/pages/admin/DashboardPage'
import AdminUsers from '@/pages/admin/UsersPage'
import AdminUserForm from '@/pages/admin/UserFormPage'
import AdminAnalytics from '@/pages/admin/AnalyticsPage'
import NotFoundPage from '@/pages/NotFoundPage'
import UnauthorizedPage from '@/pages/UnauthorizedPage'

export const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
  },
  {
    path: ROUTES.REGISTER,
    element: <RegisterPage />,
  },
  {
    path: ROUTES.ADMIN_LOGIN,
    element: <AdminLoginPage />,
  },
  {
    path: ROUTES.ADMIN_SIGNUP,
    element: <AdminSignupPage />,
  },
  {
    path: '/patient',
    element: (
      <ProtectedRoute>
        <PatientLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      {
        path: 'dashboard',
        element: (
          <RoleRoute allowedRoles={['PATIENT']}>
            <PatientDashboard />
          </RoleRoute>
        ),
      },
      {
        path: 'appointments',
        element: (
          <RoleRoute allowedRoles={['PATIENT']}>
            <PatientAppointments />
          </RoleRoute>
        ),
      },
      {
        path: 'medical-records',
        element: (
          <RoleRoute allowedRoles={['PATIENT']}>
            <PatientMedicalHistory />
          </RoleRoute>
        ),
      },
      {
        path: 'prescriptions',
        element: (
          <RoleRoute allowedRoles={['PATIENT']}>
            <PatientPrescriptions />
          </RoleRoute>
        ),
      },
      {
        path: 'insurance',
        element: (
          <RoleRoute allowedRoles={['PATIENT']}>
            <PatientInsurance />
          </RoleRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <RoleRoute allowedRoles={['PATIENT']}>
            <PatientProfile />
          </RoleRoute>
        ),
      },
    ],
  },
  {
    path: '/doctor',
    element: (
      <ProtectedRoute>
        <DoctorLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      {
        path: 'dashboard',
        element: (
          <RoleRoute allowedRoles={['DOCTOR']}>
            <DoctorDashboard />
          </RoleRoute>
        ),
      },
      {
        path: 'schedule',
        element: (
          <RoleRoute allowedRoles={['DOCTOR']}>
            <DoctorSchedule />
          </RoleRoute>
        ),
      },
      {
        path: 'appointments',
        element: (
          <RoleRoute allowedRoles={['DOCTOR']}>
            <DoctorAppointments />
          </RoleRoute>
        ),
      },
      {
        path: 'patients',
        element: (
          <RoleRoute allowedRoles={['DOCTOR']}>
            <DoctorPatientSearch />
          </RoleRoute>
        ),
      },
      {
        path: 'patients/:patientId',
        element: (
          <RoleRoute allowedRoles={['DOCTOR']}>
            <DoctorPatientDetail />
          </RoleRoute>
        ),
      },
      {
        path: 'medical-records',
        element: (
          <RoleRoute allowedRoles={['DOCTOR']}>
            <Navigate to={ROUTES.DOCTOR_PATIENTS} />
          </RoleRoute>
        ),
      },
      {
        path: 'prescriptions',
        element: (
          <RoleRoute allowedRoles={['DOCTOR']}>
            <Navigate to={ROUTES.DOCTOR_PATIENTS} />
          </RoleRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <RoleRoute allowedRoles={['DOCTOR']}>
            <DoctorProfile />
          </RoleRoute>
        ),
      },
    ],
  },
  {
    path: '/receptionist',
    element: (
      <ProtectedRoute>
        <ReceptionistLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      {
        path: 'dashboard',
        element: (
          <RoleRoute allowedRoles={['RECEPTIONIST']}>
            <ReceptionistDashboard />
          </RoleRoute>
        ),
      },
      {
        path: 'appointments',
        element: (
          <RoleRoute allowedRoles={['RECEPTIONIST']}>
            <ReceptionistCalendar />
          </RoleRoute>
        ),
      },
      {
        path: 'appointments/book',
        element: (
          <RoleRoute allowedRoles={['RECEPTIONIST']}>
            <ReceptionistBookAppointment />
          </RoleRoute>
        ),
      },
      {
        path: 'appointments/check-in-out',
        element: (
          <RoleRoute allowedRoles={['RECEPTIONIST']}>
            <ReceptionistCheckInOut />
          </RoleRoute>
        ),
      },
      {
        path: 'patients',
        element: (
          <RoleRoute allowedRoles={['RECEPTIONIST']}>
            <ReceptionistPatientList />
          </RoleRoute>
        ),
      },
      {
        path: 'insurance',
        element: (
          <RoleRoute allowedRoles={['RECEPTIONIST']}>
            <ReceptionistInsuranceClaims />
          </RoleRoute>
        ),
      },
    ],
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      {
        path: 'dashboard',
        element: (
          <RoleRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </RoleRoute>
        ),
      },
      {
        path: 'users',
        element: (
          <RoleRoute allowedRoles={['ADMIN']}>
            <AdminUsers />
          </RoleRoute>
        ),
      },
      {
        path: 'users/new',
        element: (
          <RoleRoute allowedRoles={['ADMIN']}>
            <AdminUserForm />
          </RoleRoute>
        ),
      },
      {
        path: 'users/:role/:id/edit',
        element: (
          <RoleRoute allowedRoles={['ADMIN']}>
            <AdminUserForm />
          </RoleRoute>
        ),
      },
      {
        path: 'analytics',
        element: (
          <RoleRoute allowedRoles={['ADMIN']}>
            <AdminAnalytics />
          </RoleRoute>
        ),
      },
    ],
  },
  {
    path: ROUTES.UNAUTHORIZED,
    element: <UnauthorizedPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
