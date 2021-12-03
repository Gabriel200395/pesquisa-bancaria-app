import axios from "axios";
import { screen, fireEvent, render, waitFor } from "@testing-library/react";
import App from "./App";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const dataTransacao = {
  id: "5f89f9f257fe42957bf6dbfd",
  title: "Resgate",
  description: "et labore proident aute nulla",
  status: "created",
  amount: 2078.66,
};

describe("testando app", () => {
  test("titulo logo navbar", () => {
    render(<App />);
    expect(
      screen.getByRole("link", { name: /Tela Transações/i })
    ).toBeInTheDocument();
  });

  test("input vazio e select desabilitado e verificando change input", () => {
    render(<App />);
    const Input = screen.getByRole("textbox", {
      name: /titulo-transaca/i,
    }) as HTMLInputElement;
    const Select = screen.getByRole("combobox", {
      name: /select-desabilitado/,
    }) as HTMLSelectElement;

    expect(Input.value).toEqual("");
    expect(Select).toBeInTheDocument();

    fireEvent.change(Input, {
      target: {
        value: "Resgate",
      },
    });

    expect(Input.value).toEqual("Resgate");
  });

  test("verificando requisicao", async () => {
    mockedAxios.get.mockImplementation(() =>
      Promise.resolve({ data: dataTransacao })
    );
    render(<App />);

    await waitFor(() =>
      expect(screen.getByTestId("tr-transacao")).toBeInTheDocument()
    );
  });
});
