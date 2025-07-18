-- Insert sample admin user (password: admin123)
INSERT INTO admin_users (email, password_hash, full_name) VALUES 
('admin@flames.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'Admin User');

-- Insert sample products
INSERT INTO products (name, description, price, image_url, category, stock_quantity, is_featured, is_new_arrival) VALUES 
('Eternal Flame Candle', 'A beautiful candle that burns with an eternal flame effect', 29.99, '/placeholder.svg?height=400&width=400', 'Candles', 50, true, true),
('Dragon Fire Torch', 'Professional torch with dragon-inspired flame design', 89.99, '/placeholder.svg?height=400&width=400', 'Torches', 25, true, false),
('Mystic Flame Lamp', 'LED lamp that simulates mystical flame effects', 45.99, '/placeholder.svg?height=400&width=400', 'Lamps', 30, false, true),
('Fire Crystal Set', 'Set of 3 crystal flames for decoration', 19.99, '/placeholder.svg?height=400&width=400', 'Decorative', 100, false, false),
('Phoenix Flame Sculpture', 'Handcrafted phoenix with flame details', 129.99, '/placeholder.svg?height=400&width=400', 'Sculptures', 15, true, true),
('Campfire Simulator', 'Realistic campfire effect for indoor use', 79.99, '/placeholder.svg?height=400&width=400', 'Electronics', 20, false, false),
('Flame Essential Oil Diffuser', 'Aromatherapy diffuser with flame-like mist', 39.99, '/placeholder.svg?height=400&width=400', 'Wellness', 40, false, true),
('Fire Opal Pendant', 'Jewelry piece with fire opal flame design', 199.99, '/placeholder.svg?height=400&width=400', 'Jewelry', 12, true, false);
