import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface EventPayload {
  title?: string;
  description?: string;
  location?: string;
  address?: string;
  city?: string;
  state?: string;
  start_date?: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  image_url?: string;
  source_url?: string;
  organizer?: string;
  contact_email?: string;
  contact_phone?: string;
  price_info?: string;
}

interface ScrapedData {
  title?: string;
  description?: string;
  image_url?: string;
  source_url: string;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function generateShortDescription(description?: string): string {
  if (!description) return "";
  if (description.length <= 160) return description;
  return description.slice(0, 157) + "...";
}

function autoCategorize(title: string, description?: string): string {
  const text = (title + " " + (description || "")).toLowerCase();
  if (text.includes("parada") || text.includes("marcha") || text.includes("orgulho")) return "parada";
  if (text.includes("festa") || text.includes("ball") || text.includes("baile") || text.includes("party")) return "festa";
  if (text.includes("drag") || text.includes("show") || text.includes("teatro") || text.includes("cinema") || text.includes("exposição")) return "cultura";
  if (text.includes("saude") || text.includes("prep") || text.includes("teste") || text.includes("mental") || text.includes("hormônio")) return "saude";
  if (text.includes("educação") || text.includes("palestra") || text.includes("workshop") || text.includes("capacitação")) return "educacao";
  if (text.includes("visibilidade") || text.includes("dia da") || text.includes("semana")) return "visibilidade";
  return "encontro";
}

function autoTags(title: string, description?: string): string[] {
  const text = (title + " " + (description || "")).toLowerCase();
  const keywords: [string, string[]][] = [
    ["lgbtq", ["lgbtq", "lgbt", "lgbtqia+"]],
    ["trans", ["trans", "transexual", "travesti", "nao-binario", "nao binario"]],
    ["gay", ["gay", "homossexual"]],
    ["lesbica", ["lesbica", "lesbian", "sapatao"]],
    ["bissexual", ["bissexual", "bi", "pansexual"]],
    ["drag", ["drag", "queen", "king"]],
    ["parada", ["parada", "marcha"]],
    ["fortaleza", ["fortaleza"]],
    ["ceara", ["ceara", "ceará"]],
    ["nordeste", ["nordeste"]],
    ["recife", ["recife"]],
    ["salvador", ["salvador"]],
    ["saude", ["saude", "saúde", "prep", "mental"]],
    ["cultura", ["cultura", "arte", "musica", "música"]],
    ["familia", ["familia", "família", "pais", "filhos"]],
    ["direitos", ["direitos", "politica", "política", "lei"]],
  ];
  const tags: string[] = [];
  for (const [tag, variants] of keywords) {
    if (variants.some((v) => text.includes(v))) {
      tags.push(tag);
    }
  }
  return tags;
}

async function scrapeOpenGraph(url: string): Promise<ScrapedData | null> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
      },
      redirect: "follow",
    });

    if (!response.ok) return null;

    const html = await response.text();

    const getMeta = (property: string): string | null => {
      const regex = new RegExp(
        `<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`,
        "i",
      );
      const match = html.match(regex);
      if (match) return match[1];

      const regex2 = new RegExp(
        `<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["']`,
        "i",
      );
      const match2 = html.match(regex2);
      if (match2) return match2[1];
      return null;
    };

    const getTitle = (): string | null => {
      const ogTitle = getMeta("og:title");
      if (ogTitle) return ogTitle;

      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      if (titleMatch) return titleMatch[1].trim();
      return null;
    };

    const getDescription = (): string | null => {
      const ogDesc = getMeta("og:description");
      if (ogDesc) return ogDesc;

      const metaDesc = html.match(
        /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i,
      );
      if (metaDesc) return metaDesc[1];
      return null;
    };

    const getImage = (): string | null => {
      const ogImage = getMeta("og:image");
      if (ogImage) {
        try {
          return new URL(ogImage, url).href;
        } catch {
          return ogImage;
        }
      }
      return null;
    };

    const title = getTitle();
    const description = getDescription();
    const image_url = getImage();

    if (!title && !description && !image_url) return null;

    return {
      title: title || undefined,
      description: description || undefined,
      image_url: image_url || undefined,
      source_url: url,
    };
  } catch {
    return null;
  }
}

