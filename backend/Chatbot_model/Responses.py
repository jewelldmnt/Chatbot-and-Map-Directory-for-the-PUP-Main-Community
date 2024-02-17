"""
Response.py - Module for generating various responses.

This module defines a class 'Response' that provides methods for generating responses related to date, time,
grade equivalencies, and dean information for specific colleges.

Last edited: Feb 15, 2024
"""



from time import strftime

class Response():
    def __init__(self) -> None:
        pass
    
    
    def get_date_response(self):
        """
        Get the current date response.

        Returns:
        - str: The response indicating the current date.
        """
        day = strftime("%A")
        date = strftime("%B %d, %Y")
        return f"Today is {day}, {date}"
    
    
    def get_time_response(self):
        """
        Get the current time response.

        Returns:
        - str: The response indicating the current time.
        """
    
        time_today = strftime("%I: %M %p")
        return f"It is {time_today}."
    
#####################################################################
# FOR GETTING THE GRADE EQUIVALENCES
#####################################################################
    def get_specific_grade_equivalency_response(self, user_query):  
        """
        Get the equivalent grade response based on the user's query.

        Parameters:
        - user_query (str): The user's input query containing a numerical grade.

        Returns:
        - str: The response indicating the equivalent grade or an error message.
        """
        grade_eq_dict = self.build_grade_equivalents_dictionary()
        
        grade = self.extract_grade_from_query(user_query)
        equivalent = grade_eq_dict.get(grade, "Unknown grade")

        if equivalent == "Unknown grade":
            return self.invalid_grade_response(grade)
        else:
            return f"The equivalent grade of {grade} is {equivalent}."
    
    
    def extract_grade_from_query(self, user_query):
        """
        Extract the numerical grade from the user's query.

        Parameters:
        - user_query (str): The user's input query.

        Returns:
        - str: The extracted numerical grade or "Unknown" if not found.
        """
        words = user_query.split()
        for word in words:
            if word.replace('.', '').isdigit():
                return word

        return "Unknown"
    
    
    def build_grade_equivalents_dictionary(self):
        """
        Build a dictionary containing grade equivalents and their corresponding ranges.

        Returns:
        - dict: A dictionary mapping numerical grades to their equivalent ranges.
        """
        grade_equivalents = {
            "1.0": "97-100 Excellent",
            "1.25": "94-96 Excellent",
            "1.5": "91-93 Very Good",
            "1.75": "88-90 Very Good",
            "2.0": "85-87 Good",
            "2.25": "82-84 Good",
            "2.5": "79-81 Satisfactory",
            "2.75": "76-78 Satisfactory",
            "3.0": "75 Passing",
            "5.0": "65-74 Failure",
            "Inc.": "Incomplete",
            "W": "Withdrawn",
            **{str(grade): "1.0 Excellent" for grade in range(97, 101)},
            **{str(grade): "1.25 Excellent" for grade in range(94, 97)},
            **{str(grade): "1.5 Very Good" for grade in range(91, 94)},
            **{str(grade): "1.75 Very Good" for grade in range(88, 91)},
            **{str(grade): "2.0 Good" for grade in range(85, 88)},
            **{str(grade): "2.25 Good" for grade in range(82, 85)},
            **{str(grade): "2.5 Satisfactory" for grade in range(79, 82)},
            **{str(grade): "2.75 Satisfactory" for grade in range(76, 79)},
            "75": "3.0 Passing",
            **{str(grade): "5.0 Failure" for grade in range(65, 75)},
        }
        return grade_equivalents
    
    
    def invalid_grade_response(self, grade):
        """
        Generate an invalid grade response.

        Parameters:
        - grade (str): The invalid grade.

        Returns:
        - str: The response indicating an invalid grade and providing a list of valid grades.
        """
        return f"I'm sorry, but {grade} is an invalid grade. The valid grades are:\n\
            1.0: 97-100 Excellent\n\
            1.25: 94-96 Excellent\n\
            1.5: 91-93 Very Good\n\
            1.75: 88-90 Very Good\n\
            2.0: 85-87 Good\n\
            2.25: 82-84 Good\n\
            2.5: 79-81 Satisfactory\n\
            2.75: 76-78 Satisfactory\n\
            3.0: 75 Passing\n\
            5.0: 65-74 Failure\n\
            Inc.: Incomplete\n\
            W: Withdrawn"
            
            
