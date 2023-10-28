import csv
import random
from datetime import datetime, timedelta

start_date = datetime(2022, 4, 1)
end_date = datetime(2023, 4, 1)
mean = 3.5
stdev = 1.25
name = ""
price = 0.0

def updateCsv(product_id, order_id, result, date_ordered):
    if result == 0:
        result += 1
    for j in range(result):
        product_number = random.randint(1,39)
        with open('menu.csv', newline='') as menu:
            reader = csv.reader(menu)
            next(menu)
            for row in reader:
                if int(row[0]) == product_number:
                    name = row[1]
                    price = float(row[2])
                    break
        writer.writerow([product_id, order_id, product_number, name, price, date_ordered])
        product_id += 1
    return product_id

with open('product.csv', mode='w', newline='') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(['product_id', 'order_id', 'product_number', 'name', 'price', 'date_ordered'])
    
    current_date = start_date 
    product_id = 1
    order_id = 1   
    while current_date != end_date:
        date_ordered = current_date.strftime('%m/%d/%Y')
        order_day = random.randint(240, 280)
        
        for i in range(order_day):
            result = 0
            while result == 0:
                result = int(random.normalvariate(3.5, 1.25))
            product_id = updateCsv(product_id, order_id, result, date_ordered)
            order_id += 1

        current_date += timedelta(days=1)