import { seasonalItems } from "./productsAndIngredients";
import { seasonalMenu } from "./employee_pages/managerLandingFunctions";

export async function getSeasonalData() {
    const seasonalData = await seasonalMenu();
    for (const item of seasonalData) {
        const itemInfo = {
            name: item.name,
            price: item.price,
            image: 'images/transparentBack.png',
            modifications: [{type: '+', changes: []}, {type: '-', changes: []}],
            ingredients: item.inventory_items,
            custom: item.modify_items
        };
        seasonalItems.push(itemInfo);
    }
    console.log(seasonalItems);
}