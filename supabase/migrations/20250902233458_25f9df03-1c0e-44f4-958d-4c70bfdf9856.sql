-- Add missing foreign key relationships for translations tables

-- Add foreign key for menu_item_translations
ALTER TABLE menu_item_translations 
ADD CONSTRAINT fk_menu_item_translations_menu_item_id 
FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE;

-- Add foreign key for menu_category_translations  
ALTER TABLE menu_category_translations 
ADD CONSTRAINT fk_menu_category_translations_category_id 
FOREIGN KEY (category_id) REFERENCES menu_categories(id) ON DELETE CASCADE;

-- Add foreign key for restaurant_languages
ALTER TABLE restaurant_languages 
ADD CONSTRAINT fk_restaurant_languages_restaurant_id 
FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE;

-- Add foreign key for restaurant_currencies
ALTER TABLE restaurant_currencies 
ADD CONSTRAINT fk_restaurant_currencies_restaurant_id 
FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE;