const Fixtures = () => {
    const fixtures = [
      { date: '2022-10-01', time: '15:00', homeTeam: 'Team A', awayTeam: 'Team B' },
      { date: '2022-10-02', time: '18:30', homeTeam: 'Team C', awayTeam: 'Team D' },
      { date: '2022-10-03', time: '20:00', homeTeam: 'Team E', awayTeam: 'Team F' },
      // Add more fixtures here
    ];
  
    // Sort fixtures by date and time
    fixtures.sort((a, b) => {
      const dateComparison = a.date.localeCompare(b.date);
      if (dateComparison !== 0) {
        return dateComparison;
      }
      return a.time.localeCompare(b.time);
    });
  
    return (
      <div id="fixtures">
        <h2>Fixtures</h2>   
        <ul>
          {fixtures.map((fixture, index) => (
            <li key={index}>
              {fixture.date} - {fixture.time}: {fixture.homeTeam} vs {fixture.awayTeam}
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default Fixtures;
  