import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ArticleFilters from "./ArticleFilters";

describe("ArticleFilters", () => {
  it("renderiza o botão 'Todas'", () => {
    render(<ArticleFilters activeCategory="todas" onChange={() => {}} />);
    expect(screen.getByRole("button", { name: "Todas" })).toBeInTheDocument();
  });

  it("chama onChange com a categoria ao clicar", async () => {
    const onChange = vi.fn();
    render(<ArticleFilters activeCategory="todas" onChange={onChange} />);

    const buttons = screen.getAllByRole("button");
    // Clica em um botão de categoria que não seja "Todas".
    const target = buttons.find((b) => b.textContent !== "Todas");
    expect(target).toBeDefined();
    await userEvent.click(target!);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(expect.any(String));
    expect(onChange).not.toHaveBeenCalledWith("Todas");
  });

  it("renderiza mais de uma categoria além de 'Todas'", () => {
    render(<ArticleFilters activeCategory="todas" onChange={() => {}} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(1);
  });
});
