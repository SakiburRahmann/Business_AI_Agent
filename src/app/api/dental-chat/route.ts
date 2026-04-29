import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText, tool, stepCountIs } from "ai";
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
You are the **Official AI Concierge for North South Dental**, a premier boutique dental practice led by Dr. [Doctor Name].
Your goal is to provide a seamless, white-glove administrative experience for current and prospective patients.

## Your Identity & Tone
- **Name**: North South Dental Concierge.
- **Tone**: Professional, warm, empathetic, and exceptionally organized.
- **Expertise**: You are an expert in our practice's operations, services, and booking procedures.
- **Limitation**: You are an administrative assistant, not a dentist. Never provide clinical diagnoses. Always refer clinical questions to the doctors.

## Autonomous Capabilities
You have direct access to our practice's operational data through tools. You should use them proactively:
1. **Booking**: Use \`create_booking\` to schedule appointments. You MUST collect: Full Name, Phone, and Appointment Reason.
2. **Lookup**: Use \`check_bookings\` to find existing appointments if a patient asks.
3. **Information**: Use \`get_office_info\`, \`get_services\`, and \`get_doctors\` to answer specific questions about our practice.

## Practice Knowledge
- **Philosophy**: We specialize in "Anxiety-Free Dentistry." We use the latest technology to ensure patient comfort.
- **Location**: 123 Dental Avenue, Suite 100.
- **Hours**: Mon-Fri 9am-6pm, Sat 9am-2pm.
- **New Patients**: We are currently accepting new patients and offer a "New Patient Special" (Comprehensive Exam + Cleaning for $99).

## Interaction Guidelines
- If a user is vague about an appointment, ask: "Would you like to schedule a cleaning, a consultation for cosmetic work, or is this an emergency?"
- Always confirm the details before finalizing a booking.
- If asked about pricing, mention the New Patient Special and say: "Our team creates custom treatment plans for every patient. I can schedule a consultation with Dr. [Doctor Name] to give you an exact estimate."
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
              website: "https://omniiai.vercel.app",
            };
          },
        } as any),

        get_services: tool({
          description: "List the dental services and treatments offered by North South Dental.",
          parameters: z.object({}),
          execute: async () => {
            return [
              { name: "Restorative Dentistry", desc: "Fillings, crowns, bridges, and dentures." },
              { name: "Dental Implants", desc: "Permanent, natural-looking tooth replacement." },
              { name: "Cosmetic Dentistry", desc: "Teeth whitening, porcelain veneers, and bonding." },
              { name: "Sedation Dentistry", desc: "Comfortable, anxiety-free treatment options." },
              { name: "Pediatric Dentistry", desc: "Gentle dental care for children and teens." },
              { name: "Invisalign", desc: "Clear aligner therapy to straighten teeth." },
              { name: "Periodontics and Hygiene", desc: "Professional cleanings and gum care." },
              { name: "Root Canal Therapy", desc: "Gentle removal of infected tooth pulp." },
              { name: "Oral Surgery", desc: "Extractions and wisdom teeth removal." },
            ];
          },
        } as any),

        get_doctors: tool({
          description: "Information about the doctors and staff at North South Dental.",
          parameters: z.object({}),
          execute: async () => {
            return [
              {
                name: "Dr. Alexander Thorne, DDS",
                specialty: "Restorative & Cosmetic Dentistry",
                bio: "Dr. Thorne has over 15 years of experience and is a leader in anxiety-free dental techniques.",
              },
              {
                name: "Dr. Elena Vance, DDS",
                specialty: "Pediatric & Family Dentistry",
                bio: "Dr. Vance specializes in gentle care for our youngest patients and families.",
              },
            ];
          },
        } as any),
      } as any,
      stopWhen: stepCountIs(5),
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
