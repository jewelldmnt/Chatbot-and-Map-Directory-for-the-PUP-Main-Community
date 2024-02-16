/*
  Map.tsx - React component for handling the map functionality.

  This component defines an interface for users to input start and end locations,
  submit the form to fetch a map image, and display the map image.

  Last edited: Feb 15, 2024
*/

"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
import { LOC_OPTIONS } from "@/constants";

const Map = () => {
  /**
   * Map - React component for handling map functionality.
   *
   * This component includes input fields for start and end locations, suggestions based on user input,
   * form submission to fetch a map image, and display of the fetched map image.
   *
   * @returns {JSX.Element} The JSX representation of the Map component.
   */
  const [startLoc, setStartLoc] = useState<string>("");
  const [endLoc, setEndLoc] = useState<string>("");
  const [startSuggestions, setStartSuggestions] = useState<string[]>([]);
  const [endSuggestions, setEndSuggestions] = useState<string[]>([]);
  const [filename, setFilename] = useState<string | null>("map.png");

  const handleStartLocChange = (e: ChangeEvent<HTMLInputElement>) => {
    /**
     * handleStartLocChange - Handles changes in the start location input.
     *
     * @param {ChangeEvent<HTMLInputElement>} e - The input change event.
     */
    const input = e.target.value;
    setStartLoc(input);
    setStartSuggestions(filterSuggestions(input));
  };

  const handleEndLocChange = (e: ChangeEvent<HTMLInputElement>) => {
    /**
     * handleEndLocChange - Handles changes in the end location input.
     *
     * @param {ChangeEvent<HTMLInputElement>} e - The input change event.
     */
    const input = e.target.value;
    setEndLoc(input);
    setEndSuggestions(filterSuggestions(input));
  };

  const filterSuggestions = (input: string) => {
    /**
     * filterSuggestions - Filters location suggestions based on user input.
     *
     * @param {string} input - The user input for location suggestions.
     * @returns {string[]} An array of filtered location suggestions.
     */
    return LOC_OPTIONS.filter((option) =>
      option.toLowerCase().includes(input.toLowerCase())
    );
  };

  const handleSuggestionClick = (
    suggestion: string,
    locationType: "start" | "end"
  ) => {
    /**
     * handleSuggestionClick - Handles a click on a location suggestion.
     *
     * @param {string} suggestion - The selected location suggestion.
     * @param {"start" | "end"} locationType - The type of location (start or end).
     */
    if (locationType === "start") {
      setStartLoc(suggestion);
      setStartSuggestions([]);
    } else if (locationType === "end") {
      setEndLoc(suggestion);
      setEndSuggestions([]);
    }
  };

  const handleSubmit = async () => {
    /**
     * handleSubmit - Submits the form to fetch the map image based on start and end locations.
     */
    try {
      const response = await fetch("http://localhost:5000/api/map", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startLoc: startLoc,
          endLoc: endLoc,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.file_name) {
          setFilename(`assets/${data.file_name}`); // Construct file path based on backend response
        } else {
          console.error("No filename received from the server");
          setFilename("map.png"); // Set default image filename if no filename is received
        }
      } else {
        console.error("Error fetching image filename:", response.status);
        setFilename("map.png"); // Set default image filename if there's an error
      }
    } catch (error) {
      console.error("Error fetching image filename", error);
      setFilename("map.png"); // Set default image filename if there's an error
    }
  };

  const [zoomLevel, setZoomLevel] = useState<number>(100);

  const handleZoomIn = () => {
    /**
     * handleZoomIn - Handles zooming in on the map image.
     */
    setZoomLevel((prevZoom) => Math.min(prevZoom + 10, 200)); // Increase zoom level, limit to 200%
  };

  const handleZoomOut = () => {
    /**
     * handleZoomOut - Handles zooming out on the map image.
     */
    setZoomLevel((prevZoom) => Math.max(prevZoom - 10, 10)); // Decrease zoom level, limit to 10%
  };

  useEffect(() => {
    /**
     * useEffect - React useEffect hook to handle filename changes and add an event listener.
     */
    if (filename) {
      console.log("Filename changed:", filename);
    }
    // Event listener to close suggestion lists on outside click
    const closeSuggestionsOnOutsideClick = (e: MouseEvent) => {
      const isClickInsideStartSuggestions = document
        .getElementById("startLocation")
        ?.contains(e.target as Node);
      const isClickInsideEndSuggestions = document
        .getElementById("endLocation")
        ?.contains(e.target as Node);

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
      <div className="flex-none pt-[12px] h-[calc(100%-104px)] w-80 rounded-t-3xl bg-black bg-opacity-40">
        {/* Input for the start location */}
        <div className="mb-4 p-3 px-5 relative">
          <label
            htmlFor="startLocation"
            className="block text-lg font-medium text-gray-10"
          >
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
          <label
            htmlFor="endLocation"
            className="block text-lg font-medium text-gray-10"
          >
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
          <button
            onClick={handleSubmit}
            className="bg-[rgba(124,75,75,0.72)] text-gray-10 p-3 px-5 rounded-[15px] hover:bg-vanilla hover:text-maroon"
          >
            Find path
          </button>
        </div>
      </div>

      <div className="ml-4 flex-grow flex h-[calc(100%-104px)] justify-center items-center">
        <div className="flex justify-center items-center h-3/4 w-3/4">
          {" "}
          <div className="relative" style={{ overflow: "hidden" }}>
            <img
              src={`${filename}`}
              alt="loc"
              style={{ transform: `scale(${zoomLevel / 100})` }}
            />
            {/* Zoom buttons for map image */}
            <div className="absolute bottom-0 left-0 p-2">
              <button
                onClick={handleZoomIn}
                className="bg-gray-50 h-[40px] w-[27px] text-white p-2 mr-2 rounded-md hover:bg-maroon hover:text-vanilla"
              >
                +
              </button>
              <button
                onClick={handleZoomOut}
                className="bg-gray-50 h-[40px] w-[27px] text-white p-2 rounded-md hover:bg-maroon hover:text-vanilla"
              >
                -
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
