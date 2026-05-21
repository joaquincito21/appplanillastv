export type Instancia = '1° Instancia' | '2° Instancia' | 'Residuales';

export interface RegistroCobranza {
  id: string;
  fechaCobro: string;
  nroRecibo: string;
  nombreApellido: string;
  dni: string;
  nroFactura: string;
  instancia: Instancia;
  cobradoCastillo: number;
  honorariosPct: number;
  honorarios: number;
  totalCobrado: number;
  cuotasPagar: string;
  observacion: string;
}

export interface DatosGenerales {
  fechaRendicion: string;
  nroPlanilla: string;
  instanciaFiltro: Instancia | 'todas' | 'Residuales';
}

export interface Totales {
  totalCastillo: number;
  totalHonorarios: number;
  totalCobrado: number;
}
