import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user } = useAuth();
  
  return (
    <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 rounded-b-2xl mb-6">
      <h2 className="text-xl font-semibold text-primary capitalize">{user?.role} Portal</h2>
      <div className="flex items-center space-x-4">
        <span className="text-gray-600 font-medium">{user?.name}</span>
        <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-bold">
          {user?.name?.[0]}
        </div>
      </div>
    </header>
  );
}
