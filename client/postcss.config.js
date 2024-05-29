export default {
  root: 'client',
  build: {
    rollupOptions: {
      input: 'client/index.html',
    },
  },
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
