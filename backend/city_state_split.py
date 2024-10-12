import csv
import json

# Example mapping of state abbreviations to full state names
state_abbr_to_full = {
    'AL': 'Alabama',
    'AK': 'Alaska',
    'AZ': 'Arizona',
    'AR': 'Arkansas',
    'CA': 'California',
    'CO': 'Colorado',
    'CT': 'Connecticut',
    'DE': 'Delaware',
    'FL': 'Florida',
    'GA': 'Georgia',
    'HI': 'Hawaii',
    'ID': 'Idaho',
    'IL': 'Illinois',
    'IN': 'Indiana',
    'IA': 'Iowa',
    'KS': 'Kansas',
    'KY': 'Kentucky',
    'LA': 'Louisiana',
    'ME': 'Maine',
    'MD': 'Maryland',
    'MA': 'Massachusetts',
    'MI': 'Michigan',
    'MN': 'Minnesota',
    'MS': 'Mississippi',
    'MO': 'Missouri',
    'MT': 'Montana',
    'NE': 'Nebraska',
    'NV': 'Nevada',
    'NH': 'New Hampshire',
    'NJ': 'New Jersey',
    'NM': 'New Mexico',
    'NY': 'New York',
    'NC': 'North Carolina',
    'ND': 'North Dakota',
    'OH': 'Ohio',
    'OK': 'Oklahoma',
    'OR': 'Oregon',
    'PA': 'Pennsylvania',
    'RI': 'Rhode Island',
    'SC': 'South Carolina',
    'SD': 'South Dakota',
    'TN': 'Tennessee',
    'TX': 'Texas',
    'UT': 'Utah',
    'VT': 'Vermont',
    'VA': 'Virginia',
    'WA': 'Washington',
    'WV': 'West Virginia',
    'WI': 'Wisconsin',
    'WY': 'Wyoming'
}


# Load and process the region_entries.txt
def process_region_entries(file_path):
    state_city_map = {}

    with open(file_path, 'r') as file:
        reader = csv.reader(file)
        
        for row in reader:
            print(row)
            city = row[0].strip()
            state_abbr = row[1].strip()

            # Get full state name from abbreviation
            full_state_name = state_abbr_to_full.get(state_abbr)

            if full_state_name:
                if full_state_name not in state_city_map:
                    state_city_map[full_state_name] = []
                # Store city with its original format "City, Abbreviation"
                state_city_map[full_state_name].append(f"{city}, {state_abbr}")
    
    # Convert to JSON-like structure for easy consumption
    with open('state_city_map.json', 'w') as outfile:
        json.dump(state_city_map, outfile, indent=4)

# Example usage
process_region_entries('region_entries.txt')