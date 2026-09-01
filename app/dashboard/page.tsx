import { UserButton } from "@clerk/nextjs";

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-gray-50">

      {/* ================= HEADER ================= */}

      <header className="flex h-[73px] items-center justify-between border-b bg-white px-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            AI Medical Assistant
          </h1>

          <p className="text-sm text-gray-500">
            Your personal health companion
          </p>
        </div>

        <UserButton />
      </header>

      {/* ================= DASHBOARD ================= */}

      <section className="mx-auto max-w-7xl px-6 py-10">

        {/* Welcome */}

        <div className="mb-10">
          <h2 className="text-4xl font-bold text-gray-900">
            Welcome back!
          </h2>

          <p className="mt-2 text-gray-600">
            How can I help you with your health today?
          </p>
        </div>

        {/* ================= FEATURE CARDS ================= */}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {/* ================================================= */}
          {/* AI HEALTH ASSISTANT */}
          {/* ================================================= */}

          <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
              <span className="text-2xl font-bold text-blue-700">
                AI
              </span>
            </div>

            <h3 className="text-xl font-semibold text-gray-900">
              AI Health Assistant
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              Ask questions about your symptoms, health concerns,
              medications, and general wellness.
            </p>

            <a
              href="/assistant"
              className="mt-6 block w-full rounded-lg bg-blue-600 px-4 py-3 text-center font-medium text-white hover:bg-blue-700"
            >
              Ask AI
            </a>

          </div>

          {/* ================================================= */}
          {/* SYMPTOM CHECKER */}
          {/* ================================================= */}

          <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
              <span className="text-2xl font-bold text-green-700">
                +
              </span>
            </div>

            <h3 className="text-xl font-semibold text-gray-900">
              Symptom Checker
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              Describe your symptoms and answer a few questions
              before getting AI-assisted health information.
            </p>

            {/* IMPORTANT:
                This goes to /symptoms, NOT /assistant
            */}

            <a
              href="/symptoms"
              className="mt-6 block w-full rounded-lg bg-green-600 px-4 py-3 text-center font-medium text-white hover:bg-green-700"
            >
              Check Symptoms
            </a>

          </div>

          {/* ================================================= */}
          {/* HEALTH PROFILE */}
          {/* ================================================= */}

          <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
              <span className="text-2xl font-bold text-purple-700">
                P
              </span>
            </div>

            <h3 className="text-xl font-semibold text-gray-900">
              Health Profile
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              View and update your personal health information.
            </p>

            <a
              href="/profile"
              className="mt-6 block w-full rounded-lg bg-purple-600 px-4 py-3 text-center font-medium text-white hover:bg-purple-700"
            >
              View Profile
            </a>

          </div>

          {/* ================================================= */}
          {/* MEDICATIONS */}
          {/* ================================================= */}

          <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100">
              <span className="text-2xl font-bold text-orange-700">
                M
              </span>
            </div>

            <h3 className="text-xl font-semibold text-gray-900">
              Medications
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              Keep track of your medications and important
              reminders.
            </p>

            <a
              href="/medications"
              className="mt-6 block w-full rounded-lg bg-orange-500 px-4 py-3 text-center font-medium text-white hover:bg-orange-600"
            >
              Manage Medications
            </a>

          </div>

          {/* ================================================= */}
          {/* MEDICAL DOCUMENTS */}
          {/* ================================================= */}

          <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-100">
              <span className="text-2xl font-bold text-red-700">
                D
              </span>
            </div>

            <h3 className="text-xl font-semibold text-gray-900">
              Medical Documents
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              Upload and manage prescriptions, reports, and
              medical documents.
            </p>

            <a
              href="/medical-documents"
              className="mt-6 block w-full rounded-lg bg-red-500 px-4 py-3 text-center font-medium text-white hover:bg-red-600"
            >
              View Documents
            </a>

          </div>

          {/* ================================================= */}
          {/* HEALTH SUMMARY */}
          {/* ================================================= */}

          <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-100">
              <span className="text-2xl font-bold text-cyan-700">
                H
              </span>
            </div>

            <h3 className="text-xl font-semibold text-gray-900">
              Health Summary
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              Get a simple overview of your health information,
              medications, documents, and activity.
            </p>

            <a
              href="/health-summary"
              className="mt-6 block w-full rounded-lg bg-cyan-600 px-4 py-3 text-center font-medium text-white hover:bg-cyan-700"
            >
              View Health Summary
            </a>

          </div>

        </div>

        {/* ================= DISCLAIMER ================= */}

        <div className="mt-10 rounded-xl border border-yellow-200 bg-yellow-50 p-5">

          <p className="text-sm text-yellow-800">
            <strong>Important:</strong> This AI assistant is
            designed to provide general health information and
            is not a replacement for professional medical advice,
            diagnosis, or treatment.
          </p>

        </div>

      </section>
    </main>
  );
}