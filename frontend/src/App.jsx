import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Alert, Spinner } from 'react-bootstrap';
import { api } from './api/api.service';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('jwtToken'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set auth token interceptor
    if (token) {
      api.setAuthToken(token);
      // Fetch user profile
      api.auth.getProfile()
        .then((profile) => setUser(profile))
        .catch(() => {
          localStorage.removeItem('jwtToken');
          setToken(null);
        });
    }
    setLoading(false);
  }, [token]);

  const handleLogin = async (credentials) => {
    const result = await api.auth.login(credentials);
    setToken(result.token);
    setUser(result.user);
  };

  const handleLogout = async () => {
    await api.auth.logout();
    setToken(null);
    setUser(null);
  };

  if (loading) {
    return <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>;
  }

  return (
    <div className="app">
      <nav>
        {user ? (
          <div className="navbar">
            <Container>
              <Row>
                <Col xs={6} className="d-flex align-items-center">
                  <h3 className="mb-0">Help Desk System</h3>
                </Col>
                <Col xs={6} className="text-end">
                  <Button className="btn-link p-0" onClick={handleLogout}>
                    Logout {user.name}
                  </Button>
                </Col>
              </Row>
            </Container>
          </div>
        ) : (
          <div className="navbar">
            <Container>
              <Row>
                <Col xs={6} className="d-flex align-items-center">
                  <h3 className="mb-0">Help Desk System</h3>
                </Col>
                <Col xs={6} className="text-end">
                  <Button className="btn-link p-0" onClick={() => window.location.href='/login'}>
                    Login
                  </Button>
                  <Button className="btn btn-primary ms-2" onClick={() => window.location.href='/register'}>
                    Register
                  </Button>
                </Col>
              </Row>
            </Container>
          </div>
        )}
      </nav>

      <main className="main-content">
        {user ? (
          <Routes>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/tickets" element={<TicketListPage />} />
            <Route path="/create-ticket" element={<TicketCreatePage />} />
            <Route path="/assign-ticket" element={<TicketAssignPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<DashboardPage />} />
          </Routes>
        ) : (
          <RouteIndex />
        )}
      </main>
    </div>
  );
}

export default App;