function extractDateFromText(text: string): { start_date?: string; end_date?: string } | null {
  const patterns = [
    { regex: /(\d{2})\/(\d{2})\/(\d{4})/g, groups: [3, 2, 1] },
    { regex: /(\d{2})-(\d{2})-(\d{4})/g, groups: [3, 2, 1] },
    { regex: /(\d{4})-(\d{2})-(\d{2})/g, groups: [1, 2, 3] },
    { regex: /(\d{2})\/(\d{2})/g, groups: [null, 2, 1] },
  ];

  for (const pattern of patterns) {
    const matches = [...text.matchAll(pattern.regex)];
    if (matches.length > 0) {
      const m = matches[0];
      const year = pattern.groups[0] ? m[pattern.groups[0]] : new Date().getFullYear().toString();
      const month = m[pattern.groups[1]];
      const day = m[pattern.groups[2]];
      const start_date = `${year}-${month}-${day}`;

      if (matches.length > 1) {
        const m2 = matches[1];
        const year2 = pattern.groups[0] ? m2[pattern.groups[0]] : new Date().getFullYear().toString();
        const month2 = m2[pattern.groups[1]];
        const day2 = m2[pattern.groups[2]];
        return { start_date, end_date: `${year2}-${month2}-${day2}` };
      }
      return { start_date };
    }
  }
  return null;
}

function extractTimeFromText(text: string): { start_time?: string; end_time?: string } | null {
  const timeRegex = /(\d{1,2}):(\d{2})/g;
  const matches = [...text.matchAll(timeRegex)];
  if (matches.length >= 1) {
    const start_time = `${matches[0][1].padStart(2, "0")}:${matches[0][2]}`;
    if (matches.length >= 2) {
      const end_time = `${matches[1][1].padStart(2, "0")}:${matches[1][2]}`;
      return { start_time, end_time };
    }
    return { start_time };
  }
  return null;
}

function extractLocationFromText(text: string): { location?: string; city?: string; state?: string } | null {
  const cities: [string, string][] = [
    ["Fortaleza", "CE"],
    ["Recife", "PE"],
    ["Salvador", "BA"],
    ["São Luís", "MA"],
    ["Teresina", "PI"],
    ["Natal", "RN"],
    ["João Pessoa", "PB"],
    ["Aracaju", "SE"],
    ["Maceió", "AL"],
  ];

  for (const [city, state] of cities) {
    if (text.toLowerCase().includes(city.toLowerCase())) {
      return { city, state };
    }
  }
  return null;
}

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  let payload: EventPayload;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // SCRAPE MODE: if source_url is provided and auto_scrape is true, just return scraped data
  if (payload.source_url && (payload as Record<string, unknown>).auto_scrape) {
    const scraped = await scrapeOpenGraph(payload.source_url);
    if (!scraped) {
      return new Response(
        JSON.stringify({ error: "Não foi possível extrair informações deste link. Tente preencher manualmente." }),
        { status: 422, headers: { "Content-Type": "application/json" } },
      );
    }

    const combinedText = `${scraped.title || ""} ${scraped.description || ""}`;
    const dates = extractDateFromText(combinedText);
    const times = extractTimeFromText(combinedText);
    const location = extractLocationFromText(combinedText);

    return new Response(
      JSON.stringify({
        scraped: true,
        data: {
          title: scraped.title,
          description: scraped.description,
          image_url: scraped.image_url,
          source_url: scraped.source_url,
          ...dates,
          ...times,
          ...location,
        },
        source: "open_graph",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  }

  const finalTitle = payload.title?.trim();
  const finalDescription = payload.description?.trim();

  if (!finalTitle || finalTitle.length < 3) {
    return new Response(
      JSON.stringify({ error: "Título é obrigatório e deve ter pelo menos 3 caracteres" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const slug = generateSlug(finalTitle);
  const shortDescription = generateShortDescription(finalDescription);
  const category = autoCategorize(finalTitle, finalDescription);
  const tags = autoTags(finalTitle, finalDescription);

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data: existing } = await supabase
    .from("events")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (existing) {
    return new Response(
      JSON.stringify({ error: "Já existe um evento com este título" }),
      { status: 409, headers: { "Content-Type": "application/json" } },
    );
  }

  const { data, error } = await supabase
    .from("events")
    .insert({
      title: finalTitle,
      slug,
      description: finalDescription || null,
      short_description: shortDescription,
      category,
      location: payload.location?.trim() || null,
      address: payload.address?.trim() || null,
      city: payload.city?.trim() || null,
      state: payload.state?.trim() || null,
      start_date: payload.start_date || null,
      end_date: payload.end_date || null,
      start_time: payload.start_time || null,
      end_time: payload.end_time || null,
      image_url: payload.image_url?.trim() || null,
      source_url: payload.source_url?.trim() || null,
      status: "approved",
      organizer: payload.organizer?.trim() || null,
      contact_email: payload.contact_email?.trim() || null,
      contact_phone: payload.contact_phone?.trim() || null,
      price_info: payload.price_info?.trim() || null,
      tags,
    })
    .select()
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(
    JSON.stringify({
      event: data,
      processed: true,
      ai_actions: {
        slug_generated: true,
        short_description_generated: !!shortDescription,
        category_detected: category,
        tags_extracted: tags,
      },
    }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );
});
