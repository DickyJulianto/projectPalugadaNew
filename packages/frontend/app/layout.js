import { Lilita_One } from 'next/font/google';
import './css/style.css'; 
import "./globals.css"; 
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const lilitaOne = Lilita_One({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
});

export const metadata = {
  title: "PaluGada",
  description: "Jasa Game Boosting Tepercaya Yang Serba Bisa",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" 
          integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA==" 
          crossOrigin="anonymous" 
          referrerPolicy="no-referrer" 
        />
        <link rel="shortcut icon" href="/assets/logo/logo3.png" type="image/png" />
      </head>
      <body className={lilitaOne.className}>
        <AuthProvider>
          {/* ToastContainer agar notifikasi bisa muncul */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}