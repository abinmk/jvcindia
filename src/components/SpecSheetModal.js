import React, { useEffect, useState } from "react";
import { CForm, CFormInput, CFormTextarea } from "@coreui/react";
import COUNTRIES from "../data/countries";

/* ---------------- VALIDATION ---------------- */
const isValidContact = (number) => {
  const digits = number.replace(/\D/g, "");
  if (digits.length < 7) return false;
  if (/^(\d)\1+$/.test(digits)) return false;
  return true;
};

const isValidBusinessEmail = (email) => {
  const regex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
  return regex.test(email);
};

const SpecSheetModal = ({
  isOpen,
  onClose,
  productName,
  specSheetUrl
}) => {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    country: "",
    countryCode: "",
    contact: "",
    email: "",
    product: productName || "",
    quantity: "",
    message: ""
  });

  /* Sync product */
  useEffect(() => {
    if (productName) {
      setFormData((prev) => ({ ...prev, product: productName }));
    }
  }, [productName]);

  /* ESC close */
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCountryChange = (e) => {
    const selected = COUNTRIES.find((c) => c.name === e.target.value);
    setFormData({
      ...formData,
      country: selected.name,
      countryCode: selected.dial,
      contact: ""
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.country ||
      !formData.contact ||
      !formData.email ||
      !formData.product
    ) {
      alert("Please fill all required fields.");
      return;
    }

    if (!isValidContact(formData.contact)) {
      alert("Please enter a valid contact number.");
      return;
    }

    if (!isValidBusinessEmail(formData.email)) {
      alert("Please enter a valid business email.");
      return;
    }

    const payload = {
      ...formData,
      fullContact: `${formData.countryCode}${formData.contact}`,
      type: "SPEC_SHEET_DOWNLOAD"
    };

    console.log("SPEC SHEET PAYLOAD:", payload);

    window.open(specSheetUrl, "_blank", "noopener,noreferrer");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[10000] bg-black/60 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="
          w-full max-w-xl
          max-h-[100dvh]
          bg-white
          rounded-2xl
          shadow-2xl
          flex flex-col
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="border-b px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-jvcNavy">
            Download Spec Sheet
          </h3>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-jvcOrange text-white flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* FORM */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <CForm className="space-y-4" onSubmit={handleSubmit}>
            <FormField label="Name *" name="name" value={formData.name} onChange={handleChange} />
            <FormField label="Company" name="company" value={formData.company} onChange={handleChange} />

            {/* Country */}
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

            {/* Contact */}
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
                      contact: e.target.value.replace(/\D/g, "")
                    })
                  }
                  className="jvc-input w-full rounded-l-none"
                  placeholder="Enter number"
                  required
                />
              </div>
            </div>

            <FormField label="Email *" type="email" name="email" value={formData.email} onChange={handleChange} />
            <FormField label="Product" name="product" value={formData.product} onChange={handleChange} />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <CFormTextarea
                rows={3}
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="jvc-input w-full resize-none"
              />
            </div>

            {/* 🔥 ONLY DIFFERENCE */}
            <button
              type="submit"
              className="w-full py-2.5 bg-jvcOrange text-white font-semibold rounded-md"
            >
              Download Spec Sheet
            </button>
          </CForm>
        </div>
      </div>
    </div>
  );
};

/* ---------------- FIELD HELPER ---------------- */
const FormField = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <CFormInput {...props} className="jvc-input w-full" />
  </div>
);

export default SpecSheetModal;
