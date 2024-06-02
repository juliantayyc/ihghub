const NotYetAdded = () => {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-6xl font-bold text-n-1 mb-4">501</h1>
      <p className="text-xl text-n-2 mb-8">Page To Be Added!</p>
      <button
        onClick={handleGoHome}
        className="px-6 py-3 bg-color-3 text-white font-semibold rounded-lg shadow-md hover:bg-color-1 transition duration-200"
      >
        Go Home
      </button>
    </div>
  );
};

export default NotYetAdded;
