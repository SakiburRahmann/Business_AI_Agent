const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBookings() {
  const { data, error } = await supabase.from('dental_bookings').select('*');
  if (error) {
    console.error("Error fetching bookings:", error);
  } else {
    console.log("Bookings:", data);
  }
}

checkBookings();
