import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./page/HomePage.jsx";
import LoginPage from "./page/Login.jsx";
import RegisterPage from "./page/Register.jsx";
import VerifyPage from "./page/Verify";
import Vote from "./page/Vote.jsx";
import Guide from "./page/Guide.jsx";
import Profile from "./page/Profile.jsx";
import Results from "./page/Results.jsx";
import ProtectedRoutes from "./component/ProtectedRoutes.js";
import SuperAdmin from "./page/SuperAdmin.jsx";
import ZoneAdminHome from "./page/ZoneAdminHome.jsx";
import ZoneAdminVerify from "./page/ZoneAdminVerify.jsx";
import ZoneAdminVote from "./page/ZoneAdminVote.jsx";
const App = () => {
  //   const refreshAccessToken = async () => {
  //     try {
  //       const response = await axios.get("/api/users/refresh-token");
  //       if (response.status === 403 || response.status === 401) return;
  //       if (response.data) console.log(response.data.message + " hi ");
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   const refreshInterval = 19 * 60 * 1000 + 50 * 1000;

  //   useEffect(() => {
  //     if (sessionStorage.getItem("user")) {
  //       refreshAccessToken();

  //       const intervalId = setInterval(refreshAccessToken, refreshInterval);

  //       return () => {
  //         clearInterval(intervalId);
  //       };
  //     }
  //   }, []);

  return (
    <Routes>
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/guide" element={<Guide />} />

      {/* user protected routes */}
      <Route element={<ProtectedRoutes admin={false} superAdmin={false} />}>
        <Route path="/results" element={<Results />} />
        <Route path="/verify" element={<VerifyPage />} />
        <Route path="/vote" element={<Vote />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* admin protected routes */}
      <Route element={<ProtectedRoutes admin={true} superAdmin={false} />}>
        <Route path="/admin" element={<ZoneAdminHome />} />
        <Route path="/admin/verify" element={<ZoneAdminVerify />} />
        <Route path="/admin/vote" element={<ZoneAdminVote />} />
        <Route path="/results" element={<Results />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* superadmin protected routes */}
      <Route element={<ProtectedRoutes superAdmin={true} admin={false} />}>
        <Route path="/super-admin" element={<SuperAdmin />} />
        <Route path="/results" element={<Results />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
};

export default App;
