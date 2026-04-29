"use client";

import Link from "next/link";
import { useState } from "react";
import { Phone, Mail, MapPin, Clock, ChevronDown, Users, CheckCircle2, Star, Sparkles } from "lucide-react";

const services = [
  { name: "Restorative Dentistry", desc: "Fillings, crowns, bridges, and dentures to restore damaged or missing teeth to their natural function and appearance." },
  { name: "Dental Implants", desc: "Permanent, natural-looking tooth replacement anchored directly into the jawbone for a lasting, comfortable fit." },
  { name: "Cosmetic Dentistry", desc: "Teeth whitening, porcelain veneers, and bonding treatments to enhance the appearance of your smile." },
  { name: "Sedation Dentistry", desc: "Comfortable, anxiety-free treatment options for patients who experience dental anxiety or require lengthy procedures." },
  { name: "Pediatric Dentistry", desc: "Gentle, age-appropriate dental care for infants, children, and teens in a friendly, welcoming environment." },
  { name: "Invisalign", desc: "Clear aligner therapy to gradually straighten teeth without the need for traditional metal braces." },
  { name: "Periodontics and Hygiene", desc: "Professional cleanings, gum disease treatment, and ongoing maintenance to protect your oral health." },
  { name: "Root Canal Therapy", desc: "Gentle removal of infected tooth pulp to relieve pain and save the natural tooth from extraction." },
  { name: "Oral Surgery", desc: "Tooth extractions, wisdom teeth removal, and other surgical procedures performed with precision and care." },
];

