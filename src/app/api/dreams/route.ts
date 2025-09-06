import { createBrowserClient } from "@supabase/ssr";

export async function POST(req: Request) {
  const supabase = await createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string
  );

  // fetch Dreams db with supabase client
  // const { userId } = await req.json();
  const { data, error } = await supabase
    .from("Dreams")
    .select("*")
    // .eq("user_id", userId)
    .order("idx", { ascending: false });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ data }), {
    status: 200,
  });
}
