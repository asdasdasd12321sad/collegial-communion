
-- Create a function for incrementing values atomically
CREATE OR REPLACE FUNCTION increment(row_id uuid, inc integer)
RETURNS void AS $$
BEGIN
  UPDATE counters SET value = value + inc WHERE id = row_id;
END;
$$ LANGUAGE plpgsql;
