import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { disablePageScroll, enablePageScroll } from 'scroll-lock';

import { brainwave } from '../assets';
import { navigation } from '../constants';
import Button from './Button';
import MenuSvg from '../assets/svg/MenuSvg';
import { HamburgerMenu } from './design/Header';
import Logo from '../assets/sportslogo.svg';
import api from '../util/axiosInstance';

const Header = () => {
  const pathname = useLocation();
  const navigate = useNavigate();
  const [openNavigation, setOpenNavigation] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const accessToken = document.cookie
      .split('; ')
      .find((row) => row.startsWith('accessToken='))
      ?.split('=')[1];

    if (accessToken) {
      setIsLoggedIn(true);
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      setUsername(payload.username); // Extract and set the username
      setUserRole(payload.role);
    } else {
      setIsLoggedIn(false);
      setUsername('');
      setUserRole('');
    }
  }, []);

  const toggleNavigation = () => {
    if (openNavigation) {
      setOpenNavigation(false);
      enablePageScroll();
    } else {
      setOpenNavigation(true);
      disablePageScroll();
    }
  };

  const handleClick = () => {
    if (!openNavigation) return;

    enablePageScroll();
    setOpenNavigation(false);
  };

  const handleNavigate = (path) => {
    navigate(path);
    handleClick(); // Close navigation if open
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout'); // Make a request to the server to handle logout
      document.cookie = 'accessToken=; Max-Age=0; path=/;'; // Clear the access token
      document.cookie = 'refreshToken=; Max-Age=0; path=/;'; // Clear the refresh token
      setIsLoggedIn(false);
      setUsername('');
      setUserRole('');
      handleNavigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 border-b border-n-6 lg:bg-n-8/90 lg:backdrop-blur-sm ${
        openNavigation ? 'bg-n-8' : 'bg-n-8/90 backdrop-blur-sm'
      }`}
    >
      <div className="flex items-center px-5 lg:px-7.5 xl:px-10 max-lg:py-4">
        <a
          className="flex items-center w-[12rem] xl:mr-8"
          href="/"
        >
          <img
            src={Logo}
            width={40}
            height={40}
            alt="IHG Hub"
          />
          <span className="ml-2">IHG Hub</span>
        </a>

        <nav
          className={`${
            openNavigation ? 'flex' : 'hidden'
          } fixed top-[5rem] left-0 right-0 bottom-0 bg-n-8 lg:static lg:flex lg:mx-auto lg:bg-transparent`}
        >
          <div className="relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row">
            {navigation.map((item) => (
              <a
                key={item.id}
                href={item.url}
                onClick={handleClick}
                className={`block relative font-code text-2xl uppercase text-n-1 transition-colors hover:text-color-1 ${
                  item.onlyMobile ? 'lg:hidden' : ''
                } px-6 py-6 md:py-8 lg:-mr-0.25 lg:text-xs lg:font-semibold ${
                  item.url === pathname.hash
                    ? 'z-2 lg:text-n-1'
                    : 'lg:text-n-1/50'
                } lg:leading-5 lg:hover:text-n-1 xl:px-12`}
              >
                {item.title}
              </a>
            ))}
          </div>

          <HamburgerMenu />
        </nav>

        {isLoggedIn ? (
          <>
            <span className="hidden mr-8 text-n-1/50 lg:block">
              Logged in as: {username} [{userRole}]
            </span>
            <Button
              onClick={handleLogout}
              className="hidden lg:flex"
            >
              Log out
            </Button>
          </>
        ) : (
          <>
            <button
              onClick={() => handleNavigate('/signup')}
              className="button hidden mr-8 text-n-1/50 transition-colors hover:text-n-1 lg:block"
            >
              New account
            </button>
            <Button
              onClick={() => handleNavigate('/login')}
              className="hidden lg:flex"
            >
              Log in
            </Button>
          </>
        )}

        <Button
          className="ml-auto lg:hidden"
          px="px-3"
          onClick={toggleNavigation}
        >
          <MenuSvg openNavigation={openNavigation} />
        </Button>
      </div>
    </div>
  );
};

export default Header;
