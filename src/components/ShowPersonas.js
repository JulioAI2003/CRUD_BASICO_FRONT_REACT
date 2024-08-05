import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { show_alerta } from "../functions";

const ShowPersonas = () => {
  var url = "http://localhost:4000/personas";
  var [personas, SetPersonas] = useState([]);
  const [id, SetId] = useState("");
  const [nombre, SetNombre] = useState("");
  const [edad, SetEdad] = useState("");
  const [titulo, SetTitulo] = useState("");
  const [operation, SetOperation] = useState(1);

  useEffect(() => {
    getPersonas();
  }, []);

  const getPersonas = async () => {
    const respuesta = await axios.get(url);
    SetPersonas(respuesta.data);
  };
  const openModal = (op, id, nombre, edad) => {
    SetId("");
    SetNombre("");
    SetEdad("");
    SetOperation(op);
    if (op === 1) {
      SetTitulo("Registrar Persona");
    } else if (op === 2) {
      SetTitulo("Actualizar Persona");
      SetId(id);
      SetNombre(nombre);
      SetEdad(edad);
    }
    window.setTimeout(function () {
      document.getElementById("nombre").focus();
    }, 500);
  };
  const validar = () => {
    var parametros;
    var metodo;
    if (nombre.trim() === "") {
      show_alerta("Escribe el nombre de la persona", "warning");
    } else if (edad === "") {
      show_alerta("Escribe la edad de la persona", "warning");
    } else {
      if (operation === 1) {
        parametros = { nombre: nombre.trim(), edad: edad };
        metodo = "POST";
      } else {
        parametros = { id:id,nombre: nombre.trim(), edad: edad };
        metodo = "PUT";
        // url += `/${id}`;
      }
      enviarSolicitud(metodo, parametros);
    }
  };
  const enviarSolicitud = async (metodo, parametros) => {
    await axios({ method: metodo, url: url, data: parametros })
      .then(function (respuesta) {
        var tipo = respuesta.data;
        var msj = respuesta.data;
        show_alerta(msj, "success");
        // if (tipo ==='success') {
        document.getElementById("btnCerrar").click();
        getPersonas();
        // }
      })
      .catch(function (error) {
        show_alerta("Error en la solicitud", "error");
        console.log("error");
      });
  };
  const deletePersona = (id, nombre) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: "¿Seguro de eliminar la persona " + nombre + " ?",
      icon: "question",
      text: "Se perdera para siempre",
      showCancelButton: true,
      confirmButtonText: "Si,Eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        SetId(id);
        // url += `/${id}`; //adecua la ruta al back
        enviarSolicitud("DELETE", { id: id });
      } else show_alerta("La persona NO fue elmiminada", "info");
    });
  };

  return (
    <div className="App">
      <div className="container-fluid">
        <div className="row mt-3">
          <div className="col md-4 offset-md-4">
            <div className="d-grid mx-auto">
              <button
                onClick={() => openModal(1)}
                className="btn btn-dark"
                data-bs-toggle="modal"
                data-bs-target="#modalPersonas"
              >
                <i className="fa-solid fa-circle-plus"></i>Añadir
              </button>
            </div>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-12col-lg-8 offset-0 offset-log-2">
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Personas</th>
                    <th>edad</th>
                  </tr>
                </thead>
                <tbody className="table-group-divider">
                  {Array.isArray(personas) && personas.map((persona, i) => (
                    <tr key={persona.id}>
                      <td>{i + 1}</td>
                      <td>{persona.nombre}</td>
                      <td>{persona.edad}</td>
                      <td>
                        <button
                          onClick={() =>
                            openModal(
                              2,
                              persona.id,
                              persona.nombre,
                              persona.edad
                            )
                          }
                          className="btn btn-warning"
                          data-bs-toggle="modal"
                          data-bs-target="#modalPersonas"
                        >
                          <i className="fa-solid fa-edit"></i>
                        </button>
                        &nbsp;
                        <button
                          onClick={() =>
                            deletePersona(persona.id, persona.nombre)
                          }
                          className="btn btn-danger"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div id="modalPersonas" className="modal fade" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <label className="h5">{titulo}</label>
              <button
                type="button"
                className="btn-close"
                data-bs-ddismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <input type="hidden" id="id"></input>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="fa-solid fa-gift"></i>
                </span>
                <input
                  type="text"
                  id="nombre"
                  className="form-control"
                  placeholder="Nombre"
                  value={nombre}
                  onChange={(e) => SetNombre(e.target.value)}
                ></input>
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="fa-solid fa-gift"></i>
                </span>
                <input
                  type="text"
                  id="edad"
                  className="form-control"
                  placeholder="Edad"
                  value={edad}
                  onChange={(e) => SetEdad(e.target.value)}
                ></input>
              </div>
              <div className="d-grid col-6 mx-auto">
                <button onClick={() => validar()} className="btn btn-success">
                  <i className="fa-solid fa floppy-disk"></i>Guardar
                </button>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                id="btnCerrar"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowPersonas;
