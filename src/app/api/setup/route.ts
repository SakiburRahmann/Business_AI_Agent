import { Client } from "pg";
import { NextResponse } from "next/server";

export async function GET() {
  const client = new Client({
    host: "db.lwgziphajgqjkwqpfdop.supabase.co",
    port: 5432,
    database: "postgres",
    user: "postgres",
    password: process.env.SUPABASE_SERVICE_ROLE_KEY,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  try {
    await client.connect();

    await client.query(`
      CREATE TABLE IF NOT EXISTS public.dental_bookings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        patient_type TEXT,
        first_name TEXT,
        last_name TEXT,
        dob TEXT,
        email TEXT,
        phone TEXT,
        appointment_type TEXT,
        date_preference TEXT,
        time_preference TEXT,
        notes TEXT,
        source TEXT DEFAULT 'Form',
        status TEXT DEFAULT 'Pending',
        created_at TIMESTAMPTZ DEFAULT now()
      )
    `);

    await client.query(
      "ALTER TABLE public.dental_bookings ENABLE ROW LEVEL SECURITY"
    );
    await client.query(
      "DROP POLICY IF EXISTS allow_all ON public.dental_bookings"
    );
    await client.query(
      "CREATE POLICY allow_all ON public.dental_bookings FOR ALL USING (true)"
    );

    await client.end();
    return NextResponse.json({ success: true, message: "Table created!" });
  } catch (e: any) {
    await client.end().catch(() => {});
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
