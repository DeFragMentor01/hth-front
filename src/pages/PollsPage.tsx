import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { pollsState } from '../atoms';
import Poll from '../components/Poll';
import NavBar from '../components/NavBar';

const PollsPage = () => {
    const [filter, setFilter] = useState('All');
    const polls = useRecoilValue(pollsState);
  
    const filteredPolls = polls.filter((poll) => {
      if (filter === 'All') return true;
      return poll.status === filter.toLowerCase();
    });
  
    return (
        <>
        <NavBar />
      <div className="flex h-full bg-gray-100 p-4">
        <div className="w-1/3 h-72 bg-white p-4 sticky top-0 rounded-lg shadow-lg max-h-screen overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Filter Polls</h2>
          <button
            className={`w-full text-white py-2 px-4 rounded mt-2 transition duration-200 ${
              filter === 'All' ? 'bg-blue-500' : 'bg-gray-300 hover:bg-gray-400'
            }`}
            onClick={() => setFilter('All')}
          >
            All Polls
          </button>
          <button
            className={`w-full text-white py-2 px-4 rounded mt-2 transition duration-200 ${
              filter === 'Active' ? 'bg-green-500' : 'bg-gray-300 hover:bg-gray-400'
            }`}
            onClick={() => setFilter('Active')}
          >
            Active Polls
          </button>
          <button
            className={`w-full text-white py-2 px-4 rounded mt-2 transition duration-200 ${
              filter === 'Closed' ? 'bg-red-500' : 'bg-gray-300 hover:bg-gray-400'
            }`}
            onClick={() => setFilter('Closed')}
          >
            Closed Polls
          </button>
        </div>
        <div className="w-2/3 p-4 space-y-4">
          {filteredPolls.map((poll) => (
            <Poll key={poll.id} poll={poll} />
          ))}
        </div>
      </div>
      </>
    );
  };
  
  export default PollsPage;
  
  
