import { NextRequest, NextResponse } from "next/server";
import { plaidClient } from "@/lib/plaid";

export async function POST(request: NextRequest) {
  const { public_token } = await request.json();

  try {
    const response = await plaidClient.itemPublicTokenExchange({
      public_token,
    });

    const { access_token, item_id } = response.data;
    // In a real application, you would store the access_token and item_id in your database
    console.log({
      access_token,
      item_id,
    });
    return NextResponse.json({ public_exchange: "complete" });
  } catch (error) {
    console.error("Plaid API error:", error);
    return NextResponse.json(
      { error: "Plaid API error" },
      { status: 500 }
    );
  }
}
