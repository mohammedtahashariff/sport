import './globals.css';
import ReduxProvider from '../store/ReduxProvider';
import { SocketProvider } from '../context/SocketContext';
import ToastContainer from '../components/common/ToastContainer';
import LocationModal from '../components/common/LocationModal';

export const metadata = {
  title: 'SportKart - Smart Hyperlocal Sports E-commerce',
  description: 'Discover, compare, and order sports gear locally from verified sports stores in Tiptur and nearby towns in 30-45 minutes.',
  keywords: 'sports, cricket bat, tiptur, badminton racket, football, gym weights, hyperlocal sports',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <ReduxProvider>
          <SocketProvider>
            <ToastContainer />
            <LocationModal />
            {children}
          </SocketProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
