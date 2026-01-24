import React, { useEffect, useState } from "react";
import { CForm, CFormInput, CFormTextarea } from "@coreui/react";
import {
  FiMail,
  FiPhone,
  FiClock,
  FiGlobe,
  FiMapPin,
} from "react-icons/fi";

const ContactForm = () => {
  const [meta, setMeta] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  useEffect(() => {
    fetch("/data/meta.json")
      .then((res) => res.json())
      .then((data) => setMeta(data.contact))
      .catch(console.error);
  }, []);

  if (!meta) return null;

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
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
                {/* <InfoRow icon={FiMail} label="Email" value={meta.info.email} /> */}

                <InfoRow
                  icon={FiMail}
                  label="Phone"
                  values={[
                    meta.info.email1,
                    meta.info.email2,
                  ].filter(Boolean)}
                />

                <InfoRow
                  icon={FiPhone}
                  label="Phone"
                  values={[
                    meta.info.phone1,
                    meta.info.phone2,
                    meta.info.phone3,
                  ].filter(Boolean)}
                />

                <InfoRow
                  icon={FiMapPin}
                  label="Address"
                  value={meta.info.address}
                />

                <InfoRow
                  icon={FiClock}
                  label="Response Time"
                  value={meta.info.responseTime}
                />

                <InfoRow
                  icon={FiGlobe}
                  label="Markets"
                  value={meta.info.markets}
                />
              </div>

              <p className="mt-8 text-xs text-gray-500">
                {meta.trustLine}
              </p>
            </div>

            {/* RIGHT – MAP + FORM */}
            {/* RIGHT – MAP + FORM */}
<div className="flex flex-col">

{/* MAP */}
<div className="h-48 md:h-56 border-b">
  <iframe
    title="JVC India Location"
    src="https://www.google.com/maps?q=By%20Pass%20Junction%20Bus%20Stop,%20SH%2016,%20Bridge%20Road,%20Periyar%20Nagar,%20Aluva,%20Kerala%20683101,%20India&output=embed"
    className="w-full h-full"
    loading="lazy"
  />
</div>

{/* MAP CTA */}
<div className="px-6 py-2 border-b bg-gray-50">
  <a
    href="https://maps.app.goo.gl/N5ayduf2SXSm9DN56"
    target="_blank"
    rel="noopener noreferrer"
    className="
      inline-flex items-center gap-2
      text-sm font-medium
      text-jvcOrange
      hover:text-orange-500
    "
  >
    <FiMapPin size={16} />
    Get Directions
  </a>
</div>

{/* FORM */}
<div className="p-6 md:p-8">
  <CForm className="space-y-4" onSubmit={handleSubmit}>

    <FormField
      label={meta.form.nameLabel}
      name="name"
      placeholder="John Doe"
      value={formData.name}
      onChange={handleChange}
    />

    <FormField
      label={meta.form.emailLabel}
      name="email"
      placeholder="john@company.com"
      value={formData.email}
      onChange={handleChange}
    />

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {meta.form.messageLabel}
      </label>
      <CFormTextarea
        rows={2}
        name="message"
        placeholder={meta.form.messagePlaceholder}
        value={formData.message}
        onChange={handleChange}
        className="jvc-input w-full resize-none"
      />
    </div>

    <button
      type="submit"
      className="
        w-full py-2.5
        bg-orange-600 text-white
        font-semibold
        rounded-md
        hover:bg-orange-500
        active:bg-orange-700
        transition
      "
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

/* INFO ROW */
const InfoRow = ({ icon: Icon, label, value, values }) => (
  <div className="flex items-start gap-3">
    <Icon className="text-jvcOrange mt-1" size={18} />
    <div>
      <p className="text-sm font-semibold text-jvcNavy">{label}</p>
      {value && <p className="text-sm text-gray-600">{value}</p>}
      {values &&
        values.map((v, i) => (
          <p key={i} className="text-sm text-gray-600">
            {v}
          </p>
        ))}
    </div>
  </div>
);

/* FORM FIELD */
const FormField = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <CFormInput {...props} className="jvc-input w-full" />
  </div>
);

export default ContactForm;