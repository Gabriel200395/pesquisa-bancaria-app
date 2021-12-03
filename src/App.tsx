import axios from "axios";
import React from "react";
import trasactionsProps from "./Interface/Interface";

function App() {
  const [trasactions, setTrasactions] = React.useState<trasactionsProps[]>([]);
  const [trasactionsFiltro, setTrasactionsFiltro] = React.useState<
    trasactionsProps[]
  >([]);
  const [filtro, setFiltro] = React.useState("");
  const [select, setSelect] = React.useState("");

  React.useEffect(() => {
    async function req() {
      try {
        const trasactionsApi = await axios.get(
          "https://warren-transactions-api.herokuapp.com/api/transactions"
        );
        const response = await trasactionsApi;
        setTrasactions(response.data);
        setTrasactionsFiltro(response.data);
      } catch (e) {
        console.log(e)
      }
    }

    req();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFiltro(event.target.value);
    setTrasactionsFiltro(
      trasactions.filter((tr) =>
        tr.title
          .toLocaleLowerCase()
          .toLocaleUpperCase()
          .includes(event.target.value.toLocaleLowerCase().toLocaleUpperCase())
      )
    );
    setTrasactions(trasactions);
  };

  function handleChangeSelect(event: React.ChangeEvent<HTMLSelectElement>) {
    setSelect(event.target.value);
    setTrasactionsFiltro(
      trasactionsFiltro.filter(
        (tr) =>
          tr.status.includes(event.target.value) &&
          tr.title
            .toLocaleLowerCase()
            .toLocaleUpperCase()
            .includes(filtro.toLocaleLowerCase().toLocaleUpperCase())
      )
    );
  }

  React.useEffect(() => {
    if (trasactionsFiltro.length == 0) {
      setTrasactionsFiltro(trasactions);
    }
  }, [trasactionsFiltro]);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light mb-5 py-4">
        <div className="container">
          <a className="navbar-brand" href="#">
            Tela Transações
          </a>
        </div>
      </nav>
      <div className="container">
        <div className="row mb-5">
          <div className="col-4">
            <input
              type="text"
              className="form-control col-3"
              placeholder="pesquise por tiulo"
              aria-label="titulo-transacao"
              aria-describedby="basic-addon1"
              value={filtro}
              onChange={handleChange}
            />
          </div>
          <div className="col-2">
            {filtro ? (
              <select
                className="form-select col-3"
                aria-label="select-habilitado"
                value={select}
                onChange={handleChangeSelect}
              >
                <option>status</option>
                <option value="created">created</option>
                <option value="processed">processed</option>
                <option value="processing">processing</option>
              </select>
            ) : (
              <select
                className="form-select col-3"
                aria-label="select-desabilitado"
                value={select}
                onChange={handleChangeSelect}
                disabled
              >
                <option>status</option>
                <option value="created">created</option>
                <option value="processed">processed</option>
                <option value="processing">processing</option>
              </select>
            )}
          </div>
        </div>
        <table className="table table-striped">
          <thead>
            <tr className="">
              <th scope="col">Titulo</th>
              <th scope="col">Descrição</th>
              <th scope="col">Status</th>
              <th scope="col">Valor</th>
            </tr>
          </thead>
          <tbody>
            {trasactionsFiltro.map((t) => (
              <tr key={t.id} data-testid="tr-transacao">
                <td>{t.title}</td>
                <td>{t.description}</td>
                <td>{t.status}</td>
                <td>
                  {t.amount.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default App;
