from time import strftime

class Response():
    def __init__(self) -> None:
        pass
    
    def get_date_response(self):
        day = strftime("%A")
        date = strftime("%B %d %Y")
        return f"Today is {day}, {date}"
    
    def get_time_response(self):
        time_today = strftime("%I: %M %p")
        return f"It is {time_today}."
    
    def get_specific_grade_equivalency_response(self, user_query):
        grade = self.extract_grade_from_query(user_query)
        grade_equivalents = self.build_grade_equivalents_dictionary()
        equivalent = grade_equivalents.get(grade, "Unknown grade")

        if equivalent == "Unknown grade":
            return self.invalid_grade_response(grade)
        else:
            return f"The equivalent grade of {grade} is {equivalent}."
    
    def extract_grade_from_query(self, user_query):
        words = user_query.split()
        for word in words:
            if word.replace('.', '').isdigit():
                return word

        return "Unknown"
    
    
    def invalid_grade_response(self, grade):
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