import React from 'react';

const NotFound = (props) => {
  const backToHomepage = (e) => {
    e.preventDefault();
    props.history.replace('/');
  };

  return (
    <div className="h-screen w-screen flex items-center">
      <div className="container flex flex-col md:flex-row items-center justify-center px-5 text-gray-700">
        <div className="max-w-md">
          <div className="text-5xl font-dark font-bold">404</div>
          <p className="text-2xl md:text-3xl font-light leading-normal">
            Sorry we couldn't find this page.{' '}
          </p>
          <p className="mb-8">
            But dont worry, you can find plenty of other things on our homepage.
          </p>

          <button
            className="px-4 py-2 rounded-lg bg-blue-500 active:bg-blue-500 hover:bg-blue-600 border border-transparent inline leading-5 shadow text-white transition-colors duration-150 focus:outline-none focus:shadow-outline-blue"
            onClick={backToHomepage}
          >
            Back to homepage
          </button>
        </div>
        <div className="max-w-lg">
          <img src={require('~/assets/404.svg').default} alt="404" />
        </div>
      </div>
    </div>
  );
};

export default NotFound;
