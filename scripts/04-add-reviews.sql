-- Reviews table
CREATE TABLE reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_approved ON reviews(is_approved);
CREATE INDEX idx_reviews_created_at ON reviews(created_at);

-- Function to calculate average rating for a product
CREATE OR REPLACE FUNCTION get_product_rating(product_id UUID)
RETURNS TABLE(average_rating DECIMAL, total_reviews INTEGER) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(ROUND(AVG(rating::DECIMAL), 1), 0) as average_rating,
    COUNT(*)::INTEGER as total_reviews
  FROM reviews 
  WHERE reviews.product_id = get_product_rating.product_id 
    AND is_approved = TRUE;
END;
$$ LANGUAGE plpgsql;

-- Insert sample reviews
INSERT INTO reviews (product_id, customer_name, customer_email, rating, title, comment) 
SELECT 
  p.id,
  CASE 
    WHEN random() < 0.33 THEN 'Sarah Johnson'
    WHEN random() < 0.66 THEN 'Michael Chen'
    ELSE 'Emma Williams'
  END,
  CASE 
    WHEN random() < 0.33 THEN 'sarah.j@email.com'
    WHEN random() < 0.66 THEN 'michael.c@email.com'
    ELSE 'emma.w@email.com'
  END,
  (4 + random())::INTEGER, -- Random rating between 4-5
  CASE 
    WHEN random() < 0.33 THEN 'Amazing quality!'
    WHEN random() < 0.66 THEN 'Love this product'
    ELSE 'Highly recommend'
  END,
  CASE 
    WHEN random() < 0.33 THEN 'This flame product exceeded my expectations. The quality is outstanding and it looks beautiful in my living room.'
    WHEN random() < 0.66 THEN 'Perfect addition to my home decor. The flame effect is mesmerizing and very realistic.'
    ELSE 'Great product with excellent craftsmanship. Fast shipping and great customer service too!'
  END
FROM products p
WHERE p.stock_quantity > 0
LIMIT 15; -- Add reviews to first 15 products
