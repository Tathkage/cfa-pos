import csv
import random

with open('order.csv', mode='w', newline='') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(['order_id', 'cost', 'kiosk_number', 'date_ordered'])
    
    current_order_id = 1
    current_date = "04/01/2022"
    cost = 0
    with open('product.csv', newline='') as product:
        reader = csv.reader(product)
        next(reader)
        for row in reader:
            order_id = int(row[1])
            price = float(row[4])
            date_ordered = row[5]
            if current_order_id == order_id:
                cost += price
            else:
                kiosk_number = random.randint(1,4)
                cost = round(cost, 2)
                writer.writerow([current_order_id, cost, kiosk_number, current_date])
                current_date = date_ordered
                current_order_id = order_id
                cost = 0
                cost += price