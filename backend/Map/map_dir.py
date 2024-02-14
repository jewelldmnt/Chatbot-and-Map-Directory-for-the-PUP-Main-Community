import os

def find_image_filename(pointA, pointB):
    # Assuming the images are in the current working directory
    image_folder = "./backend/Map"
    
    # Construct both search strings
    pointA = pointA.lower().replace(" ", "-")
    pointB = pointB.lower().replace(" ", "-")
    search_string_1 = f"{pointA}_{pointB}"
    search_string_2 = f"{pointB}_{pointA}"

    # Loop through the files in the folder
    for filename in os.listdir(image_folder):
        # Check if either search string is present in the filename
        if search_string_1 in filename or search_string_2 in filename:
            return filename
    
    # If no matching filename is found
    return None

# Example usage:
pointA = "outdoor court"
pointB = "main gate"
result = find_image_filename(pointA, pointB)

if result:
    print(f"Image filename found: {result}")
else:
    print("No matching image filename found.")