export default function HomePage() {
  const [openService, setOpenService] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    patientType: "new",
    firstName: "", lastName: "", dob: "", email: "", phone: "",
    appointmentType: "", datePreference: "", dayPreference: [] as string[],
    timePreference: "", notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSubmitSuccess(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleDay = (day: string) => {
    setFormData(prev => ({
      ...prev,
      dayPreference: prev.dayPreference.includes(day)
        ? prev.dayPreference.filter(d => d !== day)
        : [...prev.dayPreference, day],
    }));
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-[#2c3e50]">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-[#fdfbf7]/95 backdrop-blur-sm border-b border-[#e8e4de]">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex flex-col">
            <span className="text-2xl font-bold text-[#3d5a4d] font-[family-name:var(--font-playfair)]">
              North South
            </span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#6b7b8d] -mt-1">Dental Care</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#about" className="text-sm text-[#6b7b8d] hover:text-[#3d5a4d] transition-colors">About</Link>
            <Link href="#services" className="text-sm text-[#6b7b8d] hover:text-[#3d5a4d] transition-colors">Services</Link>
            <Link href="#contact" className="text-sm text-[#6b7b8d] hover:text-[#3d5a4d] transition-colors">Contact</Link>
          </div>
          <div className="flex items-center gap-4">
            <a href="tel:+18005551234" className="hidden sm:block text-sm text-[#3d5a4d] font-medium">
              (800) 555-1234
            </a>
            <Link href="#book" className="px-5 py-2.5 border-2 border-[#3d5a4d] text-[#3d5a4d] text-sm font-medium hover:bg-[#3d5a4d] hover:text-white transition-all rounded">
              Book Now
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="pt-40 pb-20 px-6">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5a7a6a]/10 text-[#5a7a6a] text-[10px] font-bold uppercase tracking-widest mb-6">
                <Sparkles className="w-3 h-3" /> Now Accepting New Patients
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-[4rem] font-bold text-[#3d5a4d] leading-[1.1] mb-8 font-[family-name:var(--font-playfair)]">
                Experience the Art of Gentle Dentistry.
              </h1>
              <p className="text-lg text-[#6b7b8d] leading-relaxed mb-10 max-w-xl">
                At North South Dental, we blend clinical excellence with a boutique patient experience. Our mission is to provide transparent, compassionate care tailored to your unique smile.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="#book" className="px-8 py-4 bg-[#5a7a6a] text-white text-sm font-bold hover:bg-[#3d5a4d] transition-all rounded shadow-lg shadow-[#5a7a6a]/20 text-center">
                  Request Appointment
                </Link>
                <Link href="#services" className="px-8 py-4 border border-[#e8e4de] text-[#3d5a4d] text-sm font-bold hover:border-[#3d5a4d] transition-all rounded text-center">
                  Our Services
                </Link>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="w-full aspect-[4/5] rounded-[2rem] bg-[#f7f4ef] border border-[#e8e4de] overflow-hidden flex items-center justify-center relative z-10">
                <div className="text-center p-12">
                   <div className="w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center mx-auto mb-6 transform -rotate-6">
                      <Sparkles className="w-10 h-10 text-[#5a7a6a]" />
                   </div>
                   <h3 className="text-2xl font-bold text-[#3d5a4d] mb-4 font-[family-name:var(--font-playfair)]">State-of-the-Art Care</h3>
                   <p className="text-sm text-[#6b7b8d] leading-relaxed">Modern technology meets personalized attention in the heart of the Medical District.</p>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-[#5a7a6a]/10 rounded-full blur-3xl -z-0"></div>
              <div className="absolute -top-6 -left-6 w-48 h-48 bg-[#1e3a4f]/5 rounded-full blur-3xl -z-0"></div>
            </div>
          </div>
        </section>

        {/* Philosophy */}
        <section id="about" className="py-24 px-6 bg-white border-y border-[#e8e4de]">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-[#3d5a4d] mb-12 font-[family-name:var(--font-playfair)]">Our Philosophy</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <p className="text-[#6b7b8d] leading-relaxed mb-6 italic text-lg font-[family-name:var(--font-playfair)]">
                  "Dentistry is not just about teeth; it's about people. We believe in transparency and empowering our patients through education."
                </p>
                <div className="flex flex-wrap gap-3">
                   {["Transparency", "Compassion", "Science-Based", "Collaboration"].map(tag => (
                     <span key={tag} className="px-3 py-1 bg-[#f7f4ef] border border-[#e8e4de] text-[10px] font-bold uppercase tracking-wider text-[#5a7a6a] rounded">{tag}</span>
                   ))}
                </div>
              </div>
              <div className="text-[#6b7b8d] space-y-4 text-sm leading-relaxed">
                <p>
                  Dentistry can be intimidating when procedures aren't explained. At North South Dental, we prioritize transparent conversation. We approach diagnosis by carefully considering your concerns and history, then building a plan around your personal goals.
                </p>
                <p>
                  Our goal is to provide compassionate, honest, and collaborative care to ensure the best possible experience during every visit.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Doctor Bio */}
        <section className="py-24 px-6 bg-[#f7f4ef]">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-16 items-center">
              <div className="w-64 h-80 rounded-2xl bg-white border border-[#e8e4de] p-4 shadow-xl rotate-2 flex-shrink-0">
                <div className="w-full h-full bg-[#5a7a6a]/5 rounded-xl flex items-center justify-center">
                   <Users className="w-16 h-16 text-[#5a7a6a]/20" />
                </div>
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-[#3d5a4d] mb-6 font-[family-name:var(--font-playfair)]">Dr. Sarah Mitchell</h2>
                <p className="text-sm text-[#5a7a6a] font-bold uppercase tracking-[0.2em] mb-6">Principal Dentist & Founder</p>
                <div className="text-[#6b7b8d] space-y-4 text-sm leading-relaxed">
                  <p>
                    Dr. Mitchell graduated from Columbia University College of Dental Medicine and completed her residency at Mount Sinai Hospital. She is certified in sedation dentistry and has a passion for treating complex cases with a patient-first approach.
                  </p>
                  <p>
                    She gained extensive experience at community clinics, which shaped her philosophy of making high-quality dental care accessible and comfortable for everyone.
                  </p>
                  <div className="pt-4 flex gap-8">
                     <div>
                       <p className="text-[#3d5a4d] font-bold">12+</p>
                       <p className="text-[10px] text-[#6b7b8d] uppercase tracking-wider">Years Experience</p>
                     </div>
                     <div>
                       <p className="text-[#3d5a4d] font-bold">5000+</p>
                       <p className="text-[10px] text-[#6b7b8d] uppercase tracking-wider">Patients Served</p>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[#3d5a4d] mb-4 font-[family-name:var(--font-playfair)]">Bespoke Services</h2>
              <p className="text-[#6b7b8d] max-w-2xl mx-auto text-sm">Personalized treatments from preventive care to advanced cosmetic transformations.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s, i) => (
                <div key={i} className="group border border-[#e8e4de] rounded-2xl p-8 hover:bg-[#f7f4ef] hover:border-[#5a7a6a]/30 transition-all cursor-pointer">
                  <h3 className="text-[#3d5a4d] font-bold mb-4 font-[family-name:var(--font-playfair)] group-hover:text-[#5a7a6a] transition-colors">{s.name}</h3>
                  <p className="text-xs text-[#6b7b8d] leading-relaxed line-clamp-3">{s.desc}</p>
                  <div className="mt-6 flex items-center gap-2 text-[#5a7a6a] opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] font-bold uppercase tracking-widest">Learn More</span>
                    <ChevronDown className="w-3 h-3 -rotate-90" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section className="py-24 px-6 bg-[#1e3a4f] text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-[family-name:var(--font-playfair)]">Modern Technology</h2>
            <p className="text-blue-100/70 mb-12 max-w-xl mx-auto text-sm">We use the latest diagnostic and treatment tools to ensure your visit is efficient and painless.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { title: "Digital Imaging", desc: "Lower radiation and instant results for precise diagnosis." },
                { title: "Intraoral Scanning", desc: "No messy goop. Precise 3D models for crowns and Invisalign." },
                { title: "Laser Care", desc: "Minimally invasive treatments for faster healing times." }
              ].map((t, i) => (
                <div key={i}>
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-6 h-6 text-blue-200" />
                  </div>
                  <h4 className="font-bold mb-2 font-[family-name:var(--font-playfair)]">{t.title}</h4>
                  <p className="text-xs text-blue-100/60 leading-relaxed">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 px-6 bg-[#fdfbf7]">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-[#3d5a4d] mb-12 text-center font-[family-name:var(--font-playfair)]">Patient Experiences</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { name: "Emily Robinson", text: "The most gentle cleaning I've ever had. Dr. Mitchell and her staff really take the time to explain everything. I actually look forward to the dentist now!" },
                { name: "Michael Chen", text: "Stunning office and top-tier technology. The 3D scanning made my Invisalign process so much easier than I expected." }
              ].map((t, i) => (
                <div key={i} className="p-10 bg-white rounded-3xl border border-[#e8e4de] shadow-sm relative">
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-[#5a7a6a] text-[#5a7a6a]" />)}
                  </div>
                  <p className="text-[#6b7b8d] italic text-sm mb-6 leading-relaxed">\"{t.text}\"</p>
                  <p className="text-[#3d5a4d] font-bold text-[10px] uppercase tracking-[0.2em]">— {t.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Manual Booking Form */}
        <section id="book" className="py-24 px-6 bg-[#1e3a4f]">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-[family-name:var(--font-playfair)]">Reserve Your Visit</h2>
              <p className="text-blue-200/70 text-sm">Please fill out the traditional booking request form below.</p>
            </div>
            
            {submitSuccess ? (
              <div className="bg-white rounded-[2rem] p-16 text-center shadow-2xl">
                <div className="w-20 h-20 bg-[#eafaf1] text-[#27ae60] rounded-full flex items-center justify-center mx-auto mb-8">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-[#1e3a4f] font-[family-name:var(--font-playfair)]">Request Received</h3>
                <p className="text-[#6b7b8d] max-w-md mx-auto mb-10 text-sm">
                  Thank you. Your appointment request has been logged. Our staff will review your preferences and contact you shortly.
                </p>
                <button 
                  onClick={() => setSubmitSuccess(false)}
                  className="px-10 py-4 bg-[#1e3a4f] text-white rounded-xl font-bold hover:bg-[#152a39] transition-all shadow-xl"
                >
                  Make Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-[2.5rem] p-10 md:p-14 shadow-2xl">
                <div>
                  <h3 className="text-sm font-bold mb-8 text-[#1e3a4f] uppercase tracking-widest flex items-center gap-2">
                    <User className="w-4 h-4" /> Patient Information
                  </h3>
                  <div className="flex gap-8 mb-8">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input type="radio" name="patientType" value="new" checked={formData.patientType === "new"} onChange={e => setFormData({...formData, patientType: e.target.value})} className="accent-[#5a7a6a] w-4 h-4" required />
                      <span className="text-sm text-[#6b7b8d] group-hover:text-[#3d5a4d]">New patient</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input type="radio" name="patientType" value="existing" checked={formData.patientType === "existing"} onChange={e => setFormData({...formData, patientType: e.target.value})} className="accent-[#5a7a6a] w-4 h-4" />
                      <span className="text-sm text-[#6b7b8d] group-hover:text-[#3d5a4d]">Existing patient</span>
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "First name", key: "firstName", type: "text" },
                      { label: "Last name", key: "lastName", type: "text" },
                    ].map(field => (
                      <div key={field.key} className="mb-4">
                        <label className="block text-[10px] font-bold text-[#6b7b8d] uppercase tracking-wider mb-2">{field.label}</label>
                        <input type={field.type} required value={formData[field.key as keyof typeof formData] as string} onChange={e => setFormData({...formData, [field.key]: e.target.value})} className="w-full bg-[#f8fafb] border border-[#e8e4de] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#5a7a6a] transition-all" />
                      </div>
                    ))}
                  </div>
                  {[
                    { label: "Date of birth", key: "dob", type: "date" },
                    { label: "Email address", key: "email", type: "email" },
                    { label: "Telephone", key: "phone", type: "tel" },
                  ].map(field => (
                    <div key={field.key} className="mb-4">
                      <label className="block text-[10px] font-bold text-[#6b7b8d] uppercase tracking-wider mb-2">{field.label}</label>
                      <input type={field.type} required value={formData[field.key as keyof typeof formData] as string} onChange={e => setFormData({...formData, [field.key]: e.target.value})} className="w-full bg-[#f8fafb] border border-[#e8e4de] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#5a7a6a] transition-all" />
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="text-sm font-bold mb-8 text-[#1e3a4f] uppercase tracking-widest flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Visit Preferences
                  </h3>
                  <div className="mb-6">
                    <label className="block text-[10px] font-bold text-[#6b7b8d] uppercase tracking-wider mb-2">Service Required</label>
                    <select required value={formData.appointmentType} onChange={e => setFormData({...formData, appointmentType: e.target.value})} className="w-full bg-[#f8fafb] border border-[#e8e4de] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#5a7a6a] transition-all appearance-none">
                      <option value="">Select a service...</option>
                      <option>General Checkup</option>
                      <option>Professional Cleaning</option>
                      <option>Cosmetic Consultation</option>
                      <option>Emergency Care</option>
                      <option>Implant Consultation</option>
                      <option>Invisalign Assessment</option>
                    </select>
                  </div>
                  <div className="mb-6">
                    <label className="block text-[10px] font-bold text-[#6b7b8d] uppercase tracking-wider mb-2">Preferred Date</label>
                    <input type="date" required value={formData.datePreference} onChange={e => setFormData({...formData, datePreference: e.target.value})} className="w-full bg-[#f8fafb] border border-[#e8e4de] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#5a7a6a]" />
                  </div>
                  <div className="mb-8">
                    <label className="block text-[10px] font-bold text-[#6b7b8d] uppercase tracking-wider mb-3">Time of Day</label>
                    <div className="flex gap-3">
                      {["MORNING", "AFTERNOON", "ANY"].map(t => (
                        <button key={t} type="button" onClick={() => setFormData({...formData, timePreference: t})} className={`flex-1 py-3 rounded-xl text-[10px] font-bold transition-all border ${formData.timePreference === t ? "bg-[#1e3a4f] text-white border-[#1e3a4f]" : "bg-white text-[#6b7b8d] border-[#e8e4de] hover:border-[#5a7a6a]"}`}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-8">
                    <label className="block text-[10px] font-bold text-[#6b7b8d] uppercase tracking-wider mb-2">Notes for Staff</label>
                    <textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} rows={3} className="w-full bg-[#f8fafb] border border-[#e8e4de] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#5a7a6a] transition-all resize-none placeholder:text-gray-300" placeholder="Special requirements or concerns..." />
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-[#5a7a6a] text-white font-bold rounded-2xl hover:bg-[#3d5a4d] disabled:opacity-50 transition-all text-xs uppercase tracking-[0.2em] shadow-xl shadow-[#5a7a6a]/20">
                    {isSubmitting ? "Submitting..." : "Send Request"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* Office & Contact */}
        <section id="contact" className="py-24 px-6 bg-white">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div>
              <h2 className="text-3xl font-bold text-[#3d5a4d] mb-10 font-[family-name:var(--font-playfair)]">Visit Our Studio</h2>
              <div className="space-y-8">
                <div className="flex items-start gap-6">
                   <div className="w-12 h-12 rounded-2xl bg-[#f7f4ef] flex items-center justify-center text-[#5a7a6a] flex-shrink-0">
                      <MapPin className="w-6 h-6" />
                   </div>
                   <div>
                      <p className="text-sm font-bold text-[#3d5a4d] mb-1">Our Location</p>
                      <p className="text-sm text-[#6b7b8d] leading-relaxed">123 Healthcare Boulevard, Suite 200<br/>Medical District, Cityside</p>
                   </div>
                </div>
                <div className="flex items-start gap-6">
                   <div className="w-12 h-12 rounded-2xl bg-[#f7f4ef] flex items-center justify-center text-[#5a7a6a] flex-shrink-0">
                      <Clock className="w-6 h-6" />
                   </div>
                   <div>
                      <p className="text-sm font-bold text-[#3d5a4d] mb-1">Office Hours</p>
                      <div className="grid grid-cols-2 gap-x-8 text-sm text-[#6b7b8d]">
                         <span>Mon – Fri</span><span>8:00 AM – 6:00 PM</span>
                         <span>Saturday</span><span>9:00 AM – 2:00 PM</span>
                         <span>Sunday</span><span>Closed</span>
                      </div>
                   </div>
                </div>
                <div className="flex items-start gap-6">
                   <div className="w-12 h-12 rounded-2xl bg-[#f7f4ef] flex items-center justify-center text-[#5a7a6a] flex-shrink-0">
                      <Phone className="w-6 h-6" />
                   </div>
                   <div>
                      <p className="text-sm font-bold text-[#3d5a4d] mb-1">Get in Touch</p>
                      <p className="text-sm text-[#6b7b8d]">(800) 555-1234</p>
                      <p className="text-sm text-[#6b7b8d]">hello@northsouthdental.com</p>
                   </div>
                </div>
              </div>
            </div>
            <div className="w-full h-80 lg:h-auto rounded-[2.5rem] bg-[#f7f4ef] border border-[#e8e4de] flex items-center justify-center shadow-inner overflow-hidden relative group">
               <div className="absolute inset-0 bg-[#5a7a6a]/5 group-hover:bg-transparent transition-colors"></div>
               <div className="text-center relative z-10">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-4">
                     <MapPin className="w-8 h-8 text-[#5a7a6a]" />
                  </div>
                  <p className="text-xs font-bold text-[#6b7b8d] uppercase tracking-widest">View Map</p>
               </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-16 px-6 bg-[#2c3e50] text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <span className="text-2xl font-bold font-[family-name:var(--font-playfair)]">North South</span>
              <span className="block text-[10px] uppercase tracking-[0.4em] text-gray-400 mt-1">Dental Care</span>
              <p className="mt-6 text-xs text-gray-400 leading-relaxed max-w-xs">
                Providing comprehensive dental excellence with a human-centric approach in a modern boutique environment.
              </p>
            </div>
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-6">Quick Links</h4>
              <ul className="space-y-4 text-sm text-gray-300">
                 <li><Link href="#about" className="hover:text-white transition-colors">Philosophy</Link></li>
                 <li><Link href="#services" className="hover:text-white transition-colors">Services</Link></li>
                 <li><Link href="#book" className="hover:text-white transition-colors">Book Visit</Link></li>
                 <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-6">Connect</h4>
              <ul className="space-y-4 text-sm text-gray-300">
                 <li><span className="hover:text-white cursor-pointer transition-colors">Instagram</span></li>
                 <li><span className="hover:text-white cursor-pointer transition-colors">Facebook</span></li>
                 <li><span className="hover:text-white cursor-pointer transition-colors">Google Maps</span></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-6">Location</h4>
              <p className="text-sm text-gray-300 mb-2">123 Healthcare Blvd</p>
              <p className="text-sm text-gray-300 mb-6">Medical District, Suite 200</p>
              <p className="text-sm text-gray-300 font-bold">(800) 555-1234</p>
            </div>
          </div>
          <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">© 2026 North South Dental. Excellence in Care.</p>
            <div className="flex gap-8 text-[10px] text-gray-500 uppercase tracking-widest">
               <span>Terms</span>
               <span>Privacy</span>
               <span>ADA Accessible</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
