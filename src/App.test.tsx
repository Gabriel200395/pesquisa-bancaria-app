import axios from "axios";
import { screen, fireEvent, render, waitFor } from "@testing-library/react";
import App from "./App";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const dataTransacao = [
  {
    id: "5f89f9f257fe42957bf6dbfd",
    title: "Resgate",
    description: "et labore proident aute nulla",
    status: "created",
    amount: 2078.66,
  },
];

describe("testando app", () => {
  test("titulo logo navbar", () => {
    render(<App />);
    expect(
      screen.getByRole("link", { name: /Tela Transações/i })
    ).toBeInTheDocument();
  });

  test("verificando campos input e select", () => {
    render(<App />);
    const Input = screen.getByRole("textbox", {
      name: /titulo-transacao/i,
    }) as HTMLInputElement;

    const Select = screen.getByRole("combobox", {
      name: /select-status/,
    }) as HTMLSelectElement; 


    expect(Input.value).toEqual("");
    expect(Select).toBeInTheDocument();

    fireEvent.change(Input, {
      target: {
        value: "Resgate",
      },
    });

    expect(Input.value).toEqual("Resgate"); 
    expect(Select).not.toHaveAttribute("disabled")
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

  test("pesquisa title", async () => {
    mockedAxios.get.mockImplementation(() =>
      Promise.resolve({ data: dataTransacao })
    );

    render(<App />);

    const Input = screen.getByRole("textbox", {
      name: /titulo-transacao/i,
    }) as HTMLInputElement;

    const Select = screen.getByRole("combobox", {
      name: /select-status/,
    }) as HTMLSelectElement; 

   
    fireEvent.change(Input, { target: { value: "Resgate" } });
    await waitFor(() => expect(screen.getByTestId("tr-transacao")).toHaveTextContent(dataTransacao[0].title));
     
    fireEvent.click(Select, { target: { value: "created" } })
    await waitFor(() => expect(screen.getByTestId("tr-transacao")).toHaveTextContent(dataTransacao[0].status));

  });
});
