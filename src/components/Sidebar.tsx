import { NavLink } from 'react-router-dom';
import { 
  HomeIcon, 
  UsersIcon, 
  PhoneIcon, 
  CreditCardIcon, 
  CogIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { useTheme } from './ThemeProvider';

const navigation = [
  { name: 'Tableau de bord', href: '/dashboard', icon: HomeIcon },
  { name: 'Clients', href: '/clients', icon: UsersIcon },
  { name: 'Lignes', href: '/lines', icon: PhoneIcon },
  { name: 'Cartes SIM', href: '/sim-cards', icon: CreditCardIcon },
  { name: 'Statistiques', href: '/statistics', icon: ChartBarIcon },
  { name: 'Paramètres', href: '/settings', icon: CogIcon },
];

export default function Sidebar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow pt-5 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0 px-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-provectio-500 to-telecom-500 rounded-lg flex items-center justify-center">
              <PhoneIcon className="w-5 h-5 text-white" />
            </div>
            <div className="ml-3">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                Provectio
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Télécom
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex-grow flex flex-col">
          <nav className="flex-1 px-2 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    isActive
                      ? 'bg-provectio-100 dark:bg-provectio-900 text-provectio-700 dark:text-provectio-200'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }`
                }
              >
                <item.icon
                  className="mr-3 h-5 w-5 flex-shrink-0"
                  aria-hidden="true"
                />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer avec toggle de thème */}
        <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
          <button
            onClick={toggleTheme}
            className="flex items-center w-full px-2 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white rounded-md transition-colors duration-200"
          >
            {theme === 'light' ? (
              <>
                <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                Mode sombre
              </>
            ) : (
              <>
                <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Mode clair
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
