import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ArticleFilters from "./ArticleFilters";

const articles = [
  { category: "saude" },
  { category: "cultura" },
];

describe("ArticleFilters", () => {
  const renderFilters = () => render(
    <MemoryRouter>
      <ArticleFilters activeCategory="todas" articles={articles} />
    </MemoryRouter>,
  );

  it("renderiza o botão 'Todas' como ativo por padrão", () => {
    renderFilters();
    expect(screen.getByRole("button", { name: "Todas" })).toHaveAttribute("aria-current", "page");
  });

  it("renderiza mais de uma categoria além de 'Todas'", () => {
    renderFilters();
    expect(screen.getAllByRole("button").length).toBeGreaterThan(1);
  });
});
