import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText, tool } from "ai";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

export const maxDuration = 60;

const googleClient = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

const model = googleClient("gemma-4-31b-it");

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

const DENTAL_SYSTEM_PROMPT = `
You are the AI Concierge for **North South Dental**, a premier boutique dental practice.
Your name is "North South Dental Assistant".

## About the Practice
- **Doctor**: Dr. [Doctor Name], DDS — with over 15 years of experience in restorative and cosmetic dentistry.
- **Philosophy**: Patient-first, anxiety-free, evidence-based dental care.
- **Location**: Serving the local community with state-of-the-art facilities.
- **Hours**: Monday–Friday 9 AM – 6 PM, Saturday 9 AM – 2 PM, Closed Sunday.

## Services Offered
1. Restorative Dentistry (fillings, crowns, bridges, dentures)
2. Dental Implants
3. Cosmetic Dentistry (whitening, veneers, bonding)
4. Sedation Dentistry
5. Pediatric Dentistry
6. Invisalign (clear aligners)
7. Periodontics and Hygiene
8. Root Canal Therapy
9. Oral Surgery (extractions, wisdom teeth)

## Your Behavior
- Be warm, professional, and reassuring — many patients have dental anxiety.
- Answer questions about services, procedures, pricing philosophy, and office hours.
- If pricing is asked, say that pricing varies based on treatment plans and insurance coverage, and suggest booking a consultation.
- When a patient wants to book an appointment, use the **create_booking** tool. Collect: first name, last name, phone number, appointment type, and preferred date/time. Ask for any missing required info before booking.
- When a patient wants to check existing bookings, use the **check_bookings** tool.
- After creating a booking, confirm the details and let them know the office will confirm the exact time.
- Keep responses concise and helpful. Use a warm, conversational tone.
- If asked about something unrelated to dentistry, politely redirect to dental topics.
- NEVER make up specific prices or availability times — always recommend scheduling a consultation.
`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response("Invalid request", { status: 400 });
    }

    const result = streamText({
      model,
      system: DENTAL_SYSTEM_PROMPT,
      messages: messages as any,
      tools: {
        create_booking: tool({
          description:
            "Create a new dental appointment booking for a patient. Use this when a patient wants to schedule an appointment. You must have at minimum: first_name, last_name, and phone.",
          parameters: z.object({
            first_name: z.string().describe("Patient's first name"),
            last_name: z.string().describe("Patient's last name"),
            phone: z.string().describe("Patient's phone number"),
            email: z
              .string()
              .optional()
              .describe("Patient's email address"),
            patient_type: z
              .enum(["new", "existing"])
              .optional()
              .describe("Whether this is a new or existing patient"),
            appointment_type: z
              .string()
              .optional()
              .describe(
                "Type of appointment, e.g. Checkup, Cleaning, Consultation, Cosmetic, Emergency"
              ),
            date_preference: z
              .string()
              .optional()
              .describe(
                "Preferred date for the appointment, e.g. '2026-05-15' or 'next Monday'"
              ),
            time_preference: z
              .string()
              .optional()
              .describe(
                "Preferred time slot, e.g. 'Morning', 'Afternoon', '10:00 AM'"
              ),
            notes: z
              .string()
              .optional()
              .describe("Any additional notes or concerns from the patient"),
          }),
          execute: async (params: any) => {
            const supabase = getSupabase();
            const { data, error } = await supabase
              .from("dental_bookings")
              .insert([
                {
                  first_name: params.first_name,
                  last_name: params.last_name,
                  phone: params.phone,
                  email: params.email || null,
                  patient_type: params.patient_type || "new",
                  appointment_type: params.appointment_type || "General Consultation",
                  date_preference: params.date_preference || null,
                  time_preference: params.time_preference || null,
                  notes: params.notes || null,
                  source: "AI",
                  status: "Pending",
                },
              ])
              .select()
              .single();

            if (error) {
              return { success: false, error: error.message };
            }
            return {
              success: true,
              booking_id: data.id,
              message: `Appointment booked for ${params.first_name} ${params.last_name}. The office will confirm the exact time shortly.`,
            };
          },
        } as any),

        check_bookings: tool({
          description:
            "Look up existing bookings by patient phone number or name. Use this when a patient wants to check their appointment status.",
          parameters: z.object({
            phone: z
              .string()
              .optional()
              .describe("Patient's phone number to search by"),
            name: z
              .string()
              .optional()
              .describe("Patient's name to search by"),
          }),
          execute: async (params: any) => {
            const supabase = getSupabase();
            let query = supabase
              .from("dental_bookings")
              .select("id, first_name, last_name, appointment_type, date_preference, time_preference, status, created_at")
              .order("created_at", { ascending: false })
              .limit(5);

            if (params.phone) {
              query = query.eq("phone", params.phone);
            }
            if (params.name) {
              query = query.or(
                `first_name.ilike.%${params.name}%,last_name.ilike.%${params.name}%`
              );
            }

            const { data, error } = await query;

            if (error) {
              return { success: false, error: error.message };
            }
            if (!data || data.length === 0) {
              return { success: true, bookings: [], message: "No bookings found." };
            }
            return { success: true, bookings: data };
          },
        } as any),

        get_office_info: tool({
          description: "Get current office hours, location, and contact information.",
          parameters: z.object({}),
          execute: async () => {
            return {
              name: "North South Dental",
              hours: {
                weekdays: "Monday – Friday: 9:00 AM – 6:00 PM",
                saturday: "Saturday: 9:00 AM – 2:00 PM",
                sunday: "Sunday: Closed",
              },
              phone: "(555) 234-5678",
              email: "info@northsouthdental.com",
              address: "123 Dental Avenue, Suite 100",
            };
          },
        } as any),
      } as any,
    });

    return result.toUIMessageStreamResponse();
  } catch (error: any) {
    console.error("Dental Chat Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Something went wrong" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
