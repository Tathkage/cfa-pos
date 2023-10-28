import csv
import random
from datetime import datetime, timedelta

# Define the date range for arrival_date and expiration_date
start_date = datetime.strptime('2/20/2023', '%m/%d/%Y')
end_date = datetime.strptime('2/27/2023', '%m/%d/%Y')
exp_start_date = datetime.strptime('3/6/2023', '%m/%d/%Y')
exp_end_date = datetime.strptime('3/13/2023', '%m/%d/%Y')

# Create a list of inventory_ids from 1 to 96
inventory_ids = list(range(1, 98))

# Create a list of manager_ids with 96 elements of 02519
manager_ids = ['02519'] * 97

# Create a list of quantities with 96 random integers between 10 and 50
quantities = [random.randint(10, 50) for _ in range(97)]

# Create a list of arrival_dates with 96 random dates between start_date and end_date
arrival_dates = [(start_date + timedelta(days=random.randint(0, 7))).strftime('%m/%d/%Y') for _ in range(97)]

# Create a list of expiration_dates with 96 random dates between exp_start_date and exp_end_date
expiration_dates = [(exp_start_date + timedelta(days=random.randint(0, 7))).strftime('%m/%d/%Y') for _ in range(97)]

# Create a list of empty names with 96 elements
names = [''] * 97

# Combine the lists into a list of rows
rows = zip(inventory_ids, names, arrival_dates, expiration_dates, quantities)

# Write the rows to a CSV file
with open('inventory.csv', 'w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(['inventory_id', 'name', 'arrival_date', 'expiration_date', 'quantity'])
    for row in rows:
        writer.writerow(row)
