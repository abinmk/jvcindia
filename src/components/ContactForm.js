import React, { useEffect, useState } from "react";
import { CForm, CFormInput, CFormTextarea } from "@coreui/react";
import {
  FiMail,
  FiPhone,
  FiClock,
  FiGlobe,
  FiMapPin,
} from "react-icons/fi";
import COUNTRIES from "../data/countries";

/* ---------------- CONTACT VALIDATION ---------------- */
const isValidContact = (number) => {
  const digits = number.replace(/\D/g, "");

  if (digits.length < 7) return false;
  if (/^(\d)\1+$/.test(digits)) return false; // 000000, 111111
  if (/^1234|^0123/.test(digits)) return false;

  return true;
};

/* ---------------- EMAIL ANTI-SPAM ---------------- */
const DISPOSABLE_EMAIL_DOMAINS = [
  "mailinator.com",
  "tempmail.com",
  "10minutemail.com",
  "guerrillamail.com",
  "yopmail.com",
  "throwawaymail.com",
  "getnada.com",
  "fakeinbox.com",
  "trashmail.com",
  "dispostable.com",
  "maildrop.cc",
  "mintemail.com",
  "sharklasers.com",
];

function injectLocalBusinessSchema() {
  const id = "localbusiness-schema";
  if (document.getElementById(id)) return;

  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://www.jvcindia.com/#localbusiness",
    name: "JVC India",
    url: "https://www.jvcindia.com/",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Cochin",
      addressRegion: "Kerala",
      addressCountry: "IN",
    },
    areaServed: "Worldwide",
  };

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.id = id;
  script.text = JSON.stringify(schema);
  document.head.appendChild(script);
}


const BLOCKED_EMAIL_PREFIXES = [
  "test",
  "testing",
  "support",
  "contact",
  "noreply",
  "no-reply",
  "example",
];

const isValidBusinessEmail = (email) => {
  if (!email) return false;

  const value = email.trim().toLowerCase();

  // Length sanity
  if (value.length < 6 || value.length > 254) return false;

  // Strong syntax
  const regex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
  if (!regex.test(value)) return false;

  const [local, domain] = value.split("@");

  // Block disposable domains
  if (DISPOSABLE_EMAIL_DOMAINS.includes(domain)) return false;

  // Block spam prefixes
  if (BLOCKED_EMAIL_PREFIXES.includes(local)) return false;

  // Block repeated or numeric-only names
  if (/^(.)\1+$/.test(local)) return false;
  if (/^\d+$/.test(local)) return false;

  return true;
};

