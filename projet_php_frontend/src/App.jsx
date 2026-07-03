import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./Components/Login";
import Register from "./Components/Register";
import ForgotPassword from "./Components/ForgotPassword";
import ResetPassword from "./Components/ResetPassword";
import HomeGate from "./Components/Homegate";
import Landing from "./Components/Lading_home";
import Settings from "./Components/Settings";
import Notifications from "./Components/notifications";
import Applications from "./Components/Applications";
import Offers from "./Components/Offers";
import CreateOffer from "./Components/Create_offer";
import Dashboard from "./Components/Dashboard";
// import StudentOffers from "./Components/StudentOffers";
// import CompanyOffers from "./Components/CompanyOffers";
import ApplyForm from "./Components/ApplyForm";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeGate />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/company/create-offer" element={<CreateOffer />} />
        <Route path="/company/dashboard" element={<Dashboard />} />
        {/* <Route path="/student/offers" element={<StudentOffers />} />
        <Route path="/company/offers" element={<CompanyOffers />} /> */}
        <Route path="/company/offers/new" element={<CreateOffer />} />
        <Route path="/apply/:id" element={<ApplyForm />} />
        {/* Option: laisse plutôt vers "/" */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
