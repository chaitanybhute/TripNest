import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FlashMessage from './components/FlashMessage';
import ListingsPage from './pages/ListingsPage';
import ShowPage from './pages/ShowPage';
import NewListingPage from './pages/NewListingPage';
import EditListingPage from './pages/EditListingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <FlashMessage />

          <main style={{ flex: 1 }}>
            <Routes>
              {/* Redirect root to listings */}
              <Route path="/" element={<Navigate to="/listings" replace />} />

              {/* Listings */}
              <Route path="/listings" element={<ListingsPage />} />
              <Route path="/listings/new" element={<NewListingPage />} />
              <Route path="/listings/:id" element={<ShowPage />} />
              <Route path="/listings/:id/edit" element={<EditListingPage />} />

              {/* Auth */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />

              {/* Catch-all */}
              <Route path="*" element={
                <div className="container text-center py-5">
                  <h2>404 — Page Not Found</h2>
                  <a href="/listings" className="btn btn-tripnest mt-3">Go to Listings</a>
                </div>
              } />
            </Routes>
          </main>

          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
