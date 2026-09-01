"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SymptomsPage() {
  const router = useRouter();

  const [symptoms, setSymptoms] =
    useState("");

  const [duration, setDuration] =
    useState("");

  const [severity, setSeverity] =
    useState("");

  const [additionalSymptoms, setAdditionalSymptoms] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!symptoms.trim()) {
      alert(
        "Please enter at least one symptom."
      );

      return;
    }

    setLoading(true);

    // =================================================
    // CREATE QUESTIONNAIRE MESSAGE
    // =================================================

    const symptomMessage = `
I want to use the symptom checker.

Symptoms:
${symptoms.trim()}

Duration:
${duration || "Not specified"}

Severity:
${severity || "Not specified"}

Additional symptoms:
${
      additionalSymptoms.trim() ||
      "None reported"
    }
`;

    try {
      console.log(
        "Sending symptoms to AI..."
      );

      // =================================================
      // SEND DIRECTLY TO AI API
      // =================================================

      const response =
        await fetch(
          "/api/assistant",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              message:
                symptomMessage.trim(),

              isSymptomChecker:
                true,
            }),
          }
        );

      // Read as text first so we can
      // properly diagnose server errors.
      const responseText =
        await response.text();

      console.log(
        "Symptom API status:",
        response.status
      );

      console.log(
        "Symptom API response:",
        responseText
      );

      let data;

      try {
        data =
          JSON.parse(responseText);
      } catch {
        throw new Error(
          "The server returned an invalid response."
        );
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to analyze symptoms."
        );
      }

      // =================================================
      // MAKE SURE AI RETURNED RESULT
      // =================================================

      if (
        !data.response ||
        !data.conversationId
      ) {
        throw new Error(
          "The AI did not return a valid analysis."
        );
      }

      console.log(
        "Symptom analysis completed."
      );

      console.log(
        "Conversation ID:",
        data.conversationId
      );

      // =================================================
      // OPEN EXACT CONVERSATION
      // =================================================

      router.push(
        `/assistant?conversationId=${encodeURIComponent(
          data.conversationId
        )}`
      );

    } catch (error) {
      console.error(
        "Symptom analysis failed:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to analyze symptoms."
      );

      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">

      <div className="mx-auto max-w-3xl">

        {/* HEADER */}

        <div className="mb-8">

          <h1 className="text-4xl font-bold text-gray-900">
            Symptom Checker
          </h1>

          <p className="mt-2 text-gray-600">
            Tell us about your symptoms and
            our AI assistant will provide
            general health information.
          </p>

        </div>

        {/* INFORMATION */}

        <div className="mb-8 rounded-xl border border-blue-200 bg-blue-50 p-5">

          <p className="text-sm text-blue-800">

            <strong>
              Important:
            </strong>{" "}
            This symptom checker provides
            general health information only.
            It does not provide a medical
            diagnosis or replace a qualified
            healthcare professional.

          </p>

        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border bg-white p-8 shadow-sm"
        >

          {/* SYMPTOMS */}

          <div>

            <label className="mb-2 block text-lg font-semibold text-gray-900">
              What symptoms are you experiencing?
            </label>

            <textarea
              value={symptoms}
              onChange={(e) =>
                setSymptoms(
                  e.target.value
                )
              }
              placeholder="Example: headache, fever, cough, fatigue..."
              rows={5}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />

            <p className="mt-2 text-sm text-gray-500">
              You can enter multiple symptoms
              separated by commas.
            </p>

          </div>

          {/* DURATION */}

          <div>

            <label className="mb-2 block text-lg font-semibold text-gray-900">
              How long have you had these symptoms?
            </label>

            <select
              value={duration}
              onChange={(e) =>
                setDuration(
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            >

              <option value="">
                Select duration
              </option>

              <option value="Less than 24 hours">
                Less than 24 hours
              </option>

              <option value="1-3 days">
                1-3 days
              </option>

              <option value="4-7 days">
                4-7 days
              </option>

              <option value="1-2 weeks">
                1-2 weeks
              </option>

              <option value="More than 2 weeks">
                More than 2 weeks
              </option>

              <option value="Long-term or recurring">
                Long-term or recurring
              </option>

            </select>

          </div>

          {/* SEVERITY */}

          <div>

            <label className="mb-2 block text-lg font-semibold text-gray-900">
              How severe are your symptoms?
            </label>

            <select
              value={severity}
              onChange={(e) =>
                setSeverity(
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            >

              <option value="">
                Select severity
              </option>

              <option value="Mild">
                Mild
              </option>

              <option value="Moderate">
                Moderate
              </option>

              <option value="Severe">
                Severe
              </option>

            </select>

          </div>

          {/* ADDITIONAL SYMPTOMS */}

          <div>

            <label className="mb-2 block text-lg font-semibold text-gray-900">
              Any additional symptoms?
            </label>

            <textarea
              value={
                additionalSymptoms
              }
              onChange={(e) =>
                setAdditionalSymptoms(
                  e.target.value
                )
              }
              placeholder="Example: nausea, dizziness, sore throat..."
              rows={4}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />

          </div>

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-green-600 px-6 py-4 text-lg font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >

            {loading
              ? "Analyzing Symptoms..."
              : "Analyze Symptoms"}

          </button>

        </form>

      </div>

    </main>
  );
}