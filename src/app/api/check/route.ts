// important
import { NextRequest } from "next/server";



export function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    console.log(searchParams);
    const checkId = searchParams.get('checkId'); // e.g. `/api/search?query=hello`
    console.log(checkId);
    return new Response(JSON.stringify({ data: "your id : " + checkId }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({
      error: "Generation failed. Please try again."
    }), { status: 500 });
  }
}