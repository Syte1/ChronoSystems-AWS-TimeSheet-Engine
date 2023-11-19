import json
from decimal import Decimal

class DecimalEncoder(json.JSONEncoder):
    """
    Custom JSON encoder for handling Decimal objects.
    """
    def default(self, obj):
        if isinstance(obj, Decimal):
            return str(obj)
        return super(DecimalEncoder, self).default(obj)
