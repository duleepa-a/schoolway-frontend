"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import Footer from "../components/Footer";
import FormInput from "../components/FormInput";
import Swal from "sweetalert2";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  userType: string;
  Type: string;
}

export default function Contact() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
    userType: "",
    Type: "",
  });

  // Pre-fill form data for logged-in users
  useEffect(() => {
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        name: session.user.name || "",
        email: session.user.email || "",
        userType: session.user.role || "user",
      }));
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validation for non-logged-in users
      if (!session?.user) {
        if (!formData.name || !formData.email || !formData.userType) {
          Swal.fire({
            title: "Error",
            text: "Please fill in all required fields.",
            icon: "error",
            confirmButtonText: "OK",
          });
          return;
        }
      }

      // Common validation for all users
      if (!formData.Type || !formData.subject || !formData.message) {
        Swal.fire({
          title: "Error",
          text: "Please fill in all required fields.",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }

      // For logged-in users, only send the fields they can modify
      const submitData = session?.user
        ? {
            Type: formData.Type,
            subject: formData.subject,
            message: formData.message,
          }
        : formData;

      const res = await fetch("/api/contactus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      const result = await res.json();

      if (res.ok) {
        await Swal.fire({
          title: "Success",
          text: "Message sent successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });

        // Reset only the user-editable fields
        if (session?.user) {
          setFormData((prev) => ({
            ...prev,
            subject: "",
            message: "",
            Type: "",
          }));
        } else {
          setFormData({
            name: "",
            email: "",
            subject: "",
            message: "",
            userType: "",
            Type: "",
          });
        }
      } else {
        Swal.fire({
          title: "Error",
          text: result.error || "Failed to send message.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Form submit error:", error);
      Swal.fire({
        title: "Error",
        text: "Something went wrong.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Contact Form */}
      <div className="flex justify-center items-center py-12">
        <div className="rounded-2xl shadow-2xl p-10 w-full max-w-2xl bg-[var(--color-textwhite)]">
          <h2
            className="text-3xl font-bold mb-6 text-center"
            style={{ color: "var(--blue-shade-dark)" }}
          >
            Send Us a Message
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8"
          >
            {/* Show name and email fields only for non-logged-in users */}
            {!session?.user && (
              <>
                <FormInput
                  label="Full Name *"
                  name="name"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleChange}
                />
                <FormInput
                  label="Email Address *"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />

                <div>
                  <label
                    className="text-sm block font-semibold mb-1"
                    style={{ color: "var(--color-textgreydark)" }}
                  >
                    I am a... *
                  </label>
                  <select
                    name="userType"
                    value={formData.userType}
                    onChange={handleChange}
                    required
                    className="w-full h-10 border rounded-xl px-3 text-sm focus:ring-2 focus:ring-[var(--blue-shade-light)] focus:border-transparent"
                    style={{
                      borderColor: "var(--blue-shade-light)",
                      color: "var(--color-textblack)",
                      background: "var(--color-background)",
                    }}
                  >
                    <option value="" disabled>
                      Select one
                    </option>
                    <option value="Parent">Parent</option>
                    <option value="School">School Administrator</option>
                    <option value="Driver">Driver</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </>
            )}

            {/* Request Type - always visible */}
            <div className={session?.user ? "md:col-span-2" : ""}>
              <label
                className="text-sm block font-semibold mb-1"
                style={{ color: "var(--color-textgreydark)" }}
              >
                Request Type *
              </label>
              <select
                name="Type"
                value={formData.Type}
                onChange={handleChange}
                required
                className="w-full h-10 border rounded-xl px-3 text-sm focus:ring-2 focus:ring-[var(--blue-shade-light)] focus:border-transparent"
                style={{
                  borderColor: "var(--blue-shade-light)",
                  color: "var(--color-textblack)",
                  background: "var(--color-background)",
                }}
              >
                <option value="" disabled>
                  Select one
                </option>
                <option value="SCHOOL_REQ">School Request</option>
                <option value="SUGGESTIONS">System Suggestion</option>
                <option value="INQUIRIES">System Inquiry</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <FormInput
                label="Subject *"
                name="subject"
                placeholder="What's this about?"
                value={formData.subject}
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-2">
              <label
                className="text-sm block font-semibold mb-1"
                style={{ color: "var(--color-textgreydark)" }}
              >
                Message *
              </label>
              <textarea
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us how we can help you..."
                required
                className="w-full px-4 py-3 border rounded-lg focus:ring-1 focus:ring-[var(--blue-shade-light)]"
                style={{
                  borderColor: "var(--blue-shade-light)",
                  color: "var(--color-textblack)",
                  background: "var(--color-background)",
                }}
              ></textarea>
            </div>

            <div className="md:col-span-2 mt-4">
              <button
                type="submit"
                className="w-full py-3 px-6 rounded-lg font-semibold transition transform hover:scale-105"
                style={{
                  background:
                    "linear-gradient(90deg, var(--blue-shade-dark) 0%, var(--blue-shade-light) 60%, var(--green-shade-light) 100%)",
                  color: "var(--color-textwhite)",
                  border: "none",
                }}
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Contact Info Cards - only show for non-logged-in users */}
      {!session?.user && (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8 mt-0">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="bg-[var(--color-textwhite)] rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
                <div className="grid grid-cols-[auto_1fr] gap-4 items-start">
                  <div
                    className="mt-5 flex items-center justify-center w-12 h-12 rounded-full"
                    style={{ background: "var(--blue-shade-light)20" }}
                  >
                    <MapPinIcon
                      className="w-6 h-6"
                      style={{ color: "var(--blue-shade-dark)" }}
                    />
                  </div>
                  <div className="items-center">
                    <h3
                      className="text-lg font-semibold mb-1"
                      style={{ color: "var(--blue-shade-dark)" }}
                    >
                      Visit Our Office
                    </h3>
                    <p
                      className="text-sm"
                      style={{ color: "var(--color-textgreydark)" }}
                    >
                      123 School Transport Ave
                      <br />
                      Education District, ED 12345
                      <br />
                      Sri Lanka
                    </p>
                  </div>
                </div>
              </div>
              {/* Card 2 */}
              <div className="bg-[var(--color-textwhite)] rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
                <div className="grid grid-cols-[auto_1fr] gap-4 items-start">
                  <div
                    className="mt-5 flex items-center justify-center w-12 h-12 rounded-full"
                    style={{ background: "var(--green-shade-light)20" }}
                  >
                    <PhoneIcon
                      className="w-6 h-6"
                      style={{ color: "var(--green-shade-dark)" }}
                    />
                  </div>
                  <div>
                    <h3
                      className="text-lg font-semibold mb-1"
                      style={{ color: "var(--green-shade-dark)" }}
                    >
                      Call Us
                    </h3>
                    <p
                      className="text-sm"
                      style={{ color: "var(--color-textgreydark)" }}
                    >
                      Main: (555) 123-4567
                      <br />
                      Emergency: (555) 987-6543
                      <br />
                      Toll-free: 1-800-SCHOOL-WAY
                    </p>
                  </div>
                </div>
              </div>
              {/* Card 3 */}
              <div className="bg-[var(--color-textwhite)] rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
                <div className="grid grid-cols-[auto_1fr] gap-4 items-start justify-center">
                  <div
                    className="mt-5 flex items-center justify-center w-12 h-12 rounded-full"
                    style={{ background: "var(--blue-shade-light)10" }}
                  >
                    <EnvelopeIcon
                      className="w-6 h-6"
                      style={{ color: "var(--blue-shade-light)" }}
                    />
                  </div>
                  <div>
                    <h3
                      className="text-lg font-semibold mb-1"
                      style={{ color: "var(--blue-shade-light)" }}
                    >
                      Email Us
                    </h3>
                    <p
                      className="text-sm"
                      style={{ color: "var(--color-textgreydark)" }}
                    >
                      info@schoolway.com
                      <br />
                      support@schoolway.com
                      <br />
                      emergency@schoolway.com
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Footer />
        </>
      )}
    </div>
  );
}
