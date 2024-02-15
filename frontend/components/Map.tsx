"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
import { LOC_OPTIONS } from "@/constants";

const Map = () => {
  const [startLoc, setStartLoc] = useState<string>("");
  const [endLoc, setEndLoc] = useState<string>("");
  const [startSuggestions, setStartSuggestions] = useState<string[]>([]);
  const [endSuggestions, setEndSuggestions] = useState<string[]>([]);
  const [filename, setFilename] = useState<string | null>(null);

  const handleStartLocChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setStartLoc(input);
    setStartSuggestions(filterSuggestions(input));
  };

  const handleEndLocChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setEndLoc(input);
    setEndSuggestions(filterSuggestions(input));
  };

  const filterSuggestions = (input: string) => {
    return LOC_OPTIONS.filter(option =>
      option.toLowerCase().includes(input.toLowerCase())
    );
  };

const handleSuggestionClick = (suggestion: string, locationType: "start" | "end") => {
  if (locationType === "start") {
    setStartLoc(suggestion);
    setStartSuggestions([]);
  } else if (locationType === "end") {
    setEndLoc(suggestion);
    setEndSuggestions([]);
  }
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
          setFilename(null); // Set filename to null if no filename is received
        }
      } else {
        console.error('Error fetching image filename:', response.status);
        setFilename(null); // Set filename to null if there's an error
      }
    } catch (error) {
      console.error('Error fetching image filename', error);
      setFilename(null); // Set filename to null if there's an error
    }
  };

  useEffect(() => {
    if (filename) {
      // Placeholder for additional logic, e.g., perform some action or update the component state
      console.log('Filename changed:', filename);
      // Add your custom logic here
    }
    // Event listener to close suggestion lists on outside click
    const closeSuggestionsOnOutsideClick = (e: MouseEvent) => {
      const isClickInsideStartSuggestions = document.getElementById("startLocation")?.contains(e.target as Node);
      const isClickInsideEndSuggestions = document.getElementById("endLocation")?.contains(e.target as Node);

      if (!isClickInsideStartSuggestions) {
        setStartSuggestions([]);
      }

      if (!isClickInsideEndSuggestions) {
        setEndSuggestions([]);
      }
    };

    // Adding the event listener
    document.addEventListener("click", closeSuggestionsOnOutsideClick);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("click", closeSuggestionsOnOutsideClick);
    };
  }, [filename]);

  return (
    <div className="container-fluid h-screen flex flex-row justify-between">
      <div className="flex-none h-[calc(100%-104px)] w-80 card">
        {/* Input for the start location */}
        <div className="mb-4 p-3 px-5 relative">
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
            autoComplete="off"
          />
          {startSuggestions.length > 0 && (
            <ul className="suggestions-list absolute top-full left-0 w-full bg-white border border-gray-300 rounded-b-[15px] z-10">
              {startSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion, "start")}
                  className="suggestion-item p-2 cursor-pointer hover:bg-gray-200"
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}  
        </div>

        {/* Input for the end location */}
        <div className="mb-4 p-3 px-5 relative">
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
            autoComplete="off"
          />
          {endSuggestions.length > 0 && (
            <ul className="suggestions-list absolute top-full left-0 w-full bg-white border border-gray-300 rounded-b-[15px] z-10">
              {endSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion, "end")}
                  className="suggestion-item p-2 cursor-pointer hover:bg-gray-200"
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
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
              src={`assets/${filename}`}
              alt="loc"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Map;
