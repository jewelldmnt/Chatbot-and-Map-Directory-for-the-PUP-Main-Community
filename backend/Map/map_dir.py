"""
map_dir.py - Module for mapping locations to image filenames.

This module provides a dictionary 'map_dict' that maps specific locations to a list of related locations.
It also contains a function 'find_image_filename' to find the corresponding image filename based on two locations.

Last edited: Feb 15, 2024
"""

import os

map_dict = {
    "main gate": ["visitor information center", "guard house"],
    "oval": ["track and football oval", "grandstand", "gabriela silang building"],
    "student canteen": ["linear park", "university canteen sampaguita building"],
    "university avenue": ["gazebo", "apolinario mabini shrine", "souvenir shop"],
    "tahanan ng alumni": ["swimming pool", "college of human kinetics building"],
    "main building": ["west wing", "south wing", "east wing"],
    "charlie del rosario": ["charlie del rosario hall"],
    "printing press": ["printing press building"],
    "chapel": ["interfaith chapel"],
    "library": ["ninoy aquino library and learning resources center"],
    "obelisk": ["mabini monument obelisk"]
}

def find_image_filename(pointA, pointB):
    """
    Find the image filename based on two locations.

    Parameters:
    - pointA (str): The starting location.
    - pointB (str): The ending location.

    Returns:
    - filename (str): The image filename if found, otherwise None.
    """
    print(f"pointA: {pointA}")
    print(f"pointB: {pointB}")
    pointA = pointA.lower()
    pointB = pointB.lower()

    # Check if pointA and pointB are values in the map_dict
    if pointA in [item for sublist in map_dict.values() if isinstance(sublist, list) for item in sublist]:
        pointA = [key for key, value in map_dict.items() if pointA in value][0]
    if pointB.lower() in [item for sublist in map_dict.values() if isinstance(sublist, list) for item in sublist]:
        pointB = [key for key, value in map_dict.items() if pointB in value][0]

    # Assuming the images are in the current working directory
    image_folder = "./frontend/public/assets/"
    
    # Construct both search strings
    pointA = pointA.replace(" ", "-")
    pointB = pointB.replace(" ", "-")
    search_string_1 = f"{pointA}_{pointB}"
    search_string_2 = f"{pointB}_{pointA}"
    
    print(f"search_string1: {search_string_1}")
    print(f"search_string2: {search_string_2}")

    # Loop through the files in the folder
    for filename in os.listdir(image_folder):
        # Check if either search string is present in the filename
        if search_string_1 in filename or search_string_2 in filename:
            return filename
    
    # If no matching filename is found
    return None

# Example usage:
pointA = "Mabini Monument Obelisk"
pointB = "Main Gate"
result = find_image_filename(pointA, pointB)

if result:
    print(f"Image filename found: {result}")
else:
    print("No matching image filename found.")
