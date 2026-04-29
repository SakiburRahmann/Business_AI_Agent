import { Client } from "pg";
import { NextResponse } from "next/server";

export async function GET() {
  const password = process.env.SUPABASE_DB_PASSWORD;
  if (!password) {
    return NextResponse.json({ error: "No DB password configured" }, { status: 500 });
  }

  // Try multiple connection approaches
  const attempts = [
    { host: "db.lwgziphajgqjkwqpfdop.supabase.co", port: 5432, user: "postgres" },
    { host: "db.lwgziphajgqjkwqpfdop.supabase.co", port: 6543, user: "postgres" },
    { host: "aws-0-ap-southeast-1.pooler.supabase.com", port: 5432, user: "postgres.lwgziphajgqjkwqpfdop" },
    { host: "aws-0-ap-southeast-1.pooler.supabase.com", port: 6543, user: "postgres.lwgziphajgqjkwqpfdop" },
  ];

  for (const attempt of attempts) {
    const client = new Client({
      host: attempt.host,
      port: attempt.port,
      database: "postgres",
      user: attempt.user,
      password: password,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 8000,
    });

    try {
      await client.connect();

      await client.query(`
        CREATE TABLE IF NOT EXISTS public.dental_bookings (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          patient_type TEXT, first_name TEXT, last_name TEXT, dob TEXT,
          email TEXT, phone TEXT, appointment_type TEXT, date_preference TEXT,
          time_preference TEXT, notes TEXT,
          source TEXT DEFAULT 'Form', status TEXT DEFAULT 'Pending',
          created_at TIMESTAMPTZ DEFAULT now()
        )
      `);
      await client.query("ALTER TABLE public.dental_bookings ENABLE ROW LEVEL SECURITY");
      await client.query("DROP POLICY IF EXISTS allow_all ON public.dental_bookings");
      await client.query("CREATE POLICY allow_all ON public.dental_bookings FOR ALL USING (true)");
      await client.query("NOTIFY pgrst, 'reload schema'");

      await client.end();
      return NextResponse.json({
        success: true,
        method: `${attempt.user}@${attempt.host}:${attempt.port}`,
      });
    } catch (e: any) {
      await client.end().catch(() => {});
      console.log(`Failed ${attempt.host}:${attempt.port}: ${e.message}`);
      continue;
    }
  }

  return NextResponse.json({ error: "All connection attempts failed" }, { status: 500 });
}
