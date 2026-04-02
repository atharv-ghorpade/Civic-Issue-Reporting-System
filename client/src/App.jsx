import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background-main text-gray-900 font-sans">
        <AppRoutes />
      </div>
    </AuthProvider>
  );
}

export default App;
