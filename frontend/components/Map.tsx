"use client";
import React, { useState, ChangeEvent, useEffect } from "react";

const Map = () => {
  const [startLoc, setStartLoc] = useState<string>("");
  const [endLoc, setEndLoc] = useState<string>("");
  const [filename, setFilename] = useState<string | null>(null); // New state for filename

  const handleStartLocChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStartLoc(e.target.value);
  };

  const handleEndLocChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEndLoc(e.target.value);
  };

const handleSubmit = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/map', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        startLoc: startLoc,
        endLoc: endLoc,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.file_name) {
        setFilename(data.file_name);
      } else {
        console.error('No filename received from the server');
      }
    } else {
      console.error('Error fetching image filename:', response.status);
    }
  } catch (error) {
    console.error('Error fetching image filename', error);
  }
};


  // useEffect to handle initial loading or changes to the filename
  useEffect(() => {
    // Additional logic can be added here if needed
    if (filename) {
      // Placeholder for additional logic, e.g., perform some action or update the component state
      console.log('Filename changed:', filename);
      // Add your custom logic here
    }
  }, [filename]);

  return (
    <div className="container-fluid h-screen flex flex-row justify-between">
      <div className="flex-none h-[calc(100%-104px)] w-80 card">
        {/* Input for the start location */}
        <div className="mb-4 p-3 px-5">
          <label htmlFor="startLocation" className="block text-lg font-medium text-gray-10">
            Start Location
          </label>
          <input
            type="text"
            id="startLocation"
            name="start_loc"
            className="type_msg mt-1 p-1.5 px-3 w-full border rounded-[15px]"
            placeholder="Type the start location..."
            value={startLoc}
            onChange={handleStartLocChange}
          />
        </div>

        {/* Input for the end location */}
        <div className="mb-4 p-3 px-5">
          <label htmlFor="endLocation" className="block text-lg font-medium text-gray-10">
            End Location
          </label>
          <input
            type="text"
            id="endLocation"
            name="end_loc"
            className="type_msg mt-1 p-1.5 px-3 w-full border rounded-[15px]"
            placeholder="Type the end location..."
            value={endLoc}
            onChange={handleEndLocChange}
          />
        </div>

        {/* Button to submit the form */}
        <div className="mb-4 p-3 px-5">
          <button onClick={handleSubmit} className="bg-[rgba(124,75,75,0.72)] text-gray-10 p-3 px-5 rounded-[15px] hover:bg-vanilla hover:text-maroon">
            Find path
          </button>
        </div>
      </div>

      <div className="ml-4 flex-grow flex h-[calc(100%-104px)] justify-center items-center">
        <div className="flex justify-center items-center h-3/4 w-3/4"> {/* this div should be center */}
          {filename && (
            <img
              src={`${filename}`}
              alt="loc"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Map;
