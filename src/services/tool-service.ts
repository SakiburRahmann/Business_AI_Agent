import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

/**
 * ToolService: Defines the capabilities ("Limbs") of the AI Agent.
 * Allows the agent to perform real-world business actions.
 */
export class ToolService {
    /**
     * Tool: Book an Appointment
     */
    static bookAppointment = new DynamicStructuredTool({
        name: "book_appointment",
        description: "Books a business appointment on a specific date and time.",
        schema: z.object({
            customer_name: z.string().describe("The name of the customer"),
            date: z.string().describe("ISO date string for the appointment"),
            time: z.string().describe("Time string for the appointment"),
            service: z.string().describe("The service requested"),
        }),
        func: async ({ customer_name, date, time, service }) => {
            // Logic would integrate with Google Calendar / Cal.com
            console.log(`[Tool] Booking ${service} for ${customer_name} at ${date} ${time}`);
            return `Successfully booked ${service} for ${customer_name} on ${date} at ${time}. Confirmation sent.`;
        },
    });

    /**
     * Tool: Send Invoice
     */
    static sendInvoice = new DynamicStructuredTool({
        name: "send_invoice",
        description: "Generates and sends a professional invoice to a customer.",
        schema: z.object({
            customer_email: z.string().email().describe("Customer's email address"),
            amount: z.number().describe("Total amount to charge"),
            description: z.string().describe("Description of services/products"),
        }),
        func: async ({ customer_email, amount, description }) => {
            // Logic would integrate with Stripe / Resend
            console.log(`[Tool] Sending invoice of $${amount} to ${customer_email} for ${description}`);
            return `Invoice of $${amount} for '${description}' has been sent to ${customer_email}.`;
        },
    });

    /**
     * Tool: Check Inventory
     */
    static checkInventory = new DynamicStructuredTool({
        name: "check_inventory",
        description: "Checks if a specific product or service is in stock/available.",
        schema: z.object({
            item_name: z.string().describe("The name of the product or service to check"),
        }),
        func: async ({ item_name }) => {
            // Logic would query the client's database
            console.log(`[Tool] Checking inventory for ${item_name}`);
            return `The item '${item_name}' is currently in stock and available for purchase.`;
        },
    });

    /**
     * Returns a list of all available tools for the agent.
     */
    static getTools() {
        return [this.bookAppointment, this.sendInvoice, this.checkInventory];
    }
}
