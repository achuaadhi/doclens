import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://obnyqpcvabfjihofxtzh.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ibnlxcGN2YWJmamlob2Z4dHpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyOTMyMjcsImV4cCI6MjA4Nzg2OTIyN30.rKGL6afbs9bkfoi2DXl3QBPccb_ovtzQBNNWco-MBuk';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
