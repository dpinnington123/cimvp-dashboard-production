import { Link } from 'react-router-dom';
// We'll add icons and proper styling later

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 p-4 shadow-md space-y-2">
      <div className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Dashboard</div>
      <nav>
        <Link to="/" className="block py-2 px-4 rounded hover:bg-gray-100 dark:hover:bg-gray-700">Overview</Link>
        <Link to="/effectiveness" className="block py-2 px-4 rounded hover:bg-gray-100 dark:hover:bg-gray-700">Content Effectiveness</Link>
        <Link to="/campaigns" className="block py-2 px-4 rounded hover:bg-gray-100 dark:hover:bg-gray-700">Campaign Performance</Link>
        <Link to="/audience" className="block py-2 px-4 rounded hover:bg-gray-100 dark:hover:bg-gray-700">Audience & Channels</Link>
        {/* Add more links or structure as needed */}
      </nav>
    </aside>
  );
} 