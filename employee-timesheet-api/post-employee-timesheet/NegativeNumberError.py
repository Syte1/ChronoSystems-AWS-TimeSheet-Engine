class NegativeNumberError(Exception):
    """
    Custom exception class for handling cases where a negative number is not allowed.
    """
    def __init__(self, value):
        # Initialize the exception with the given value
        self.value = value
        # Create a descriptive error message
        self.message = f"Negative number not allowed: {value}."
        # Call the constructor of the base class (Exception) with the error message
        super().__init__(self.message)