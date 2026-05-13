import React, { useState, useEffect } from "react";

// ─────────────────────────────────────────────────────────────
// 0. TOKENS DE DISEÑO
// ─────────────────────────────────────────────────────────────
export const T = {
  red:       "#8B0000",
  redBtn:    "#A00000",
  redHover:  "#6a0000",
  redLight:  "#fff5f5",
  redBorder: "rgba(139,0,0,.3)",
  grayHdr:   "#3a3a3a",
  grayLight: "#f4f4f4",
  grayBorder:"#e0e0e0",
  sidebarW:  220,
  font:      "'Lato', sans-serif",
};

// Badge helpers
export const BADGE = {
  confirmed:  { label: "Confirmada",             cls: { bg:"#e6f4ea", color:"#2e7d32" } },
  inconclusa: { label: "Inconclusa",             cls: { bg:"#fff3e0", color:"#c56000" } },
  pending:    { label: "Pendiente por Revisión", cls: { bg:"#f0f0f0", color:"#666"    } },
  rechazada:  { label: "Rechazada",              cls: { bg:"#fce8e8", color:"#8B0000" } },
};

export const STATUS_OPTIONS = [
  { value:"confirmed",  label:"Confirmada"            },
  { value:"pending",    label:"Pendiente por Revisión"},
  { value:"inconclusa", label:"Inconclusa"            },
  { value:"rechazada",  label:"Rechazada"             },
];


// ─────────────────────────────────────────────────────────────
// COMPONENTES UI REUTILIZABLES
// ─────────────────────────────────────────────────────────────

/** Badge de estatus */
export function StatusBadge({ status }) {
  const b = BADGE[status] || BADGE.pending;
  return (
    <span style={{
      display:"inline-block", fontSize:11, fontWeight:700,
      padding:"2px 9px", borderRadius:999,
      background:b.cls.bg, color:b.cls.color,
    }}>{b.label}</span>
  );
}

/** Botón pill contorno */
export function BtnOutline({ children, onClick, style }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? "#fff" : "transparent",
        border: "2px solid #fff", color: hover ? T.grayHdr : "#fff",
        borderRadius:999, padding:"5px 18px",
        fontFamily:T.font, fontWeight:700, fontSize:12,
        cursor:"pointer", transition:"all .2s", ...style,
      }}
    >{children}</button>
  );
}

/** Botón primario rojo */
export function BtnPrimary({ children, onClick, style }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? T.redHover : T.redBtn,
        border: `2px solid ${hover ? T.redHover : T.redBtn}`,
        color:"#fff", borderRadius:999, padding:"8px 26px",
        fontFamily:T.font, fontWeight:700, fontSize:13,
        cursor:"pointer", transition:"all .2s", ...style,
      }}
    >{children}</button>
  );
}

/** Botón secundario */
export function BtnSecondary({ children, onClick, style }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background:"#fff", border:`2px solid ${hover ? "#aaa" : "#ddd"}`,
        color: hover ? "#333" : "#777",
        borderRadius:999, padding:"8px 22px",
        fontFamily:T.font, fontWeight:700, fontSize:13,
        cursor:"pointer", transition:"all .2s", ...style,
      }}
    >{children}</button>
  );
}

/** Botón link rojo */
export function BtnLink({ children, onClick, disabled }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => !disabled && setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background:"none", border:"none",
        color: disabled ? "#ccc" : (hover ? T.redHover : T.red),
        fontFamily:T.font, fontSize:12, fontWeight:700,
        textDecoration: disabled ? "none" : "underline",
        cursor: disabled ? "default" : "pointer", padding:0,
        pointerEvents: disabled ? "none" : "auto",
      }}
    >{children}</button>
  );
}

/** Botón icono */
export function BtnIcon({ children, onClick, danger, disabled, title }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      title={title}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => !disabled && setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? (danger ? "#fff0f0" : T.redLight) : "none",
        border:"none", cursor: disabled ? "default" : "pointer",
        color: disabled ? "#e8e8e8" : (hover ? (danger ? "#cc0000" : T.red) : "#ccc"),
        fontSize:16, padding:"3px 5px", borderRadius:4,
        transition:"all .2s", lineHeight:1,
        pointerEvents: disabled ? "none" : "auto",
      }}
    >{children}</button>
  );
}

