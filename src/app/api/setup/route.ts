import { Client } from "pg";
import { NextResponse } from "next/server";

export async function GET() {
  const password = process.env.SUPABASE_DB_PASSWORD || "IAmTheMan!20040113!";
  
  // Try connecting via IPv6 address directly since Vercel has IPv6
  const ipv6 = "2406:da1a:6b0:f62a:7b89:758d:199e:8257";
  
  const attempts = [
    { host: ipv6, port: 5432, user: "postgres" },
    { host: "db.lwgziphajgqjkwqpfdop.supabase.co", port: 5432, user: "postgres" },
  ];

  const errors: string[] = [];

  for (const a of attempts) {
    const client = new Client({
      host: a.host,
      port: a.port,
      database: "postgres",
      user: a.user,
      password: password,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 10000,
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
      return NextResponse.json({ success: true, method: `${a.user}@[${a.host}]:${a.port}` });
    } catch (e: any) {
      await client.end().catch(() => {});
      errors.push(`Attempt ${a.host}:${a.port} failed: ${e.message}`);
    }
  }

  return NextResponse.json({ error: "All connection attempts failed", details: errors }, { status: 500 });
}
