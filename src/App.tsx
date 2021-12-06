import axios from "axios";
import React from "react";
import trasactionsProps from "./Interface/Interface";
import { thArr, tdArr, selectOption } from "./Arrays/Arrays";

function App() {
  const [trasactions, setTrasactions] = React.useState<trasactionsProps[]>([]);
  const [trasactionsFiltro, setTrasactionsFiltro] = React.useState<
    trasactionsProps[]
  >([]);
  const [filtro, setFiltro] = React.useState("");
  const [select, setSelect] = React.useState("");
  const [disabled, setDisabled] = React.useState<boolean>(false);

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
        console.log(e);
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

    if (filtro && trasactionsFiltro.length < 21) {
      setDisabled(false);
    }

    if (trasactionsFiltro.map((e) => e.title === filtro)) {
      setDisabled(false);
    }
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

    setDisabled(true);
  }

  React.useEffect(() => {
    if (trasactionsFiltro.length === 0) {
      setTrasactionsFiltro(trasactions);
    }
    if (trasactionsFiltro.length === 21) {
      setDisabled(true);
      setSelect("status");
    }
    if (filtro && trasactionsFiltro.length === 21) {
      setDisabled(true);
    }
  }, [trasactionsFiltro, filtro, trasactions]);


  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light mb-5 py-4">
        <div className="container">
          <a className="navbar-brand" href="/#">
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
            <select
              className="form-select col-3"
              aria-label="select-status"
              value={select}
              onChange={handleChangeSelect}
              disabled={disabled ? true : false}
            >
              {selectOption.map((op) => (
                <option key={op} value={op}>
                  {op}
                </option>
              ))}
            </select>
          </div>
        </div>
        <table className="table table-striped">
          <thead>
            <tr className="">
              {thArr.map((th) => (
                <th key={th}>{th}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {trasactionsFiltro.map((t) => (
              <tr key={t.id} data-testid="tr-transacao">
                {tdArr.map((td) => (
                  <td key={t[td]}>{t[td]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default App;
