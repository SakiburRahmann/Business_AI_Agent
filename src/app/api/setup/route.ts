import { Client } from "pg";
import { NextResponse } from "next/server";

export async function GET() {
  const passwords = [
    process.env.SUPABASE_DB_PASSWORD,
    "IAmTheMan20040113",
    "IAmTheMan!20040113!",
  ].filter(Boolean);

  const attempts = [
    { host: "db.lwgziphajgqjkwqpfdop.supabase.co", port: 5432, user: "postgres" },
    { host: "db.lwgziphajgqjkwqpfdop.supabase.co", port: 6543, user: "postgres" },
    { host: "aws-0-ap-southeast-1.pooler.supabase.com", port: 5432, user: "postgres.lwgziphajgqjkwqpfdop" },
    { host: "aws-0-ap-southeast-1.pooler.supabase.com", port: 6543, user: "postgres.lwgziphajgqjkwqpfdop" },
    { host: "aws-0-us-east-1.pooler.supabase.com", port: 5432, user: "postgres.lwgziphajgqjkwqpfdop" },
    { host: "aws-0-us-east-1.pooler.supabase.com", port: 6543, user: "postgres.lwgziphajgqjkwqpfdop" },
  ];

  const errors: string[] = [];

  for (const pw of passwords) {
    for (const a of attempts) {
      const client = new Client({
        host: a.host, port: a.port, database: "postgres",
        user: a.user, password: pw,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 6000,
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
        return NextResponse.json({ success: true, method: `${a.user}@${a.host}:${a.port}` });
      } catch (e: any) {
        errors.push(`${a.user}@${a.host}:${a.port} pw=${pw?.slice(0,5)}... => ${e.message.slice(0, 60)}`);
        await client.end().catch(() => {});
      }
    }
  }

  return NextResponse.json({ error: "All failed", details: errors }, { status: 500 });
}
