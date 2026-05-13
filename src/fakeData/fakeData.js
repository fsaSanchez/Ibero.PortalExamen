// src/fakeData/mockConveniosYContratos.js

export const mockConveniosYContratos = [
  {
    id: 'conv001',
    fecha: '2019-12-05',
    documento: 'Convenio de colaboración',
    juegos: '3 juegos',
    contraparte: 'Instituto de Investigaciones Jurídicas de la UNAM',
    canal: 'DICA',
    areaResponsable: 'Arquitectura, Urbanismo e Ingeniería Civil',
    voBoAreaResponsable: true,
    voBoJuridico: true,
    folioDeJuridico: '123456789',
    voBoDivisional: true,
    voBoFinanzas: true,
    objetivo: 'Sumar esfuerzos para promote el desarrollo...',
    fechaDelDocumento: '2019-11-08',
    escaneo: { name: 'Convenio UNAM.pdf', size: 800000 },
    entregado: 'Se regresó personalmente el 05-12-2019',
  },
  {
    id: 'conv002',
    fecha: '2023-08-20',
    documento: 'Contrato de servicio de consultoría',
    juegos: '2 juegos',
    contraparte: 'Empresa InnovaTech S.A. de C.V.',
    canal: 'Secretaría General',
    areaResponsable: 'Estudios Empresariales',
    voBoAreaResponsable: true,
    voBoJuridico: false,
    folioDeJuridico: '987654321',
    voBoDivisional: false,
    voBoFinanzas: true,
    objetivo: 'Desarrollo de un sistema de gestión...',
    fechaDelDocumento: '2023-08-15',
    escaneo: { name: 'Contrato_InnovaTech.pdf', size: 1200000 },
    entregado: 'Contrato enviado por mensajería el 21-08-2023',
  }
];

