import React, { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import UsersTable from './pages/UsersTable';
import DashboardPage from './pages/DashboardPage';
import { userIsAuth } from './atoms';
import LandingPage from './pages/LandingPage';
import GlobePage from './pages/GlobePage';
import PollsPage from './pages/PollsPage';

interface Props {
  // ...s
}

const App: React.FunctionComponent<Props> = () => {
  const setUserAuth = useSetRecoilState(userIsAuth);
  const isAuthenticated = useRecoilValue(userIsAuth);

  useEffect(() => {
    // Check if the authentication state is stored in localStorage
    const storedAuth = localStorage.getItem("isAuthenticated");
    if (storedAuth) {
      setUserAuth(storedAuth === "true");
    }
  }, [setUserAuth]);

  useEffect(() => {
    // Store the authentication state in localStorage
    localStorage.setItem("isAuthenticated", String(isAuthenticated));
  }, [isAuthenticated]);

  console.log('isAuthenticated:', isAuthenticated);

  return (
    <Router>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/interactivemap" element={<GlobePage /> } />
        <Route path="/polls" element={<PollsPage />} />
        {isAuthenticated && (
          <>
            <Route path="/userslist" element={<UsersTable />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;
