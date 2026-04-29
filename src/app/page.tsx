import Link from "next/link";
import { Phone, Mail, MapPin, Clock, ChevronRight, Star, Shield, Users, Stethoscope, Smile, Baby, AlertCircle } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1a5276] flex items-center justify-center">
              <span className="text-white font-bold text-lg">NS</span>
            </div>
            <div>
              <span className="text-xl font-bold text-[#1a5276] font-[family-name:var(--font-playfair)]">North South Dental</span>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#services" className="text-sm font-medium text-gray-600 hover:text-[#1a5276] transition-colors">Services</Link>
            <Link href="#about" className="text-sm font-medium text-gray-600 hover:text-[#1a5276] transition-colors">About Us</Link>
            <Link href="#doctors" className="text-sm font-medium text-gray-600 hover:text-[#1a5276] transition-colors">Our Doctors</Link>
            <Link href="#contact" className="text-sm font-medium text-gray-600 hover:text-[#1a5276] transition-colors">Contact</Link>
          </div>
          <div className="flex items-center gap-4">
            <a href="tel:+18005551234" className="hidden sm:flex items-center gap-2 text-sm font-medium text-[#1a5276]">
              <Phone className="w-4 h-4" /> (800) 555-1234
            </a>
            <Link href="#book" className="px-6 py-2.5 rounded-lg bg-[#27ae60] text-white text-sm font-semibold hover:bg-[#219a52] transition-colors">
              Book Appointment
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero */}
        <section className="relative pt-32 pb-20 px-6 bg-gradient-to-br from-[#f0f7fc] via-white to-[#f0faf4]">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1a5276] leading-tight mb-6">
                Quality Dental Care for Your Entire Family
              </h1>
              <p className="text-lg text-gray-600 max-w-xl mb-8 leading-relaxed mx-auto lg:mx-0">
                At North South Dental, we provide comprehensive dental services in a comfortable and caring environment. From routine checkups to advanced procedures, your oral health is our priority.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="#book" className="px-8 py-4 rounded-lg bg-[#27ae60] text-white text-base font-semibold hover:bg-[#219a52] transition-colors flex items-center justify-center gap-2">
                  Schedule a Visit <ChevronRight className="w-5 h-5" />
                </Link>
                <a href="tel:+18005551234" className="px-8 py-4 rounded-lg border-2 border-[#1a5276] text-[#1a5276] text-base font-semibold hover:bg-[#1a5276] hover:text-white transition-colors text-center">
                  Call Us Today
                </a>
              </div>
              <div className="flex items-center gap-6 mt-8 justify-center lg:justify-start text-sm text-gray-500">
                <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-500" /> 4.9 Rating</span>
                <span className="flex items-center gap-1"><Users className="w-4 h-4 text-[#1a5276]" /> 10,000+ Patients</span>
                <span className="flex items-center gap-1"><Shield className="w-4 h-4 text-[#27ae60]" /> Insured</span>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="w-full max-w-lg mx-auto aspect-[4/3] rounded-2xl bg-gradient-to-br from-[#1a5276] to-[#2980b9] flex items-center justify-center shadow-2xl">
                <Smile className="w-32 h-32 text-white/80" />
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="py-20 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a5276] mb-4">Our Services</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">We offer a wide range of dental services to meet the needs of patients at every stage of life.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: <Stethoscope className="w-8 h-8" />, title: "General Dentistry", desc: "Comprehensive exams, professional cleanings, fillings, and preventive care to maintain your oral health." },
                { icon: <Smile className="w-8 h-8" />, title: "Cosmetic Dentistry", desc: "Teeth whitening, porcelain veneers, and bonding to help you achieve the smile you have always wanted." },
                { icon: <Shield className="w-8 h-8" />, title: "Dental Implants", desc: "Permanent tooth replacement solutions that look, feel, and function like your natural teeth." },
                { icon: <Baby className="w-8 h-8" />, title: "Pediatric Dentistry", desc: "Gentle and friendly dental care designed specifically for infants, children, and adolescents." },
                { icon: <AlertCircle className="w-8 h-8" />, title: "Emergency Dental Care", desc: "Same-day appointments available for dental emergencies including toothaches, broken teeth, and infections." },
                { icon: <Star className="w-8 h-8" />, title: "Orthodontics", desc: "Traditional braces and clear aligner therapy to straighten teeth and correct bite issues for all ages." },
              ].map((service, i) => (
                <div key={i} className="p-8 rounded-xl border border-gray-100 bg-white hover:shadow-lg hover:border-[#1a5276]/20 transition-all group">
                  <div className="w-14 h-14 rounded-xl bg-[#f0f7fc] text-[#1a5276] flex items-center justify-center mb-5 group-hover:bg-[#1a5276] group-hover:text-white transition-colors">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 font-[family-name:var(--font-playfair)]">{service.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{service.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="py-20 px-6 bg-[#f8fafb]">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1">
              <div className="w-full max-w-md mx-auto aspect-square rounded-2xl bg-gradient-to-br from-[#1a5276] to-[#0e3a55] flex items-center justify-center">
                <Users className="w-24 h-24 text-white/70" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a5276] mb-6">About North South Dental</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Founded with a commitment to providing accessible, high-quality dental care, North South Dental has been serving our community for over 15 years. Our team of experienced dentists and hygienists work together to ensure every patient receives personalized treatment in a comfortable setting.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                We invest in the latest dental technology, including digital X-rays, intraoral cameras, and CAD/CAM systems, so that we can offer accurate diagnoses and efficient treatments. Whether you need a routine cleaning or a complex procedure, we are here for you.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 rounded-lg bg-white border border-gray-100">
                  <div className="text-3xl font-bold text-[#1a5276]">15+</div>
                  <div className="text-sm text-gray-500 mt-1">Years of Service</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-white border border-gray-100">
                  <div className="text-3xl font-bold text-[#1a5276]">10,000+</div>
                  <div className="text-sm text-gray-500 mt-1">Happy Patients</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-white border border-gray-100">
                  <div className="text-3xl font-bold text-[#1a5276]">8</div>
                  <div className="text-sm text-gray-500 mt-1">Dental Specialists</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-white border border-gray-100">
                  <div className="text-3xl font-bold text-[#27ae60]">4.9</div>
                  <div className="text-sm text-gray-500 mt-1">Patient Rating</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Doctors */}
        <section id="doctors" className="py-20 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a5276] mb-4">Our Doctors</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Our team of qualified dental professionals is dedicated to providing the best care for you and your family.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: "Dr. Sarah Mitchell", role: "General & Cosmetic Dentistry", exp: "12 years experience" },
                { name: "Dr. James Park", role: "Oral Surgery & Implants", exp: "18 years experience" },
                { name: "Dr. Amina Hassan", role: "Pediatric Dentistry", exp: "9 years experience" },
              ].map((doc, i) => (
                <div key={i} className="text-center p-8 rounded-xl border border-gray-100 hover:shadow-lg transition-all">
                  <div className="w-24 h-24 rounded-full bg-[#f0f7fc] flex items-center justify-center mx-auto mb-5">
                    <Users className="w-10 h-10 text-[#1a5276]" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 font-[family-name:var(--font-playfair)]">{doc.name}</h3>
                  <p className="text-[#1a5276] font-medium text-sm mt-1">{doc.role}</p>
                  <p className="text-gray-500 text-sm mt-1">{doc.exp}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Hours & Insurance */}
        <section className="py-20 px-6 bg-[#1a5276] text-white">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6 font-[family-name:var(--font-playfair)]">Office Hours</h2>
              <div className="space-y-3 text-blue-100">
                {[
                  { day: "Monday – Friday", time: "8:00 AM – 6:00 PM" },
                  { day: "Saturday", time: "9:00 AM – 3:00 PM" },
                  { day: "Sunday", time: "Closed" },
                ].map((h, i) => (
                  <div key={i} className="flex justify-between py-3 border-b border-white/10">
                    <span className="font-medium">{h.day}</span>
                    <span>{h.time}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6 font-[family-name:var(--font-playfair)]">Insurance & Payment</h2>
              <p className="text-blue-100 leading-relaxed mb-4">
                We accept most major dental insurance plans. Our front desk team will help verify your coverage and explain any out-of-pocket costs before treatment begins.
              </p>
              <p className="text-blue-100 leading-relaxed">
                For patients without insurance, we offer flexible payment plans and accept all major credit cards. We believe cost should never be a barrier to quality dental care.
              </p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="py-20 px-6 bg-[#f8fafb]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a5276] mb-4">Contact Us</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">We are here to help. Reach out to us with any questions or to schedule your next appointment.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-8 rounded-xl bg-white border border-gray-100">
                <div className="w-14 h-14 rounded-full bg-[#f0f7fc] flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-6 h-6 text-[#1a5276]" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Phone</h3>
                <a href="tel:+18005551234" className="text-[#1a5276] font-medium">(800) 555-1234</a>
              </div>
              <div className="text-center p-8 rounded-xl bg-white border border-gray-100">
                <div className="w-14 h-14 rounded-full bg-[#f0f7fc] flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-[#1a5276]" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Email</h3>
                <a href="mailto:info@northsouthdental.com" className="text-[#1a5276] font-medium">info@northsouthdental.com</a>
              </div>
              <div className="text-center p-8 rounded-xl bg-white border border-gray-100">
                <div className="w-14 h-14 rounded-full bg-[#f0f7fc] flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-6 h-6 text-[#1a5276]" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Location</h3>
                <p className="text-gray-600 text-sm">123 Healthcare Boulevard<br />Suite 200, Medical District</p>
              </div>
            </div>
          </div>
        </section>

        {/* Book Appointment CTA */}
        <section id="book" className="py-20 px-6 bg-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a5276] mb-4">Ready to Schedule Your Visit?</h2>
            <p className="text-gray-600 mb-8 max-w-xl mx-auto">
              Our scheduling assistant is available to help you find a convenient time. You can also call us directly at (800) 555-1234.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:+18005551234" className="px-8 py-4 rounded-lg bg-[#1a5276] text-white text-base font-semibold hover:bg-[#0e3a55] transition-colors">
                Call to Book
              </a>
              <Link href="#contact" className="px-8 py-4 rounded-lg border-2 border-[#27ae60] text-[#27ae60] text-base font-semibold hover:bg-[#27ae60] hover:text-white transition-colors">
                Send Us a Message
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 px-6 bg-[#0e3a55] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">NS</span>
                </div>
                <span className="font-bold font-[family-name:var(--font-playfair)]">North South Dental</span>
              </div>
              <p className="text-blue-200 text-sm leading-relaxed">Providing quality dental care for patients of all ages since 2010.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Services</h4>
              <ul className="space-y-2 text-blue-200 text-sm">
                <li>General Dentistry</li>
                <li>Cosmetic Dentistry</li>
                <li>Dental Implants</li>
                <li>Orthodontics</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-2 text-blue-200 text-sm">
                <li><Link href="#about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="#doctors" className="hover:text-white transition-colors">Our Doctors</Link></li>
                <li><Link href="#contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Contact</h4>
              <ul className="space-y-2 text-blue-200 text-sm">
                <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> (800) 555-1234</li>
                <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> info@northsouthdental.com</li>
                <li className="flex items-center gap-2"><Clock className="w-4 h-4" /> Mon–Fri: 8AM–6PM</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 text-center text-blue-300 text-sm">
            © 2026 North South Dental. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
