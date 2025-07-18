-- Function to decrease product stock
CREATE OR REPLACE FUNCTION decrease_stock(product_id UUID, quantity INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE products 
  SET stock_quantity = stock_quantity - quantity,
      updated_at = NOW()
  WHERE id = product_id AND stock_quantity >= quantity;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient stock for product %', product_id;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to get product categories
CREATE OR REPLACE FUNCTION get_categories()
RETURNS TABLE(category VARCHAR) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT p.category
  FROM products p
  WHERE p.stock_quantity > 0
  ORDER BY p.category;
END;
$$ LANGUAGE plpgsql;
