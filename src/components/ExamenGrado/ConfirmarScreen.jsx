import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  SectionHeader, Breadcrumb, BtnSecondary, BtnPrimary, Modal
} from "../../ui/components/ExamenGradoUI";

export default function ConfirmarScreen() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const alumnos = [
    { nombre:"García López María",   cuenta:"2021001234", prog:"Maestría en Administración" },
    { nombre:"Hernández Ruiz Carlos",cuenta:"2021005678", prog:"Maestría en Administración" },
    { nombre:"Torres Vega Ana",      cuenta:"2021009012", prog:"Maestría en Administración" },
  ];
  return (
    <>
      <SectionHeader title="Confirmar Participantes" />
      <div style={{ padding:"22px 28px" }}>
        <Breadcrumb items={["Inicio","Solicitud","Examen General","Confirmar Participantes"]} />
        <div style={{ background:"#fff", border:"1px solid #e4e4e4", borderRadius:4, boxShadow:"0 1px 4px rgba(0,0,0,.05)" }}>
          <div style={{ padding:"22px 24px" }}>
            <div style={{ fontSize:14, fontWeight:700, color:"#333", marginBottom:18, paddingBottom:12, borderBottom:"1px solid #f0f0f0" }}>
              Listado de alumnos registrados
            </div>
            <ul style={{ listStyle:"none" }}>
              {alumnos.map((a,i) => (
                <li key={i} style={{ padding:"12px 0", borderBottom:"1px solid #f0f0f0", fontSize:13, lineHeight:1.7 }}>
                  <strong style={{ fontWeight:700, display:"block", color:"#222" }}>{a.nombre}</strong>
                  Cuenta: {a.cuenta} · {a.prog}
                </li>
              ))}
            </ul>
            <div style={{ display:"flex", justifyContent:"center", gap:12, marginTop:22 }}>
              <BtnSecondary onClick={() => navigate("/dashboard/general")}>✏ Editar lista</BtnSecondary>
              <BtnPrimary onClick={() => setShowModal(true)}>Confirmar y enviar</BtnPrimary>
            </div>
          </div>
        </div>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} maxWidth={400}>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:38, marginBottom:14 }}>📋</div>
          <h3 style={{ fontSize:17, fontWeight:700, marginBottom:12 }}>Nota de revisión</h3>
          <p style={{ fontSize:13, lineHeight:1.7, color:"#555" }}>
            La revisión se realiza en un plazo máximo de <strong>7 días hábiles</strong>.
          </p>
          <div style={{ marginTop:22 }}>
            <BtnPrimary onClick={() => { setShowModal(false); navigate("/dashboard/programacion"); }}>Aceptar</BtnPrimary>
          </div>
        </div>
      </Modal>
    </>
  );
}