/** Campo de formulario */
export function FormField({ label, children }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:5, marginBottom:14 }}>
      <label style={{ fontSize:11, fontWeight:700, color:"#666", textTransform:"uppercase", letterSpacing:.4 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

/** Input base */
export function Input({ placeholder, type = "text", value, onChange }) {
  const [focus, setFocus] = useState(false);
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      style={{
        background: focus ? "#fff" : "#f4f4f4",
        border: `1px solid ${focus ? T.red : "#e2e2e2"}`,
        borderRadius:4, padding:"9px 11px",
        fontFamily:T.font, fontSize:13, outline:"none",
        transition:"all .2s", width:"100%",
      }}
    />
  );
}

/** Select base */
export function Select({ value, onChange, children }) {
  const [focus, setFocus] = useState(false);
  return (
    <select
      value={value}
      onChange={onChange}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      style={{
        background: focus ? "#fff" : "#f4f4f4",
        border: `1px solid ${focus ? T.red : "#e2e2e2"}`,
        borderRadius:4, padding:"9px 11px",
        fontFamily:T.font, fontSize:13, outline:"none",
        cursor:"pointer", transition:"all .2s", width:"100%",
      }}
    >{children}</select>
  );
}

/** Botón subir archivo */
export function BtnUpload({ label = "📎 Subir Archivo" }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? "#ebebeb" : "#f4f4f4",
        border: `1px solid ${hover ? "#bbb" : "#ddd"}`,
        borderRadius:4, padding:"8px 14px",
        fontFamily:T.font, fontSize:12, fontWeight:700,
        cursor:"pointer", color:"#555", transition:"all .15s",
        whiteSpace:"nowrap",
      }}
    >{label}</button>
  );
}

/** Separador de sección en formulario */
export function SectionDivider({ label }) {
  return (
    <div style={{
      display:"flex", alignItems:"center", gap:10,
      fontSize:10, fontWeight:700, textTransform:"uppercase",
      letterSpacing:1.2, color:"#bbb", margin:"20px 0 14px",
    }}>
      {label}
      <span style={{ flex:1, height:1, background:"#eee" }} />
    </div>
  );
}

/** Modal base */
export function Modal({ open, onClose, children, maxWidth = 560 }) {
  useEffect(() => {
    const handle = (e) => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position:"fixed", inset:0, background:"rgba(0,0,0,.44)",
        zIndex:300, display:"flex", alignItems:"center", justifyContent:"center",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background:"#fff", borderRadius:8, padding:"28px 32px",
          maxWidth, width:"95%", boxShadow:"0 14px 52px rgba(0,0,0,.18)",
          animation:"mIn .18s ease", maxHeight:"90vh", overflowY:"auto",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/** Header de modal */
export function ModalHeader({ title, subtitle, onClose }) {
  return (
    <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:18, paddingBottom:14, borderBottom:"1px solid #f0f0f0" }}>
      <div>
        <h3 style={{ fontSize:17, fontWeight:700, color:"#222" }}>{title}</h3>
        {subtitle && <p style={{ fontSize:12, color:"#aaa", marginTop:2 }}>{subtitle}</p>}
      </div>
      <BtnIcon onClick={onClose} title="Cerrar">✕</BtnIcon>
    </div>
  );
}

/** Notice de solo lectura */
export function ReadonlyNotice({ text = "Modo solo lectura — Coordinador" }) {
  return (
    <div style={{
      display:"flex", alignItems:"center", gap:8,
      background:"#e8f0fe", border:"1px solid #c5d8fc",
      borderRadius:6, padding:"10px 14px", marginBottom:16,
      fontSize:12, color:"#1a56db", fontWeight:700,
    }}>ℹ️ &nbsp;{text}</div>
  );
}

/** Toggle switch */
export function ToggleSwitch({ checked, onChange }) {
  return (
    <div
      onClick={() => onChange(!checked)}
      style={{
        width:38, height:20, background: checked ? T.red : "#ccc",
        borderRadius:999, position:"relative", cursor:"pointer",
        transition:"background .2s", flexShrink:0,
      }}
    >
      <div style={{
        position:"absolute", width:14, height:14, background:"#fff",
        borderRadius:"50%", top:3,
        left: checked ? 21 : 3,
        transition:"left .2s",
      }} />
    </div>
  );
}

/** Header de sección adaptado al nuevo layout (sin botón de salir, eso ya lo tiene el navbar) */
export function SectionHeader({ title, role }) {
  return (
    <div style={{
      background:T.grayHdr, color:"#fff",
      padding:"0 28px", height:50,
      display:"flex", alignItems:"center", justifyContent:"space-between",
      position:"sticky", top:0, zIndex:10,
    }}>
      <h1 style={{ fontSize:17, fontWeight:700, letterSpacing:.2 }}>{title}</h1>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        {role && (
          <span style={{
            fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:999,
            textTransform:"uppercase", letterSpacing:.5,
            background: role==="admin" ? "rgba(255,100,100,.25)" : "rgba(100,160,255,.25)",
            color: role==="admin" ? "#ffb3b3" : "#add8ff",
          }}>{role === "admin" ? "Administrador" : "Coordinador"}</span>
        )}
      </div>
    </div>
  );
}

/** Breadcrumb */
export function Breadcrumb({ items }) {
  return (
    <div style={{ fontSize:12, color:"#aaa", marginBottom:18 }}>
      {items.map((item, i) => (
        <span key={i}>
          {i > 0 && " / "}
          {i === items.length - 1
            ? <span style={{ color:"#555", fontWeight:700 }}>{item}</span>
            : item}
        </span>
      ))}
    </div>
  );
}
