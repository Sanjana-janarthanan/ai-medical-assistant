"use client";

import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    height: "",
    weight: "",
    allergies: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Load existing profile when the page opens
  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch("/api/profile");

        if (!response.ok) {
          setLoading(false);
          return;
        }

        const profile = await response.json();

        if (profile) {
          setFormData({
            dateOfBirth: profile.dateOfBirth
              ? profile.dateOfBirth.split("T")[0]
              : "",
            gender: profile.gender || "",
            bloodGroup: profile.bloodGroup || "",
            height: profile.height?.toString() || "",
            weight: profile.weight?.toString() || "",
            allergies: profile.allergies || "",
            emergencyContactName:
              profile.emergencyContactName || "",
            emergencyContactPhone:
              profile.emergencyContactPhone || "",
          });
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  // Show loading screen while getting data from database
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">
          Loading your profile...
        </p>
      </main>
    );
  }

  // Handle input changes
  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  // Save profile
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setMessage("Saving...");

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage("Profile saved successfully!");
      } else {
        setMessage("Failed to save profile.");
      }
    } catch (error) {
      console.error("Failed to save profile:", error);
      setMessage("Something went wrong.");
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow">
        
        {/* Heading */}
        <h1 className="text-3xl font-bold text-gray-900">
          Patient Profile
        </h1>

        <p className="mt-2 text-gray-600">
          Tell us a little about yourself so your AI medical
          assistant can provide more personalized assistance.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6"
        >

          {/* Date of Birth */}
          <div>
            <label className="mb-2 block font-medium">
              Date of Birth
            </label>

            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="mb-2 block font-medium">
              Gender
            </label>

            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-3"
            >
              <option value="">
                Select gender
              </option>

              <option value="Female">
                Female
              </option>

              <option value="Male">
                Male
              </option>

              <option value="Other">
                Other
              </option>

              <option value="Prefer not to say">
                Prefer not to say
              </option>
            </select>
          </div>

          {/* Blood Group */}
          <div>
            <label className="mb-2 block font-medium">
              Blood Group
            </label>

            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-3"
            >
              <option value="">
                Select blood group
              </option>

              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          {/* Height */}
          <div>
            <label className="mb-2 block font-medium">
              Height (cm)
            </label>

            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              placeholder="e.g. 165"
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>

          {/* Weight */}
          <div>
            <label className="mb-2 block font-medium">
              Weight (kg)
            </label>

            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              placeholder="e.g. 60"
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>

          {/* Allergies */}
          <div>
            <label className="mb-2 block font-medium">
              Allergies
            </label>

            <textarea
              name="allergies"
              value={formData.allergies}
              onChange={handleChange}
              placeholder="List any known allergies"
              rows={3}
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>

          {/* Emergency Contact Name */}
          <div>
            <label className="mb-2 block font-medium">
              Emergency Contact Name
            </label>

            <input
              type="text"
              name="emergencyContactName"
              value={formData.emergencyContactName}
              onChange={handleChange}
              placeholder="Enter emergency contact name"
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>

          {/* Emergency Contact Phone */}
          <div>
            <label className="mb-2 block font-medium">
              Emergency Contact Phone
            </label>

            <input
              type="tel"
              name="emergencyContactPhone"
              value={formData.emergencyContactPhone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Save Profile
          </button>

          {/* Status Message */}
          {message && (
            <p className="text-center text-sm text-gray-600">
              {message}
            </p>
          )}

        </form>
      </div>
    </main>
  );
}