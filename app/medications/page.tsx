"use client";

import { useEffect, useState } from "react";

type Medication = {
  id: string;
  name: string;
  dosage: string | null;
  frequency: string | null;
  startDate: string | null;
  notes: string | null;
  createdAt: string;
};

export default function MedicationsPage() {
  const [medications, setMedications] = useState<
    Medication[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    frequency: "",
    startDate: "",
    notes: "",
  });

  const [message, setMessage] = useState("");

  // =====================================================
  // LOAD MEDICATIONS
  // =====================================================

  useEffect(() => {
    loadMedications();
  }, []);

  async function loadMedications() {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/medications",
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to load medications."
        );
      }

      setMedications(data);
    } catch (error) {
      console.error(
        "Failed to load medications:",
        error
      );

      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to load medications."
      );
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  // =====================================================
  // ADD MEDICATION
  // =====================================================

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!formData.name.trim()) {
      setMessage(
        "Please enter the medication name."
      );
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      const response = await fetch(
        "/api/medications",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to save medication."
        );
      }

      setMedications((previous) => [
        data,
        ...previous,
      ]);

      setFormData({
        name: "",
        dosage: "",
        frequency: "",
        startDate: "",
        notes: "",
      });

      setMessage(
        "Medication added successfully!"
      );
    } catch (error) {
      console.error(
        "Failed to add medication:",
        error
      );

      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to add medication."
      );
    } finally {
      setSaving(false);
    }
  }

  // =====================================================
  // DELETE MEDICATION
  // =====================================================

  async function handleDelete(
    id: string
  ) {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this medication?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setMessage("");

      const response = await fetch(
        `/api/medications?id=${id}`,
        {
          method: "DELETE",
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to delete medication."
        );
      }

      setMedications(
        (previous) =>
          previous.filter(
            (medication) =>
              medication.id !== id
          )
      );

      setMessage(
        "Medication deleted successfully."
      );
    } catch (error) {
      console.error(
        "Failed to delete medication:",
        error
      );

      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to delete medication."
      );
    }
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">

        {/* Back */}

        <a
          href="/dashboard"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          ← Back to Dashboard
        </a>

        {/* Header */}

        <div className="mt-4">
          <h1 className="text-4xl font-bold text-gray-900">
            Medications
          </h1>

          <p className="mt-2 text-gray-600">
            Keep track of your medications,
            dosage, frequency, and notes.
          </p>
        </div>

        {/* Message */}

        {message && (
          <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
            {message}
          </div>
        )}

        {/* Add Medication */}

        <section className="mt-8 rounded-2xl border bg-white p-8 shadow-sm">

          <h2 className="text-2xl font-bold text-gray-900">
            Add Medication
          </h2>

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-5"
          >

            {/* Name */}

            <div>
              <label className="mb-2 block font-medium text-gray-800">
                Medication Name *
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Paracetamol"
                className="w-full rounded-xl border bg-white px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Dosage */}

            <div>
              <label className="mb-2 block font-medium text-gray-800">
                Dosage
              </label>

              <input
                type="text"
                name="dosage"
                value={formData.dosage}
                onChange={handleChange}
                placeholder="e.g. 500 mg"
                className="w-full rounded-xl border bg-white px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Frequency */}

            <div>
              <label className="mb-2 block font-medium text-gray-800">
                Frequency
              </label>

              <select
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                className="w-full rounded-xl border bg-white px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">
                  Select frequency
                </option>

                <option value="Once daily">
                  Once daily
                </option>

                <option value="Twice daily">
                  Twice daily
                </option>

                <option value="Three times daily">
                  Three times daily
                </option>

                <option value="As needed">
                  As needed
                </option>

                <option value="Other">
                  Other
                </option>
              </select>
            </div>

            {/* Start Date */}

            <div>
              <label className="mb-2 block font-medium text-gray-800">
                Start Date
              </label>

              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full rounded-xl border bg-white px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Notes */}

            <div>
              <label className="mb-2 block font-medium text-gray-800">
                Notes
              </label>

              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Optional notes..."
                className="w-full rounded-xl border bg-white px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Save */}

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {saving
                ? "Saving..."
                : "Add Medication"}
            </button>

          </form>

        </section>

        {/* Medication List */}

        <section className="mt-8">

          <div className="flex items-center justify-between">

            <h2 className="text-2xl font-bold text-gray-900">
              Your Medications
            </h2>

            <span className="rounded-full bg-gray-200 px-3 py-1 text-sm text-gray-700">
              {medications.length}{" "}
              {medications.length === 1
                ? "medication"
                : "medications"}
            </span>

          </div>

          {loading ? (

            <div className="mt-5 rounded-2xl border bg-white p-8 text-center text-gray-500">
              Loading medications...
            </div>

          ) : medications.length === 0 ? (

            <div className="mt-5 rounded-2xl border bg-white p-8 text-center">

              <p className="font-medium text-gray-700">
                No medications added yet.
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Add your first medication
                above.
              </p>

            </div>

          ) : (

            <div className="mt-5 space-y-4">

              {medications.map(
                (medication) => (

                  <div
                    key={medication.id}
                    className="rounded-2xl border bg-white p-6 shadow-sm"
                  >

                    <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

                      <div className="flex items-start gap-4">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100">
                          <span className="text-xl">
                            M
                          </span>
                        </div>

                        <div>

                          <h3 className="text-lg font-bold text-gray-900">
                            {medication.name}
                          </h3>

                          {medication.dosage && (
                            <p className="mt-1 text-sm text-gray-600">
                              Dosage:{" "}
                              {medication.dosage}
                            </p>
                          )}

                          {medication.frequency && (
                            <p className="mt-1 text-sm text-gray-600">
                              Frequency:{" "}
                              {medication.frequency}
                            </p>
                          )}

                          {medication.startDate && (
                            <p className="mt-1 text-sm text-gray-600">
                              Started:{" "}
                              {new Date(
                                medication.startDate
                              ).toLocaleDateString()}
                            </p>
                          )}

                          {medication.notes && (
                            <p className="mt-2 text-sm text-gray-500">
                              Notes:{" "}
                              {medication.notes}
                            </p>
                          )}

                        </div>

                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            medication.id
                          )
                        }
                        className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </section>

        {/* Disclaimer */}

        <div className="mt-8 rounded-xl border border-yellow-200 bg-yellow-50 p-5">

          <p className="text-sm leading-6 text-yellow-800">
            <strong>Important:</strong>{" "}
            This medication tracker is for
            organization only. Do not start,
            stop, or change medication based
            solely on this application. Follow
            advice from your qualified
            healthcare professional.
          </p>

        </div>

      </div>
    </main>
  );
}