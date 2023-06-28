import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { FaThumbtack, FaTimes } from 'react-icons/fa';
import { pollsState, Poll as PollProps } from '../atoms';

const Poll = ({ poll }: { poll: PollProps }) => {
  const [polls, setPolls] = useRecoilState(pollsState);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [isPinned, setIsPinned] = useState<boolean>(false);

  const handleVote = (option: string) => {
    if (poll.status === 'active' && !selectedOption) {
      setSelectedOption(option);
      const newPolls = polls.map((p) => {
        if (p.id === poll.id) {
          const newResults = { ...p.results };
          newResults[option] = (newResults[option] || 0) + 1;
          return {
            ...p,
            results: newResults,
            votersCount: p.votersCount + 1,
            votesCount: p.votesCount + 1,
          };
        }
        return p;
      });
      setPolls(newPolls);
    }
  };

  const handlePin = () => {
    setIsPinned(!isPinned);
  };

  return (
    <div className="relative bg-white shadow-lg rounded-lg p-6 mb-6 w-full md:w-2/3">
      <div className="absolute top-0 right-0 m-2">
        <span className="text-gray-500">
          status: <span className={`text-${poll.status === 'active' ? 'green' : 'red'}-500`}>{poll.status}</span>
        </span>
      </div>
      <div className="absolute top-0 left-0 mt-2 ml-2 text-sm">
        {isPinned ? (
          <FaThumbtack className="text-green-700 cursor-pointer" onClick={handlePin} />
        ) : (
          <FaThumbtack className="text-gray-500 cursor-pointer" onClick={handlePin} />
        )}
      </div>
      <h2 className="text-lg font-semibold">{poll.title}</h2>
      <p className="text-xs text-gray-500">Created {poll.timeCreated}</p>
      <p className="text-sm mb-4">{poll.question}</p>
      {selectedOption && !showResults ? (
        <button className="mt-4 py-2 px-4 rounded-full bg-green-500 text-white hover:bg-green-600 transition duration-200 w-full" onClick={() => setShowResults(true)}>
          See Results
        </button>
      ) : (
        !showResults && poll.status === 'active' && (
          <div>
            {poll.options.map((option, index) => (
              <button
                key={index}
                className={`w-full text-white py-2 px-4 rounded mt-2 transition duration-200 ${option === selectedOption ? 'bg-green-500' : 'bg-blue-500 hover:bg-blue-700'}`}
                onClick={() => handleVote(option)}
              >
                {option}
              </button>
            ))}
          </div>
        )
      )}
      {(showResults || poll.status === 'closed') && (
        <div className="mt-4 bg-gray-100 p-4 rounded relative">
          {poll.options.map((option, index) => (
            <div key={index} className="mb-2">
              <p className="text-sm flex justify-between">
                <span className="pr-2">{option}</span>
                <span>
                  {poll.results[option] || 0} (
                  {((poll.results[option] || 0) * 100) / poll.votesCount}%)
                </span>
              </p>
              <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                <div
                  style={{ width: `${((poll.results[option] || 0) * 100) / poll.votesCount}%` }}
                  className="h-full bg-blue-500"
                ></div>
              </div>
              {showResults && (
                <FaTimes className="text-gray-500 cursor-pointer absolute top-1 right-1" onClick={() => setShowResults(false)} />
              )}
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-between items-center mt-4">
        <div>
          <p className="text-sm font-bold text-gray-600">{poll.votersCount.toLocaleString()} voters</p>
          <p className="text-sm font-bold text-gray-600">{((poll.votersCount / 1000000) * 100).toFixed(2)}% of users voted</p>
        </div>
      </div>
    </div>
  );
};

export default Poll;
