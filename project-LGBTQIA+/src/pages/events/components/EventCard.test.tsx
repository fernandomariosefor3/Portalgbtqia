import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import EventCard from "./EventCard";
import type { EventItem } from "@/mocks/events";

const baseEvent: EventItem = {
  id: 1,
  title: "Parada do Orgulho de Fortaleza",
  slug: "parada-orgulho-fortaleza",
  description: "A maior parada do Nordeste.",
  short_description: "A maior parada do Nordeste.",
  category: "parada",
  location: "Aterro da Praia de Iracema",
  address: "Av. Beira Mar",
  city: "Fortaleza",
  state: "CE",
  start_date: "2026-06-28",
  end_date: null,
  start_time: "14:00",
  end_time: null,
  image_url: "https://example.com/img.jpg",
  source_url: "",
  status: "approved",
  organizer: "Coletivo X",
  contact_email: "",
  contact_phone: "",
  price_info: "Gratuito",
  tags: ["parada", "fortaleza"],
  is_featured: true,
  views: 100,
  created_at: "2026-06-01T00:00:00Z",
};

function renderCard(event: EventItem, variant?: "default" | "featured") {
  return render(
    <MemoryRouter>
      <EventCard event={event} variant={variant} />
    </MemoryRouter>
  );
}

describe("EventCard", () => {
  it("exibe o título do evento", () => {
    renderCard(baseEvent);
    expect(screen.getByText(baseEvent.title)).toBeInTheDocument();
  });

  it("liga para a página de detalhe pelo slug", () => {
    renderCard(baseEvent, "featured");
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", `/eventos/${baseEvent.slug}`);
  });

  it("usa o título como texto alternativo da imagem", () => {
    renderCard(baseEvent, "featured");
    expect(screen.getByAltText(baseEvent.title)).toBeInTheDocument();
  });

  it("mostra a label da categoria (parada -> Paradas)", () => {
    renderCard(baseEvent, "featured");
    expect(screen.getByText("Paradas")).toBeInTheDocument();
  });

  it("exibe o selo 'Destaque' quando is_featured é true", () => {
    renderCard(baseEvent, "featured");
    expect(screen.getByText(/Destaque/)).toBeInTheDocument();
  });
});
