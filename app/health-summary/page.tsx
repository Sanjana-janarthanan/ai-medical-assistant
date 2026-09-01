"use client";

import { useEffect, useState } from "react";

type Profile = {
  dateOfBirth: string | null;
  gender: string | null;
  bloodGroup: string | null;
  height: number | null;
  weight: number | null;
  allergies: string | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
};

type Medication = {
  id: string;
  name: string;
  dosage: string | null;
  frequency: string | null;
};

type Document = {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string | null;
  createdAt: string;
};

type Summary = {
  profile: Profile | null;
  medications: Medication[];
  documents: Document[];
  conversationCount: number;
  messageCount: number;
};

export default function HealthSummaryPage() {
  const [summary, setSummary] =
    useState<Summary | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    loadSummary();
  }, []);

  async function loadSummary() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/health-summary",
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to load health summary."
        );
      }

      setSummary(data);
    } catch (error) {
      console.error(
        "Failed to load health summary:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load health summary."
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="rounded-xl border bg-white px-6 py-4 shadow-sm">
          <p className="text-gray-600">
            Loading your health summary...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-5xl">
          <a
            href="/dashboard"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            ← Back to Dashboard
          </a>

          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
            {error}
          </div>
        </div>
      </main>
    );
  }

  if (!summary) {
    return null;
  }

  const profile = summary.profile;

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">

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
            Health Summary
          </h1>

          <p className="mt-2 text-gray-600">
            A quick overview of your health
            information and activity.
          </p>
        </div>

        {/* Overview Cards */}

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Medications
            </p>

            <p className="mt-2 text-3xl font-bold text-orange-500">
              {summary.medications.length}
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Medical Documents
            </p>

            <p className="mt-2 text-3xl font-bold text-red-500">
              {summary.documents.length}
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Conversations
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-600">
              {summary.conversationCount}
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              AI Messages
            </p>

            <p className="mt-2 text-3xl font-bold text-purple-600">
              {summary.messageCount}
            </p>
          </div>

        </div>

        {/* Personal Information */}

        <section className="mt-8 rounded-2xl border bg-white p-8 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Personal Health Information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Information from your health profile.
              </p>
            </div>

            <a
              href="/profile"
              className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
            >
              Edit Profile
            </a>

          </div>

          {profile ? (

            <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

              <div>
                <p className="text-sm text-gray-500">
                  Date of Birth
                </p>

                <p className="mt-1 font-semibold text-gray-900">
                  {profile.dateOfBirth
                    ? new Date(
                        profile.dateOfBirth
                      ).toLocaleDateString()
                    : "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Gender
                </p>

                <p className="mt-1 font-semibold text-gray-900">
                  {profile.gender ||
                    "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Blood Group
                </p>

                <p className="mt-1 font-semibold text-gray-900">
                  {profile.bloodGroup ||
                    "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Height
                </p>

                <p className="mt-1 font-semibold text-gray-900">
                  {profile.height
                    ? `${profile.height} cm`
                    : "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Weight
                </p>

                <p className="mt-1 font-semibold text-gray-900">
                  {profile.weight
                    ? `${profile.weight} kg`
                    : "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Allergies
                </p>

                <p className="mt-1 font-semibold text-gray-900">
                  {profile.allergies ||
                    "None provided"}
                </p>
              </div>

            </div>

          ) : (

            <div className="mt-6 rounded-xl bg-gray-50 p-6">
              <p className="text-gray-600">
                Your health profile has not been
                completed yet.
              </p>

              <a
                href="/profile"
                className="mt-3 inline-block font-medium text-blue-600 hover:underline"
              >
                Complete your profile →
              </a>
            </div>

          )}

        </section>

        {/* Emergency Contact */}

        {profile &&
          (profile.emergencyContactName ||
            profile.emergencyContactPhone) && (

            <section className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-8">

              <h2 className="text-xl font-bold text-red-900">
                Emergency Contact
              </h2>

              <div className="mt-4 grid gap-4 md:grid-cols-2">

                <div>
                  <p className="text-sm text-red-700">
                    Name
                  </p>

                  <p className="mt-1 font-semibold text-red-900">
                    {profile.emergencyContactName ||
                      "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-red-700">
                    Phone
                  </p>

                  <p className="mt-1 font-semibold text-red-900">
                    {profile.emergencyContactPhone ||
                      "Not provided"}
                  </p>
                </div>

              </div>

            </section>
          )}

        {/* Medications */}

        <section className="mt-8 rounded-2xl border bg-white p-8 shadow-sm">

          <div className="flex items-center justify-between">

            <h2 className="text-2xl font-bold text-gray-900">
              Current Medications
            </h2>

            <a
              href="/medications"
              className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
            >
              Manage
            </a>

          </div>

          {summary.medications.length === 0 ? (

            <p className="mt-5 text-gray-500">
              No medications have been added.
            </p>

          ) : (

            <div className="mt-5 space-y-3">

              {summary.medications.map(
                (medication) => (

                  <div
                    key={medication.id}
                    className="rounded-xl bg-gray-50 p-4"
                  >

                    <p className="font-semibold text-gray-900">
                      {medication.name}
                    </p>

                    <p className="mt-1 text-sm text-gray-600">
                      {medication.dosage ||
                        "Dosage not specified"}

                      {" • "}

                      {medication.frequency ||
                        "Frequency not specified"}
                    </p>

                  </div>

                )
              )}

            </div>

          )}

        </section>

        {/* Medical Documents */}

        <section className="mt-8 rounded-2xl border bg-white p-8 shadow-sm">

          <div className="flex items-center justify-between">

            <h2 className="text-2xl font-bold text-gray-900">
              Medical Documents
            </h2>

            <a
              href="/medical-documents"
              className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
            >
              Manage
            </a>

          </div>

          {summary.documents.length === 0 ? (

            <p className="mt-5 text-gray-500">
              No medical documents uploaded.
            </p>

          ) : (

            <div className="mt-5 space-y-3">

              {summary.documents.map(
                (document) => (

                  <div
                    key={document.id}
                    className="flex flex-col justify-between gap-3 rounded-xl bg-gray-50 p-4 md:flex-row md:items-center"
                  >

                    <div>

                      <p className="font-semibold text-gray-900">
                        {document.fileName}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Uploaded{" "}
                        {new Date(
                          document.createdAt
                        ).toLocaleDateString()}
                      </p>

                    </div>

                    <a
                      href={document.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 hover:underline"
                    >
                      View →
                    </a>

                  </div>

                )
              )}

            </div>

          )}

        </section>

        {/* AI Activity */}

        <section className="mt-8 rounded-2xl border bg-white p-8 shadow-sm">

          <h2 className="text-2xl font-bold text-gray-900">
            AI Assistant Activity
          </h2>

          <div className="mt-5 grid gap-5 md:grid-cols-2">

            <div className="rounded-xl bg-blue-50 p-5">
              <p className="text-sm text-blue-700">
                Conversations
              </p>

              <p className="mt-2 text-2xl font-bold text-blue-900">
                {summary.conversationCount}
              </p>
            </div>

            <div className="rounded-xl bg-purple-50 p-5">
              <p className="text-sm text-purple-700">
                Messages
              </p>

              <p className="mt-2 text-2xl font-bold text-purple-900">
                {summary.messageCount}
              </p>
            </div>

          </div>

          <a
            href="/assistant"
            className="mt-5 inline-block font-medium text-blue-600 hover:underline"
          >
            Open AI Medical Assistant →
          </a>

        </section>

        {/* Disclaimer */}

        <div className="mt-8 rounded-xl border border-yellow-200 bg-yellow-50 p-5">

          <p className="text-sm leading-6 text-yellow-800">
            <strong>Important:</strong>{" "}
            This health summary is for
            informational and organizational
            purposes only. It does not provide
            a medical diagnosis or replace
            professional medical advice.
          </p>

        </div>

      </div>
    </main>
  );
}