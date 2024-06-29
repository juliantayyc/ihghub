import React, { useState, useEffect, useRef } from 'react';
import { curve } from '../assets';
import Button from './Button';
import Section from './Section';
import { BackgroundCircles, Gradient } from './design/Hero';
import axios from 'axios';
import { APP_SERVER_URL } from '../constants';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const [todaysGames, setTodaysGames] = useState([]);
  const [venuesMap, setVenuesMap] = useState({}); // State to store venues for quick lookup
  const parallaxRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTodaysGames();
  }, []);

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchTodaysGames = async () => {
    try {
      const response = await axios.get(`${APP_SERVER_URL}/fixturesData`);
      const today = new Date(new Date().getTime() + 8 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0]; // Get today's date in YYYY-MM-DD format
      const filteredGames = response.data.filter(
        (fixture) => fixture.date === today
      );

      // Sort games based on startTime (assuming startTime and endTime are in HH:mm:ss format)
      filteredGames.sort((a, b) => {
        const startTimeA = convertTimeToSeconds(a.startTime);
        const startTimeB = convertTimeToSeconds(b.startTime);
        return startTimeA - startTimeB;
      });

      setTodaysGames(filteredGames);
    } catch (error) {
      console.error('There was an error fetching the fixtures data!', error);
    }
  };

  const fetchVenues = async () => {
    try {
      const response = await axios.get(`${APP_SERVER_URL}/venuesData`);
      const venues = response.data.reduce((map, venue) => {
        map[venue.id] = venue.name; // Store venue names in an object for quick lookup
        return map;
      }, {});
      setVenuesMap(venues);
    } catch (error) {
      console.error('Error fetching venues:', error);
    }
  };

  // Function to convert HH:mm:ss to total seconds
  const convertTimeToSeconds = (timeString) => {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  const handleCardClick = (game) => {
    if (isGameLive(game.startTime, game.endTime)) {
      navigate(`/game/${game.id}`, { state: { game } });
    } else {
      navigate(`/summary/${game.id}`, { state: { ...game } });
    }
  };

  // Function to check if game is currently live based on start and end times
  const isGameLive = (startTime, endTime) => {
    const now = new Date();
    const today = new Date(new Date().getTime() + 8 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];
    const start = new Date(`${today} ${startTime}`);
    const end = new Date(`${today} ${endTime}`);
    return start <= now && now <= end;
  };

  return (
    <Section
      className="pt-[12rem] -mt-[5.25rem]"
      crosses
      crossesOffset="lg:translate-y-[5.25rem]"
      customPaddings
      id="hero"
    >
      <div
        className="container relative"
        ref={parallaxRef}
      >
        <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[3.875rem] md:mb-20 lg:mb-[6.25rem]">
          <h1 className="h1 mb-6">
            Welcome to{' '}
            <span className="inline-block relative">
              IHG Hub{' '}
              <img
                src={curve}
                className="absolute top-full left-0 w-full xl:-mt-2"
                width={624}
                height={28}
                alt="Curve"
              />
            </span>
          </h1>
          <p className="body-1 max-w-3xl mx-auto mb-6 text-n-2 lg:mb-8">
            Your one stop solution to all things IHG.
          </p>
          <Button
            href="/signup"
            black
          >
            Get started
          </Button>
        </div>
        <div className="relative max-w-full mx-auto md:max-w-5xl xl:mb-24">
          <div className="relative z-1 p-0.5 rounded-2xl bg-color-1 border border-black">
            <div className="relative bg-n-8 rounded-[1rem]">
              <div className="h-[1.4rem] bg-n-10 rounded-t-[0.9rem]" />
              <div className="relative z-1 max-w-full mx-auto text-center mb-[3.875rem] md:mb-20 lg:mb-[0.75rem]">
                <h1 className="h3 mb-2">Today's games:</h1>
              </div>
              <div className="max-h-[30rem] overflow-y-auto p-2 space-y-4">
                {todaysGames.length > 0 ? (
                  todaysGames.map((game, index) => (
                    <div
                      key={index}
                      className={`p-4 bg-orange-100 rounded-lg shadow-md flex flex-col md:flex-row md:justify-between items-center relative cursor-pointer`}
                      onClick={() => handleCardClick(game)}
                    >
                      {isGameLive(game.startTime, game.endTime) && (
                        <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full animate-ping" />
                      )}
                      <div className="flex flex-col md:flex-row md:justify-between items-center md:space-x-4">
                        <div className="text-n-1 md:ml-4 md:mr-4 px-2">
                          {game.sport} - {game.sex}
                        </div>
                        <div className="text-n-2 md:ml-4 md:mr-4 px-2">
                          {venuesMap[game.venueId]}
                        </div>
                        <div className="text-n-2 md:ml-4 md:mr-4 px-2">
                          {game.startTime} - {game.endTime}
                        </div>
                      </div>
                      <div className="mt-2 md:mt-0 md:mr-4 flex flex-row items-center space-x-2">
                        <span className="font-bold text-lg">{game.team1}</span>
                        <span className="text-n-2">{game.score1}</span>
                        <span className="font-bold text-lg">vs</span>
                        <span className="text-n-2">{game.score2}</span>
                        <span className="font-bold text-lg">{game.team2}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 bg-orange-100 rounded-lg shadow-md text-center">
                    Our athletes are resting... there are no games today!
                  </div>
                )}
              </div>
            </div>
            <Gradient />
          </div>
          <BackgroundCircles />
        </div>
      </div>
    </Section>
  );
};

export default Hero;
