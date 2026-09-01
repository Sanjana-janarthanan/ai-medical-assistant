"use client";

import { useEffect, useRef, useState } from "react";

type MedicalDocument = {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string | null;
  description: string | null;
  createdAt: string;
};

export default function MedicalDocumentsPage() {
  const [documents, setDocuments] = useState<
    MedicalDocument[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  // =====================================================
  // LOAD DOCUMENTS
  // =====================================================

  useEffect(() => {
    loadDocuments();
  }, []);

  async function loadDocuments() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/medical-documents",
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to load documents."
        );
      }

      setDocuments(data);
    } catch (error) {
      console.error(
        "Failed to load documents:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load documents."
      );
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // UPLOAD DOCUMENT
  // =====================================================

  async function handleUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");
    setSuccess("");

    // Client-side file validation

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Only PDF, JPG, PNG, and WEBP files are allowed."
      );

      e.target.value = "";

      return;
    }

    const maxSize =
      10 * 1024 * 1024;

    if (file.size > maxSize) {
      setError(
        "File size must be less than 10 MB."
      );

      e.target.value = "";

      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("file", file);

      const response = await fetch(
        "/api/medical-documents/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const responseText =
        await response.text();

      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(
          "Server returned an invalid response."
        );
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to upload document."
        );
      }

      // Add newly uploaded document
      // to the beginning of the list

      if (data.document) {
        setDocuments((previous) => [
          data.document,
          ...previous,
        ]);
      }

      setSuccess(
        "Medical document uploaded successfully!"
      );

      // Clear file input

      e.target.value = "";
    } catch (error) {
      console.error(
        "Upload failed:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to upload document."
      );
    } finally {
      setUploading(false);
    }
  }

  // =====================================================
  // DELETE DOCUMENT
  // =====================================================

  async function handleDelete(
    id: string
  ) {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this document?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      const response = await fetch(
        `/api/medical-documents?id=${id}`,
        {
          method: "DELETE",
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to delete document."
        );
      }

      setDocuments(
        (previous) =>
          previous.filter(
            (document) =>
              document.id !== id
          )
      );

      setSuccess(
        "Document deleted successfully."
      );
    } catch (error) {
      console.error(
        "Delete failed:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete document."
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
            Medical Documents
          </h1>

          <p className="mt-2 text-gray-600">
            Upload and manage your medical
            reports, prescriptions, and
            health documents.
          </p>
        </div>

        {/* Success */}

        {success && (
          <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* Error */}

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Upload */}

        <section className="mt-8 rounded-2xl border bg-white p-8 shadow-sm">

          <h2 className="text-2xl font-bold text-gray-900">
            Upload a Medical Document
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Supported formats: PDF, JPG,
            PNG, WEBP. Maximum size: 10 MB.
          </p>

          <div className="mt-6 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-10 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
              <span className="text-2xl font-bold text-red-600">
                +
              </span>
            </div>

            <h3 className="mt-4 font-semibold text-gray-800">
              Upload your medical document
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Choose a prescription,
              laboratory report, scan report,
              or other medical document.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              onChange={handleUpload}
              className="hidden"
            />

            <button
              type="button"
              onClick={() =>
                fileInputRef.current?.click()
              }
              disabled={uploading}
              className="mt-6 rounded-xl bg-red-500 px-6 py-3 font-semibold text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {uploading
                ? "Uploading..."
                : "Choose Document"}
            </button>

          </div>

        </section>

        {/* Documents */}

        <section className="mt-8">

          <div className="flex items-center justify-between">

            <h2 className="text-2xl font-bold text-gray-900">
              Your Documents
            </h2>

            <span className="rounded-full bg-gray-200 px-3 py-1 text-sm text-gray-700">
              {documents.length}{" "}
              {documents.length === 1
                ? "document"
                : "documents"}
            </span>

          </div>

          {loading ? (

            <div className="mt-5 rounded-2xl border bg-white p-8 text-center text-gray-500">
              Loading documents...
            </div>

          ) : documents.length === 0 ? (

            <div className="mt-5 rounded-2xl border bg-white p-8 text-center">

              <p className="font-medium text-gray-700">
                No medical documents yet.
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Upload your first medical
                document above.
              </p>

            </div>

          ) : (

            <div className="mt-5 space-y-4">

              {documents.map(
                (document) => (

                  <div
                    key={document.id}
                    className="rounded-2xl border bg-white p-6 shadow-sm"
                  >

                    <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

                      {/* Document info */}

                      <div className="flex items-start gap-4">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-100">
                          <span className="font-bold text-red-600">
                            {document.fileType ===
                            "application/pdf"
                              ? "PDF"
                              : "IMG"}
                          </span>
                        </div>

                        <div>

                          <h3 className="break-all text-lg font-bold text-gray-900">
                            {document.fileName}
                          </h3>

                          <p className="mt-1 text-sm text-gray-500">
                            {document.fileType ||
                              "Medical document"}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            Uploaded{" "}
                            {new Date(
                              document.createdAt
                            ).toLocaleDateString()}
                          </p>

                        </div>

                      </div>

                      {/* Actions */}

                      <div className="flex gap-3">

                        <a
  href={document.fileUrl}
  target="_blank"
  rel="noopener noreferrer"
  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
>
  View PDF
</a>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              document.id
                            )
                          }
                          className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </section>

        {/* Security notice */}

        <div className="mt-8 rounded-xl border border-yellow-200 bg-yellow-50 p-5">

          <p className="text-sm leading-6 text-yellow-800">
            <strong>Privacy notice:</strong>{" "}
            Medical documents may contain sensitive
            health information. Only upload documents
            you are comfortable storing in this
            application.
          </p>

        </div>

        {/* Medical disclaimer */}

        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-5">

          <p className="text-sm leading-6 text-gray-600">
            <strong>Medical disclaimer:</strong>{" "}
            Uploaded documents are stored for
            organizational purposes. This application
            does not replace professional medical
            advice, diagnosis, or treatment.
          </p>

        </div>

      </div>
    </main>
  );
}