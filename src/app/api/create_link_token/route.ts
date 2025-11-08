import { NextRequest, NextResponse } from "next/server";
import { plaidClient } from "@/lib/plaid";
import { Products, CountryCode } from "plaid";

export async function POST(request: NextRequest) {
  try {
    // Check if Plaid credentials are configured
    if (!process.env.PLAID_CLIENT_ID || !process.env.PLAID_SECRET) {
      return NextResponse.json(
        { error: "Plaid credentials not configured. Please set PLAID_CLIENT_ID and PLAID_SECRET in your .env.local file." },
        { status: 500 }
      );
    }

    const { userId } = await request.json();

    // Generate a unique user ID if not provided
    const clientUserId = userId || `user_${Date.now()}`;

    const plaidRequest = {
      user: {
        client_user_id: clientUserId,
      },
      client_name: "Loan Refinancing App",
      products: [Products.Auth],
      country_codes: [CountryCode.Us],
      language: "en",
    };

    const createTokenResponse = await plaidClient.linkTokenCreate(plaidRequest);
    return NextResponse.json(createTokenResponse.data);
  } catch (error: any) {
    console.error("Plaid API error:", error);
    
    // Extract more detailed error information
    const errorMessage = error?.response?.data?.error_message || error?.message || "Unknown error";
    const errorCode = error?.response?.data?.error_code || error?.code || "UNKNOWN_ERROR";
    
    return NextResponse.json(
      { 
        error: "Failed to create link token",
        details: errorMessage,
        code: errorCode
      },
      { status: error?.response?.status || 500 }
    );
  }
}
