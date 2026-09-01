import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex h-[73px] max-w-7xl items-center justify-between px-6">

          {/* Logo / Name */}
          <Link
            href="/"
            className="text-xl font-bold text-gray-900"
          >
            AI Medical Assistant
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-4">

            <Link
              href="/sign-in"
              className="rounded-lg px-4 py-2 font-medium text-gray-700 hover:bg-gray-100"
            >
              Sign In
            </Link>

            <Link
              href="/sign-up"
              className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
            >
              Sign Up
            </Link>

          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 py-20">

        <div className="mx-auto max-w-3xl text-center">

          <div className="mb-6 inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
            AI-powered health companion
          </div>

          <h1 className="text-5xl font-bold tracking-tight text-gray-900">
            Your Personal
            <span className="text-blue-600">
              {" "}AI Medical Assistant
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            Get general health information, understand your
            symptoms, manage your health profile, and keep
            your medical information organized in one place.
          </p>

          {/* Get Started */}
          <div className="mt-10 flex justify-center gap-4">

            <Link
              href="/sign-up"
              className="rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              Get Started
            </Link>

            <Link
              href="/sign-in"
              className="rounded-xl border border-gray-300 bg-white px-8 py-4 text-lg font-semibold text-gray-700 hover:bg-gray-100"
            >
              Sign In
            </Link>

          </div>

        </div>

        {/* Features */}
        <div className="mt-20 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {/* AI Assistant */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-xl font-bold text-blue-600">
              AI
            </div>

            <h2 className="text-xl font-semibold text-gray-900">
              AI Medical Assistant
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Ask general health questions and receive
              helpful information from your AI assistant.
            </p>

          </div>

          {/* Symptom Checker */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-xl font-bold text-green-600">
              +
            </div>

            <h2 className="text-xl font-semibold text-gray-900">
              Symptom Checker
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Answer a few questions about your symptoms
              and get general health information.
            </p>

          </div>

          {/* Health Profile */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-xl font-bold text-purple-600">
              P
            </div>

            <h2 className="text-xl font-semibold text-gray-900">
              Health Profile
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Store your basic health information so the
              assistant can provide more relevant responses.
            </p>

          </div>

          {/* Medications */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-xl font-bold text-orange-600">
              M
            </div>

            <h2 className="text-xl font-semibold text-gray-900">
              Medications
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Keep track of your medications and related
              information.
            </p>

          </div>

          {/* Medical Documents */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-xl font-bold text-red-600">
              D
            </div>

            <h2 className="text-xl font-semibold text-gray-900">
              Medical Documents
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Upload and manage prescriptions, reports,
              and other medical documents.
            </p>

          </div>

          {/* Health Summary */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-100 text-xl font-bold text-cyan-600">
              H
            </div>

            <h2 className="text-xl font-semibold text-gray-900">
              Health Summary
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              View a simple overview of your health
              information and activity.
            </p>

          </div>

        </div>

      </section>

      {/* Disclaimer */}
      <section className="mx-auto max-w-7xl px-6 pb-12">

        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-5">

          <p className="text-sm leading-6 text-yellow-800">
            <strong>Important:</strong> This application
            provides general health information only. It is
            not a replacement for professional medical advice,
            diagnosis, or treatment.
          </p>

        </div>

      </section>

      {/* Footer */}
      <footer className="border-t bg-white">

        <div className="mx-auto max-w-7xl px-6 py-6 text-center text-sm text-gray-500">
          AI Medical Assistant — General health information
          and wellness support
        </div>

      </footer>

    </main>
  );
}