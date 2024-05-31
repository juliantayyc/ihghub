const Profiles = ({ Leaderboard, sex }) => {
  return (
    <div className="flex justify-center">
      <div className="flex flex-col">{Item(Leaderboard, sex)}</div>
    </div>
  );
};

const Item = (data, sex) => {
  return (
    <>
      {data.map((value, index) => {
        let score;
        if (sex === 'All') {
          score = value.score['M'] + value.score['F'];
        } else {
          score = value.score[sex];
        }

        return (
          <div
            className="flex items-center justify-between gap-64 mt-6 bg-color-1 bg-opacity-15 border border-n-1/10 rounded-2xl p-4"
            key={index}
          >
            <div className="flex items-center justify-start">
              <img
                src={value.img}
                alt={value.name}
                className="w-20 h-20"
              />
              <div className="ml-8 text-center justify-start">
                <h5 className="body-1">{value.name}</h5>
              </div>
            </div>
            <div className="flex items-center ml-60">
              <span className="h4">{score}</span>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default Profiles;