const ContactForm = () => {
  const [meta, setMeta] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    country: "",
    countryCode: "",
    contact: "",
    email: "",
    product: "",
    quantity: "",
    message: "",
  });

  useEffect(() => {
    fetch("/data/meta.json")
      .then((res) => res.json())
      .then((data) => setMeta(data.contact))
      .catch(console.error);
    
      injectLocalBusinessSchema();

    return () => {
      const s = document.getElementById("localbusiness-schema");
      if (s) s.remove();
    };
  }, []);

  if (!meta) return null;

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCountryChange = (e) => {
    const selected = COUNTRIES.find(
      (c) => c.name === e.target.value
    );

    setFormData({
      ...formData,
      country: selected.name,
      countryCode: selected.dial,
      contact: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.country ||
      !formData.contact ||
      !formData.email ||
      !formData.product ||
      !formData.quantity ||
      !formData.message
    ) {
      alert("Please fill all required fields.");
      return;
    }

    if (!isValidContact(formData.contact)) {
      alert("Please enter a valid contact number.");
      return;
    }

    if (!isValidBusinessEmail(formData.email)) {
      alert(
        "Please enter a valid business email address.\nDisposable or fake emails are not accepted."
      );
      return;
    }

    const payload = {
      ...formData,
      fullContact: `${formData.countryCode}${formData.contact}`,
    };

    console.log(payload);
  };

  return (
    <section id="contact" className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-semibold text-jvcNavy">
            {meta.title}
          </h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            {meta.description}
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* LEFT INFO */}
            <div className="p-8 md:p-10 bg-gray-50">
              <h3 className="text-xl font-semibold text-jvcNavy mb-4">
                {meta.info.heading}
              </h3>

              <p className="text-gray-600 mb-8">
                {meta.info.text}
              </p>

              <div className="space-y-5">
                <InfoRow icon={FiMail} label="Email" values={[meta.info.email1, meta.info.email2]} />
                <InfoRow icon={FiPhone} label="Phone" values={[meta.info.phone1, meta.info.phone2, meta.info.phone3]} />
                <InfoRow icon={FiMapPin} label="Address" value={meta.info.address} />
                <InfoRow icon={FiClock} label="Response Time" value={meta.info.responseTime} />
                <InfoRow icon={FiGlobe} label="Markets We Serve" value={meta.info.markets} />
              </div>

            {/* LOCATION */}
            <div className="mt-4">
              <p className="text-1xl font-semibold text-jvcNavy mb-2.5 text-center">
                JVC India Location
              </p>

              <div className="h-48 md:h-56 rounded-lg overflow-hidden border border-gray-200">
                <iframe
                  title="JVC India Location"
                  src="https://www.google.com/maps?q=10.089882573143587,76.35786212017823&output=embed"
                  className="w-full h-full"
                  loading="lazy"
                />
              </div>

              {/* GET DIRECTIONS */}
              <div className="mt-3 text-center">
                <a
                  href="https://maps.app.goo.gl/gyK9yohd6Gc69um76"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    inline-flex items-center gap-2
                    px-4 py-2
                    text-sm font-medium
                    text-white
                    bg-jvcOrange
                    rounded-md
                    hover:bg-orange-500
                    transition
                  "
                >
                  <FiMapPin size={16} />
                  Get Directions
                </a>
              </div>
            </div>

              <p className="mt-8 text-xs text-gray-500 text-center">
                {meta.trustLine}
              </p>
            </div>

            {/* RIGHT */}
            <div className="flex flex-col">

              {/* FORM */}
              <div className="p-6 md:p-8">
                <CForm className="space-y-4" onSubmit={handleSubmit}>

                  <FormField label="Name *" name="name" value={formData.name} onChange={handleChange} />
                  <FormField label="Company" name="company" value={formData.company} onChange={handleChange} />

                  {/* COUNTRY */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country *
                    </label>
                    <select
                      value={formData.country}
                      onChange={handleCountryChange}
                      className="jvc-input w-full"
                      required
                    >
                      <option value="">Select Country</option>
                      {COUNTRIES.map((c) => (
                        <option key={c.code} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* CONTACT */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact *
                    </label>
                    <div className="flex">
                      <div className="px-3 flex items-center bg-gray-100 border border-r-0 border-gray-300 rounded-l-md text-sm">
                        {formData.countryCode || "+__"}
                      </div>
                      <input
                        type="tel"
                        value={formData.contact}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contact: e.target.value.replace(/\D/g, ""),
                          })
                        }
                        className="jvc-input w-full rounded-l-none"
                        placeholder="Enter number"
                        required
                      />
                    </div>
                  </div>

                  <FormField
                    label="Email *"
                    type="email"
                    name="email"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={handleChange}
                  />

                  <FormField
                    label="Product Enquiry *"
                    name="product"
                    placeholder="e.g. Bentonite, Quartz, Garnet"
                    value={formData.product}
                    onChange={handleChange}
                  />

                  <FormField
                    label="Required Quantity *"
                    name="quantity"
                    placeholder="e.g. 25 MT / 500 kg"
                    value={formData.quantity}
                    onChange={handleChange}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message *
                    </label>
                    <CFormTextarea
                      rows={3}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="jvc-input w-full resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-orange-600 text-white font-semibold rounded-md hover:bg-orange-500 transition"
                  >
                    {meta.form.cta}
                  </button>

                </CForm>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ---------------- HELPERS ---------------- */
const InfoRow = ({ icon: Icon, label, value, values }) => (
  <div className="flex items-start gap-3">
    <Icon className="text-jvcOrange mt-1" size={18} />
    <div>
      <p className="text-sm font-semibold text-jvcNavy">{label}</p>
      {value && <p className="text-sm text-gray-600">{value}</p>}
      {values && values.map((v, i) => (
        <p key={i} className="text-sm text-gray-600">{v}</p>
      ))}
    </div>
  </div>
);

const FormField = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <CFormInput {...props} className="jvc-input w-full" />
  </div>
);

export default ContactForm;
