import React from "react";
import style from "../styles/Contrat.module.css";
import Navbar from "./Navbar";
import { useState, useEffect, useRef } from "react";
import { Modal } from "antd";
import { useSelector } from "react-redux";
const { ObjectId } = require("mongoose").Types;
import Header from "./Header";
import { useRouter } from "next/router";

function Contrat() {
  const router = useRouter();

  const BACKEND_ADDRESS = "http://localhost:3000";
  const ContratReducer = useSelector((state) => state.contrat.value);
  const [dataInterlocutor, setDataInterlocutor] = useState([]);

  const [typeContrat, setTypeContrat] = useState(`${ContratReducer.type}`);
  const [montantContrat, setMontantContrat] = useState(
    `${ContratReducer.amount}`
  );
  const [margeContrat, setMargeContrat] = useState(`${ContratReducer.marge}`);
  const [dureeContrat, setDureeContrat] = useState(
    `${ContratReducer.duration}`
  );
  const [startContrat, setStartContrat] = useState(
    `${ContratReducer.contratStart.substring(0, 10)}`
  );

  // toISOString().substring(0, 10);
  const [endContrat, setEndContrat] = useState(
    `${ContratReducer.contratEnd.substring(0, 10)}`
  );
  const [vrContrat, setVrContrat] = useState(`${ContratReducer.residualValue}`);

  const [interlocName, setInterlocName] = useState("");
  const [phoneNumber, setPhoneNumer] = useState("");
  const [interlocFirstName, setInterlocFirstname] = useState("");
  const [interlocMail, setInterlocMail] = useState("");
  const [interlocJob, setInterlocJob] = useState("");
  const [showModalContrat, setShowModalContrat] = useState(false);
  const [showModalInterlocutor, setShowModalInterlocutor] = useState(false);
  const [modalModifierSuccess, setModalModifierSuccess] = useState(false);
  const [modalModifierFailed, setModalModifierFailed] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showModalDoc, setShowModalDoc] = useState(false);
  const [refresh, setRefresh] = useState(false);

  console.log("ContratReducer", ContratReducer);
  console.log("dataInterlocutor", dataInterlocutor);

  useEffect(() => {
    fetch(`${BACKEND_ADDRESS}/contrat/contrat/${ContratReducer._id}`)
      .then((res) => res.json())
      .then((data) => {
        setDataInterlocutor([data.contrat.interlocutor]);
      });
  }, [refresh]);

  const contratData = [ContratReducer].map((item, i) => {
    const contratStart = new Date(item.contratStart);
    const contratStartFormattedDate = contratStart.toLocaleDateString();
    const contratEnd = new Date(item.contratEnd);
    const contratEndFormattedDate = contratEnd.toLocaleDateString();
    return (
      <div className={style.data} key={i}>
        <span className={style.texte}>Type d'équipements : {item.type}</span>
        <span className={style.texte}>Montant financé : {item.amount} €</span>
        <span className={style.texte}>Marge : {item.marge} %</span>
        <span className={style.texte}>
          Durée contractuelle : {item.duration} mois
        </span>
        <span className={style.texte}>
          Date de démarrage : {contratStartFormattedDate}
        </span>
        <span className={style.texte}>
          Date de fin : {contratEndFormattedDate}
        </span>
        <span className={style.texte}>
          Valeur résiduelle : {item.residualValue} %
        </span>
      </div>
    );
  });

  const interlocutorData = dataInterlocutor.map((item, i) => {
    return (
      <div className={style.data} key={i}>
        <span className={style.texte}>Nom : {item.name}</span>
        <span className={style.texte}>Prénom : {item.firstname}</span>
        <span className={style.texte}>Poste : {item.poste}</span>
        <span className={style.texte}>Téléphone : {item.phone}</span>
        <span className={style.texte}>Mail : {item.email}</span>
      </div>
    );
  });

  const saveContrat = async () => {
    const response = await fetch(
      `${BACKEND_ADDRESS}/contrat/updateContrat/${ContratReducer._id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: typeContrat,
          amount: montantContrat,
          marge: margeContrat,
          duration: dureeContrat,
          contratStart: startContrat,
          contratEnd: endContrat,
          residualValue: vrContrat,
        }),
      }
    );
    const data = await response.json();
    if (data.result) {
      console.log("ROUTE PUT CONTRAT =>", data.contrat);
      setShowModalContrat(false);
      setRefresh(!refresh);
    } else {
      console.log("FAILED ROUTE PUT CONTRAT");
    }
  };
  console.log("id reduceur contrat", ContratReducer._id);
  const saveInterlocutor = async () => {
    // PUT DB CLIENT AJOUT D'UN NOUVEL INTERLOCUTEUR => Ce fetch ajoute directement un interlocuteur à la DB Interlocuteur
    // const clientID = [new ObjectId(ContratReducer.client)];
    const response1 = await fetch(
      `${BACKEND_ADDRESS}/contrat/addInterlocutor/${ContratReducer._id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: interlocName,
          firstname: interlocFirstName,
          poste: interlocJob,
          phone: phoneNumber,
          email: interlocMail,
          client: ContratReducer.client,
        }),
      }
    );
    const data1 = await response1.json();
    if (data1.result) {
      console.log("ROUTE PUT INTERLOC =>", data1.data.interlocutor);
      setInterlocName("");
      setPhoneNumer("");
      setInterlocFirstname("");
      setInterlocMail("");
      setInterlocJob("");
      setShowModalInterlocutor(false);
      setRefresh(!refresh);
    } else {
      console.log("FAILED ROUTE PUT");
    }
  };

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = async () => {
    // requete PUT qui enregistre le PDF dans la DB du contrat du client
    const response = await fetch(
      `${BACKEND_ADDRESS}/contrat/updateLink/${ContratReducer._id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          links: inputValue,
        }),
      }
    );
    const data = await response.json();
    if (data.result) {
      console.log("ROUTE PUT LINK =>", data.contrat);
    } else {
      console.log("FAILED ROUTE PUT LINK");
    }
  };

  const handleDelete = async () => {
    const response = await fetch(
      `${BACKEND_ADDRESS}/contrat/${ContratReducer._id}`,
      {
        method: "DELETE",
      }
    );
    const data = await response.json();
    if (data.result) {
      console.log("DELETE DB CONTRAT =>", data);
      router.push("/allContrat");
    } else {
      console.log("FAILED DELETE DB CONTRAT =>", data);
    }
  };

  const handleCloseModal = () => {
    setShowModalContrat(false);
    setShowModalInterlocutor(false);
    setModalModifierFailed(false);
    setShowModalDoc(false);
    setModalModifierSuccess(false);
  };

  return (
    <>
      <div className={style.mainContent}>
        <Navbar />
        <Header name={`Contrat: ${ContratReducer.name}`} />
        <div className={style.container}>
          <div className={style.SousContainerLeft}>
            <div className={style.boxData + " " + style.boxData1}>
              <span className={style.titreBoxData}>
                Informations du contrat :
              </span>
              <div className={style.contenuBoxData}>{contratData}</div>
            </div>
            <div className={style.boxData + " " + style.boxData3}>
              <div className={style.contenuBoxData}>
                <button
                  className={style.button}
                  onClick={() => setShowModalContrat(true)}
                >
                  Modifier le contrat
                </button>
              </div>
            </div>
            <div className={style.boxData + " " + style.boxData}>
              <span className={style.titreBoxData}>
                Interlocuteur du contrat :
              </span>
              <div className={style.contenuBoxData}>{interlocutorData}</div>
            </div>
            <div className={style.boxData + " " + style.boxData3}>
              <div className={style.contenuBoxData}>
                <button
                  className={style.button}
                  onClick={() => setShowModalInterlocutor(true)}
                >
                  Modifier l'interlocutor
                </button>
              </div>
            </div>
          </div>
          <div className={style.SousContainerRight}>
            <div className={style.boxData + " " + style.boxData}>
              <span className={style.titreBoxData}>Documents joints :</span>
            </div>
            <div className={style.boxData + " " + style.boxData5}>
              <div className={style.contenuBoxData}>
                <img
                  src="/faux-contrat.webp"
                  alt="Image contrat"
                  width="200px"
                  height="200px"
                />
              </div>

              {/* <iframe
                src={`${testPdf}#view=fitH`}
                title="testPdf"
                height="100%"
                width="100%"
              /> */}
            </div>

            <div className={style.boxData + " " + style.boxData4}>
              <div className={style.contenuBoxData}>
                <div>
                  <button
                    onClick={() => setShowModalDoc(true)}
                    className={style.button}
                  >
                    Ajouter un document
                  </button>
                </div>
              </div>
            </div>

            <div className={style.boxData + " " + style.boxData6}>
              <div className={style.contenuBoxData}>
                <button className={style.button} onClick={() => handleDelete()}>
                  Supprimer le contrat
                </button>
              </div>
            </div>
          </div>
          <Modal
            onCancel={() => handleCloseModal()}
            open={showModalContrat}
            footer={null}
          >
            <span>Modifications contrat : </span>
            <div className={style.newContratContainer}>
              <br />
              <div className={style.InputNewContratContainer}>
                <div>
                  <div className={style.InputContrat}>
                    <p className={style.titreInput}>Type d'équipement :</p>
                    <input
                      className={style}
                      placeholder="Type d'équipement"
                      type="text"
                      onChange={(e) => setTypeContrat(e.target.value)}
                      value={typeContrat}
                    ></input>
                  </div>

                  <br />
                  <div className={style.InputContrat}>
                    <p className={style.titreInput}>Montant :</p>
                    <input
                      className={style}
                      placeholder="Montant"
                      type="text"
                      onChange={(e) => setMontantContrat(e.target.value)}
                      value={montantContrat}
                    ></input>
                  </div>

                  <br />
                  <div className={style.InputContrat}>
                    <p className={style.titreInput}>Marge :</p>
                    <input
                      className={style}
                      placeholder="Marge"
                      type="text"
                      onChange={(e) => setMargeContrat(e.target.value)}
                      value={margeContrat}
                    ></input>
                  </div>

                  <br />
                  <div className={style.InputContrat}>
                    <p className={style.titreInput}>Durée du contrat :</p>
                    <input
                      className={style}
                      placeholder="Durée du contrat"
                      type="text"
                      onChange={(e) => setDureeContrat(e.target.value)}
                      value={dureeContrat}
                    ></input>
                  </div>

                  <br />
                  <div className={style.InputContrat}>
                    <p className={style.titreInput}>Date de démarrage :</p>
                    <input
                      className={style}
                      placeholder="Date de démarrage"
                      type="date"
                      onChange={(e) => setStartContrat(e.target.value)}
                      value={startContrat}
                    ></input>
                  </div>

                  <br />
                  <div className={style.InputContrat}>
                    <p className={style.titreInput}>Date de fin :</p>
                    <input
                      className={style}
                      placeholder="Date de fin"
                      type="date"
                      onChange={(e) => setEndContrat(e.target.value)}
                      value={endContrat}
                    ></input>
                  </div>

                  <br />
                  <div className={style.InputContrat}>
                    <p className={style.titreInput}>Valeur residuelle :</p>
                    <input
                      className={style}
                      placeholder="Valeur residuelle"
                      type="text"
                      onChange={(e) => setVrContrat(e.target.value)}
                      value={vrContrat}
                    ></input>
                  </div>
                </div>
                <br />
                <div>
                  <button
                    className={style.button}
                    onClick={() => saveContrat()}
                  >
                    Enregistrer
                  </button>
                </div>
              </div>
            </div>
          </Modal>
          <Modal
            onCancel={() => handleCloseModal()}
            open={showModalInterlocutor}
            footer={null}
          >
            <span>Nouvel Interlocutor du contrat : </span>
            <div className={style.newInterlocutorContainer}>
              <br />
              <div className={style.InputNewInterlocutorContainer}>
                <input
                  className={style.inputNewInterlocutor}
                  placeholder="Nom"
                  type="text"
                  onChange={(e) => setInterlocName(e.target.value)}
                  value={interlocName}
                ></input>
                <br />
                <input
                  className={style.inputNewInterlocutor}
                  placeholder="Prénom"
                  type="text"
                  onChange={(e) => setInterlocFirstname(e.target.value)}
                  value={interlocFirstName}
                ></input>
                <br />
                <input
                  className={style.inputNewInterlocutor}
                  placeholder="Poste"
                  type="text"
                  onChange={(e) => setInterlocJob(e.target.value)}
                  value={interlocJob}
                ></input>
                <br />
                <input
                  className={style.inputNewInterlocutor}
                  placeholder="Numéro de téléphone"
                  type="text"
                  onChange={(e) => setPhoneNumer(e.target.value)}
                  value={phoneNumber}
                ></input>
                <br />
                <input
                  className={style.inputNewInterlocutor}
                  placeholder="Email"
                  type="text"
                  onChange={(e) => setInterlocMail(e.target.value)}
                  value={interlocMail}
                ></input>
                <br />
                <div>
                  <button
                    className={style.button}
                    onClick={() => saveInterlocutor()}
                  >
                    Enregistrer
                  </button>
                </div>
              </div>
            </div>
          </Modal>
          <Modal
            onCancel={() => handleCloseModal()}
            open={showModalDoc}
            footer={null}
          >
            <div className={style.form}>
              <form>
                <label
                  htmlFor="filePicker"
                  className={style.customFileUpload + " " + style.button}
                >
                  Sélectionner un document
                </label>
                {inputValue}
                <br />
                <input
                  className={style.fileUpload}
                  type="file"
                  id="filePicker"
                  onChange={handleChange}
                  value={inputValue}
                />
                <br />
                <button
                  type="submit"
                  className={style.customFileUpload + " " + style.button}
                  onClick={() => handleSubmit()}
                >
                  Ajouter
                </button>
              </form>
            </div>
          </Modal>
          <Modal
            onCancel={() => handleCloseModal()}
            open={modalModifierSuccess}
            footer={null}
          >
            <p style={{ fontSize: 18, textAlign: "center" }}>
              ✅ Interlocutor modifié ! ✅
            </p>
          </Modal>
          <Modal
            onCancel={() => handleCloseModal()}
            open={modalModifierFailed}
            footer={null}
          >
            <p style={{ fontSize: 18, textAlign: "center" }}>
              ❌ Interlocutor non modifié ! ❌
            </p>
          </Modal>
        </div>
      </div>
    </>
  );
}

export default Contrat;
