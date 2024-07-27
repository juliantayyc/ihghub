import { instagram } from '../assets';

export const APP_SERVER_URL = import.meta.env.VITE_APP_SERVER_URL;
export const WEATHER_API_URL = import.meta.env.VITE_APP_WEATHER_API_URL;
export const YOUTUBE_API_KEY = 'AIzaSyD2kNNuqp8fvaGO_pdcCloW7rXO-0RPxrQ';
export const GOOGLE_MAPS_API_KEY = 'AIzaSyAFp7t5tUn3FwoQyljikIwCCQGq1ciV-3Q';
export const WEATHER_API_KEY = 'da9e2be50feecb5d36604a82c76a1612';

//RBAC permissions
export const adminPermissions = ['admin'];
export const officialPermissions = ['official', 'admin'];

export const navigation = [
  {
    id: '0',
    title: 'Leaderboard',
    url: '/#leaderboard',
  },
  {
    id: '1',
    title: 'Fixtures',
    url: '/fixtures',
  },
  {
    id: '2',
    title: 'Venues',
    url: '/venues',
  },
  {
    id: '3',
    title: 'Live',
    url: '/live',
  },
  {
    id: '4',
    title: 'Register',
    url: '/register',
  },
  {
    id: '5',
    title: 'Manager Panel',
    url: '/manager',
  },
  {
    id: '6',
    title: 'Official Panel',
    url: '/official',
  },
  {
    id: '7',
    title: 'Admin Panel',
    url: '/admin',
  },
  {
    id: '8',
    title: 'New account',
    url: '/signup',
    onlyMobile: true,
  },
  {
    id: '9',
    title: 'Log in',
    url: '/login',
    onlyMobile: true,
  },
];

export const socials = [
  {
    id: '0',
    title: 'Instagram',
    iconUrl: instagram,
    url: 'https://www.instagram.com/ihgofficial?igsh=NTFwZGl4YzU5YXFn',
  },
];
