"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ConnectPage() {
  const router = useRouter();
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [plaidReady, setPlaidReady] = useState(false);

  useEffect(() => {
    const createLinkToken = async () => {
      try {
        const response = await fetch("/api/create_link_token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: `user_${Date.now()}` }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Failed to create link token:", errorData);
          // If Plaid fails, we'll just redirect to loading page
          setPlaidReady(false);
          setIsLoading(false);
          return;
        }
        
        const data = await response.json();
        if (data.link_token) {
          setLinkToken(data.link_token);
          setPlaidReady(true);
        } else {
          console.error("No link_token in response:", data);
          setPlaidReady(false);
        }
      } catch (error) {
        console.error("Error creating link token:", error);
        setPlaidReady(false);
      } finally {
        setIsLoading(false);
      }
    };
    createLinkToken();
  }, []);

  const handleConnectClick = async () => {
    // If Plaid is not configured or not ready, just redirect to loading
    if (!plaidReady || !linkToken) {
      router.push("/loading");
      return;
    }

    // Try to use Plaid Link if available
    try {
      // Dynamically import react-plaid-link only if we have a token
      const { usePlaidLink } = await import("react-plaid-link");
      // For now, just redirect - we'll implement Plaid later if needed
      router.push("/loading");
    } catch (error) {
      console.error("Error with Plaid Link:", error);
      // Fallback: just redirect to loading page
      router.push("/loading");
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-light text-black mb-2">
          Connect Your Bank Account
        </h1>
        <p className="text-gray-600 mb-8 text-sm md:text-base">
          Securely connect your bank account to get started with your loan refinancing.
        </p>

        <div className="space-y-6">
          {/* Add Your Bank Option */}
          <div
            onClick={handleConnectClick}
            className="border border-gray-300 rounded-sm p-6 hover:border-blue-600 transition-colors cursor-pointer active:scale-[0.98]"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleConnectClick();
              }
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-black mb-1">
                  Add Your Bank
                </h3>
                <p className="text-sm text-gray-600">
                  Securely connect your bank account
                </p>
              </div>
              <div className="text-blue-600 text-2xl">→</div>
            </div>
          </div>

          {/* Security Note */}
          <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-sm">
            <p className="text-xs text-gray-600 text-center">
              🔒 Your information is encrypted and secure. We use bank-level security to protect your data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