#####################################################################
# FOR GETTING THE DEAN RESPONSES
#####################################################################
    def get_dean_response(self, user_query):
        """
        Get the dean's response for a specified college.

        Parameters:
        - user_query (str): The user's input query containing a college abbreviation.

        Returns:
        - str: The response indicating the dean of the specified college or an error message.
        """
        college = self.extract_college_abbreviation(user_query)
        deans = self.build_deans_dictionary()
        dean = deans.get(college, "Unknown college")

        if dean == "Unknown college":
            return "Sorry I cannot answer your question"
        else:
            return f"The dean of {college} is {dean}."
    
    
    def build_deans_dictionary(self):
        """
        Build a dictionary containing colleges and their respective deans.

        Returns:
        - dict: A dictionary mapping college abbreviations to their deans.
        """
        deans = {
            "CL": "Gemy Lito L. Festin, LL.M.",
            "CAF": "Julieta G. Fonte, PhD",
            "CADBE": "Ar. Jocelyn A. Rivera-Lutap, FUAP, MSArch, DPA",
            "CAL": "Romeo P. Peña, PhD",
            "CBA": "Cindy F. Soliman, DBA",
            "COC": "Hemmady S. Mora, EdD",
            "CCIS": "Benilda Eleonor V. Comendador, DIT",
            "COED": "Minna L. Comuyog, DEM and the Associate Dean is Caroline T. Sumande, DEM",
            "CE": "Remedios G. Ado, DEM",
            "CHK": "Lualhati A. Dela Cruz, MPES",
            "CPSPA": "Elmer M. Soriano, MPA and the Associate Dean is Christopher C. Mantillas, PhD",
            "CS": "Lincoln A. Bautista, PhD",
            "CSSD": "Raul Roland R. Sebastian, DPA",
            "CTHTM": "Lizbette R. Vergara, MEM",
        }
        return deans


    def extract_college_abbreviation(self, user_query):
        """
        Extract the college from the user's query.

        Parameters:
        - user_query (str): The user's input query.

        Returns:
        - str: The extracted college abbreviation or "Unknown" if not found.
        """
        user_query_lower = user_query.lower()
        colleges_list = [
            "CL", "College of Law",
            "CAF", "College of Accountancy and Finance",
            "CADBE", "College of Architecture, Design and the Built Environment",
            "CAL", "College of Arts and Letters",
            "CBA", "College of Business Administration",
            "CCIS", "College of Computer and Information Sciences",
            "COC", "College of Communication",
            "COED", "College of Education",
            "CE", "College of Engineering",
            "CHK", "College of Human Kinetics",
            "CPSPA", "College of Political Science and Public Administration",
            "CS", "College of Science",
            "CSSD", "College of Social Sciences and Development",
            "CTHTM", "College of Tourism, Hospitality and Transportation Management",
        ]
        
        college_abbr = {
            "CL": "College of Law",
            "CAF": "College of Accountancy and Finance",
            "CADBE": "College of Architecture, Design and the Built Environment",
            "CAL": "College of Arts and Letters",
            "CBA": "College of Business Administration",
            "CCIS": "College of Computer and Information Sciences",
            "COC": "College of Communication",
            "COED": "College of Education",
            "CE": "College of Engineering",
            "CHK": "College of Human Kinetics",
            "CPSPA": "College of Political Science and Public Administration",
            "CS": "College of Science",
            "CSSD": "College of Social Sciences and Development",
            "CTHTM": "College of Tourism, Hospitality and Transportation Management",
        }

        for college_text in colleges_list:
            if f' {college_text.lower()} ' in f' {user_query_lower} ':
                if college_text in college_abbr.values():
                    # If the given value is found in the values of college_abbr,
                    # return the corresponding key
                    for key, value in college_abbr.items():
                        if value == college_text:
                            return key
                else:
                    # If the given is not a value, return the original college abbreviation
                    return college_text

        # If no match is found, return "Unknown"
        return "Unknown"


