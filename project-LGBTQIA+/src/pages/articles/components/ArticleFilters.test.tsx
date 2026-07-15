import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import ArticleFilters from "./ArticleFilters";

const articles = [
  { category: "saude" },
  { category: "cultura" },
];

describe("ArticleFilters", () => {
  const renderFilters = (onNavigate = () => {}) => render(
    <MemoryRouter>
      <ArticleFilters activeCategory="todas" articles={articles} onNavigate={onNavigate} />
    </MemoryRouter>,
  );

  it("renderiza o link rastreável 'Todas'", () => {
    renderFilters();
    expect(screen.getByRole("link", { name: "Todas" })).toHaveAttribute("href", "/artigos");
  });

  it("chama onNavigate ao clicar em uma categoria", async () => {
    const onNavigate = vi.fn();
    renderFilters(onNavigate);
    const links = screen.getAllByRole("link");
    const target = links.find((item) => item.textContent !== "Todas");
    expect(target).toBeDefined();
    await userEvent.click(target!);
    expect(onNavigate).toHaveBeenCalledTimes(1);
    expect(target).toHaveAttribute("href", expect.stringContaining("/artigos/categoria/"));
  });

  it("renderiza mais de uma categoria além de 'Todas'", () => {
    renderFilters();
    expect(screen.getAllByRole("link").length).toBeGreaterThan(1);
  });
});
