"use client";

import Link from "next/link";
import { useState } from "react";
import { Phone, Mail, MapPin, Clock, ChevronDown, Users } from "lucide-react";

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
              Book an Appointment
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="pt-32 pb-16 px-6">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-[#3d5a4d] leading-tight mb-6 font-[family-name:var(--font-playfair)]">
                Gentle &amp; comprehensive dental care.
              </h1>
              <p className="text-lg text-[#6b7b8d] leading-relaxed mb-8 max-w-lg">
                We are here to help you maintain a beautiful and healthy smile. Your oral health plays a major role in your overall well-being, and at North South Dental, we provide personalized treatment with your comfort and satisfaction in mind.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="#book" className="px-8 py-3.5 bg-[#5a7a6a] text-white text-sm font-medium hover:bg-[#3d5a4d] transition-colors rounded text-center">
                  Book an Appointment Online
                </Link>
                <a href="tel:+18005551234" className="px-8 py-3.5 border border-[#e8e4de] text-[#3d5a4d] text-sm font-medium hover:border-[#3d5a4d] transition-colors rounded text-center">
                  or call us at (800) 555-1234
                </a>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="w-full max-w-md aspect-[4/3] rounded-2xl bg-gradient-to-br from-[#5a7a6a]/20 to-[#5a7a6a]/5 border border-[#e8e4de] flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-2">🦷</div>
                  <p className="text-sm text-[#6b7b8d]">North South Dental</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Strip */}
        <section className="py-6 px-6 bg-[#f7f4ef] border-y border-[#e8e4de]">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6 flex-wrap justify-center">
              <span className="flex items-center gap-2 text-sm text-[#6b7b8d]"><Phone className="w-4 h-4 text-[#5a7a6a]" /> (800) 555-1234</span>
              <span className="flex items-center gap-2 text-sm text-[#6b7b8d]"><Mail className="w-4 h-4 text-[#5a7a6a]" /> hello@northsouthdental.com</span>
              <span className="flex items-center gap-2 text-sm text-[#6b7b8d]"><MapPin className="w-4 h-4 text-[#5a7a6a]" /> 123 Healthcare Blvd, Suite 200</span>
            </div>
          </div>
        </section>

        {/* Philosophy */}
        <section id="about" className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-[#3d5a4d] mb-10 font-[family-name:var(--font-playfair)]">Our Philosophy</h2>
            <div className="flex gap-8 mb-8 flex-wrap">
              {["Transparency", "Compassion", "Science-Based", "Collaboration"].map((v) => (
                <span key={v} className="text-sm font-semibold text-[#5a7a6a] border-b-2 border-[#5a7a6a] pb-1">{v}</span>
              ))}
            </div>
            <p className="text-[#6b7b8d] leading-relaxed mb-4">
              Dentistry can be intimidating as often procedures and steps are not explained to patients. We at North South Dental believe in transparent conversation and in educating patients about their oral health. We approach diagnosis by carefully collecting and considering your concerns and dental history, and then developing a treatment plan according to your personal goals.
            </p>
            <p className="text-[#6b7b8d] leading-relaxed">
              We take a comprehensive approach in treating your oral health as part of your overall health. Our goal is to provide compassionate, honest, scientific, and collaborative care to ensure the best possible dental experience during your visit.
            </p>
          </div>
        </section>

        {/* Doctor Bio */}
        <section className="py-20 px-6 bg-[#f7f4ef] border-y border-[#e8e4de]">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-[#3d5a4d] mb-10 font-[family-name:var(--font-playfair)]">About Dr. Sarah Mitchell</h2>
            <div className="flex flex-col md:flex-row gap-10">
              <div className="w-48 h-60 rounded-xl bg-[#5a7a6a]/10 border border-[#e8e4de] flex items-center justify-center flex-shrink-0 mx-auto md:mx-0">
                <Users className="w-16 h-16 text-[#5a7a6a]/50" />
              </div>
              <div>
                <p className="text-[#6b7b8d] leading-relaxed mb-4">
                  Dr. Sarah Mitchell is a graduate of Columbia University College of Dental Medicine, where she received her Doctorate of Dental Surgery in 2012. She completed her general practice residency at Mount Sinai Hospital, where she earned her certificate in sedation dentistry.
                </p>
                <p className="text-[#6b7b8d] leading-relaxed mb-4">
                  During her residency, she volunteered weekly at a community dental clinic for underserved populations, where she gained the skills necessary for treating a medically and behaviorally complex patient population. These experiences shaped her patient-first approach to dental care.
                </p>
                <p className="text-[#6b7b8d] leading-relaxed">
                  Dr. Mitchell is a member of the American Dental Association, the Academy of General Dentistry, and the American Academy of Cosmetic Dentistry. She regularly attends continuing education courses to stay current with the latest techniques and technologies.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-[#3d5a4d] mb-4 font-[family-name:var(--font-playfair)]">Services</h2>
            <p className="text-[#6b7b8d] leading-relaxed mb-10">
              We are committed to helping you have a comforting experience at our dental practice. At North South Dental, you can expect personalized treatments with your satisfaction in mind. We practice science-based dentistry and pride ourselves on educating our patients so they can make the best decision for their oral care.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((s, i) => (
                <div key={i} className="border border-[#e8e4de] rounded-lg overflow-hidden">
                  <button
                    onClick={() => setOpenService(openService === i ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-[#f7f4ef] transition-colors"
                  >
                    <span className="text-[#3d5a4d] font-semibold">{s.name}</span>
                    <ChevronDown className={`w-5 h-5 text-[#6b7b8d] transition-transform duration-300 ${openService === i ? "rotate-180" : ""}`} />
                  </button>
                  {openService === i && (
                    <div className="px-6 pb-4 text-sm text-[#6b7b8d] leading-relaxed border-t border-[#e8e4de] pt-3">
                      {s.desc}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Booking Form */}
        <section id="book" className="py-20 px-6 bg-[#1e3a4f] text-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 font-[family-name:var(--font-playfair)]">NORTH SOUTH DENTAL</h2>
              <p className="text-blue-200">Thank you for taking the time to make an appointment at our office.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white text-[#2c3e50] rounded-xl p-8 md:p-10">
              {/* Left: Patient Info */}
              <div>
                <h3 className="text-lg font-bold mb-6 text-[#1e3a4f] uppercase tracking-wider text-sm">This Appointment Is For</h3>
                <div className="flex gap-6 mb-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="patientType" value="new" checked={formData.patientType === "new"} onChange={e => setFormData({...formData, patientType: e.target.value})} className="accent-[#1e3a4f]" />
                    <span className="text-sm">New patient</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="patientType" value="existing" checked={formData.patientType === "existing"} onChange={e => setFormData({...formData, patientType: e.target.value})} className="accent-[#1e3a4f]" />
                    <span className="text-sm">Existing patient</span>
                  </label>
                </div>
                {[
                  { label: "First name", key: "firstName", type: "text" },
                  { label: "Last name", key: "lastName", type: "text" },
                  { label: "Date of birth", key: "dob", type: "date" },
                  { label: "Email", key: "email", type: "email" },
                  { label: "Telephone", key: "phone", type: "tel" },
                ].map(field => (
                  <div key={field.key} className="mb-4">
                    <label className="block text-xs text-[#6b7b8d] mb-1">{field.label}</label>
                    <input
                      type={field.type}
                      value={formData[field.key as keyof typeof formData] as string}
                      onChange={e => setFormData({...formData, [field.key]: e.target.value})}
                      className="w-full border border-[#e8e4de] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#5a7a6a] transition-colors"
                    />
                  </div>
                ))}
                <div className="mb-4">
                  <label className="block text-xs text-[#6b7b8d] mb-1">Notes to Office</label>
                  <textarea
                    value={formData.notes}
                    onChange={e => setFormData({...formData, notes: e.target.value})}
                    rows={3}
                    className="w-full border border-[#e8e4de] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#5a7a6a] transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Right: Preferences */}
              <div>
                <h3 className="text-lg font-bold mb-6 text-[#1e3a4f] uppercase tracking-wider text-sm">Please Indicate Your Preferences</h3>
                <div className="mb-4">
                  <label className="block text-xs text-[#6b7b8d] mb-1">Appointment type</label>
                  <select
                    value={formData.appointmentType}
                    onChange={e => setFormData({...formData, appointmentType: e.target.value})}
                    className="w-full border border-[#e8e4de] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#5a7a6a] bg-white"
                  >
                    <option value="">Please select one...</option>
                    <option>General Checkup</option>
                    <option>Cleaning</option>
                    <option>Cosmetic Consultation</option>
                    <option>Emergency</option>
                    <option>Implant Consultation</option>
                    <option>Orthodontics Consultation</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-xs text-[#6b7b8d] mb-1">Date preference</label>
                  <input
                    type="date"
                    value={formData.datePreference}
                    onChange={e => setFormData({...formData, datePreference: e.target.value})}
                    className="w-full border border-[#e8e4de] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#5a7a6a]"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-xs text-[#6b7b8d] mb-2">Day preference (You can select more than one)</label>
                  <div className="flex flex-wrap gap-2">
                    {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(day => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`px-4 py-2 rounded text-xs font-semibold transition-colors ${
                          formData.dayPreference.includes(day)
                            ? "bg-[#2980b9] text-white"
                            : "bg-[#f0f0f0] text-[#6b7b8d] hover:bg-[#e0e0e0]"
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                    <span className="flex items-center text-xs text-[#6b7b8d] px-2">OR</span>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, dayPreference: ["ASAP"]})}
                      className={`px-4 py-2 rounded text-xs font-semibold transition-colors ${
                        formData.dayPreference.includes("ASAP")
                          ? "bg-[#2980b9] text-white"
                          : "bg-[#f0f0f0] text-[#6b7b8d] hover:bg-[#e0e0e0]"
                      }`}
                    >
                      ASAP
                    </button>
                  </div>
                </div>
                <div className="mb-8">
                  <label className="block text-xs text-[#6b7b8d] mb-2">Time preference</label>
                  <div className="flex gap-3">
                    {["MORNING", "AFTERNOON", "ANY TIME"].map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setFormData({...formData, timePreference: t})}
                        className={`flex-1 py-2.5 rounded text-xs font-semibold transition-colors ${
                          formData.timePreference === t
                            ? "bg-[#5a7a6a] text-white"
                            : "bg-[#f0f0f0] text-[#6b7b8d] hover:bg-[#e0e0e0]"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  className="w-full py-3.5 bg-[#2980b9] text-white font-semibold rounded hover:bg-[#2471a3] transition-colors text-sm"
                >
                  VIEW AVAILABLE APPOINTMENTS
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Office Hours */}
        <section className="py-16 px-6 bg-[#f7f4ef] border-y border-[#e8e4de]">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-[#3d5a4d] mb-6 font-[family-name:var(--font-playfair)]">Office Hours</h2>
              <div className="space-y-3">
                {[
                  { day: "Monday – Friday", time: "8:00 AM – 6:00 PM" },
                  { day: "Saturday", time: "9:00 AM – 2:00 PM" },
                  { day: "Sunday", time: "Closed" },
                ].map((h, i) => (
                  <div key={i} className="flex justify-between py-2 border-b border-[#e8e4de] text-sm">
                    <span className="text-[#3d5a4d] font-medium">{h.day}</span>
                    <span className="text-[#6b7b8d]">{h.time}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#3d5a4d] mb-6 font-[family-name:var(--font-playfair)]">Insurance and Payment</h2>
              <p className="text-sm text-[#6b7b8d] leading-relaxed mb-3">
                We accept most major dental insurance plans. Our team will help verify your coverage and explain any out-of-pocket costs before treatment begins.
              </p>
              <p className="text-sm text-[#6b7b8d] leading-relaxed">
                For patients without insurance, we offer flexible payment plans and accept all major credit cards. We believe cost should never be a barrier to quality dental care.
              </p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="py-16 px-6">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-[#3d5a4d] mb-6 font-[family-name:var(--font-playfair)]">Contact Us</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#5a7a6a] mt-0.5" />
                  <div>
                    <a href="tel:+18005551234" className="text-[#3d5a4d] font-medium hover:underline">(800) 555-1234</a>
                    <p className="text-xs text-[#6b7b8d] mt-0.5">Main line</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#5a7a6a] mt-0.5" />
                  <a href="mailto:hello@northsouthdental.com" className="text-[#3d5a4d] font-medium hover:underline">hello@northsouthdental.com</a>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#5a7a6a] mt-0.5" />
                  <div>
                    <p className="text-[#3d5a4d] font-medium">123 Healthcare Boulevard, Suite 200</p>
                    <p className="text-xs text-[#6b7b8d] mt-0.5">Medical District</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#5a7a6a] mt-0.5" />
                  <div>
                    <p className="text-[#3d5a4d] font-medium">Mon–Fri: 8AM–6PM</p>
                    <p className="text-xs text-[#6b7b8d] mt-0.5">Sat: 9AM–2PM | Sun: Closed</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full h-64 md:h-auto rounded-xl bg-[#f7f4ef] border border-[#e8e4de] flex items-center justify-center">
              <div className="text-center text-[#6b7b8d]">
                <MapPin className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Map</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-10 px-6 bg-[#2c3e50] text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <span className="text-lg font-bold font-[family-name:var(--font-playfair)]">North South</span>
              <span className="block text-[10px] uppercase tracking-[0.3em] text-gray-400">Dental Care</span>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Contact Us</h4>
              <p className="text-sm text-gray-300">(800) 555-1234</p>
              <p className="text-sm text-gray-300">hello@northsouthdental.com</p>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Find Us On</h4>
              <p className="text-sm text-gray-300 hover:text-white cursor-pointer">Facebook</p>
              <p className="text-sm text-gray-300 hover:text-white cursor-pointer">Google Maps</p>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Quick Links</h4>
              <Link href="#about" className="block text-sm text-gray-300 hover:text-white">About</Link>
              <Link href="#services" className="block text-sm text-gray-300 hover:text-white">Services</Link>
              <Link href="#book" className="block text-sm text-gray-300 hover:text-white">Book an Appointment</Link>
              <Link href="#" className="block text-sm text-gray-300 hover:text-white">Privacy Policy</Link>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 text-center text-xs text-gray-500">
            © 2026 North South Dental. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
