import ExcelJS from 'exceljs';
import { RegistroCobranza, Totales, Instancia, DatosGenerales } from '../types';
import { formatARNumber, formatDNI } from '../utils';

const TITLE = 'PLANILLA RENDICION DE CUENTA - CASTILLO S.A.C.I.F.I.A.';
const ESTUDIO = 'ESTUDIO JURIDICO: DR. JUAN VILLAFAÑE MALET';
const PROVINCIA = 'PROVINCIA: LA RIOJA';

const COLUMNS = [
  'ITEM',
  'FECHA DE COBRO',
  'Nº DE RECIBO',
  'APELLIDO Y NOMBRE',
  'D.N.I.',
  'Nº DE FACTURA',
  'INSTANCIA',
  'COBRADO P/ CASTILLO',
  '%HONOR.',
  'HONORARIOS',
  'TOTAL COBRADO',
  'CUOTAS A PAGAR',
  'AUTORIZACION ESPECIAL / OBSERVACION',
] as const;

const COL_COUNT = COLUMNS.length;
const MONEY_COLS = new Set([8, 10, 11]);

const COLORS = {
  headerBlue: 'FFB4C7E7',
  white: 'FFFFFFFF',
  black: 'FF000000',
};

const FONT = 'Calibri';

const thinBorder: Partial<ExcelJS.Borders> = {
  top: { style: 'thin', color: { argb: COLORS.black } },
  left: { style: 'thin', color: { argb: COLORS.black } },
  bottom: { style: 'thin', color: { argb: COLORS.black } },
  right: { style: 'thin', color: { argb: COLORS.black } },
};

const solidFill = (argb: string): ExcelJS.Fill => ({
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb },
  bgColor: { argb },
});

const fontStyle = (bold: boolean): Partial<ExcelJS.Font> => ({
  name: FONT,
  size: 10,
  bold,
  color: { argb: COLORS.black },
});

const formatFechaExport = (iso: string): string => {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
};

const formatFechaRendicion = (iso: string): string => {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}/${d.getFullYear()}`;
};

const formatInstanciaExport = (instancia: Instancia): string => {
  if (instancia === '1° Instancia') return 'PRIMERA';
  if (instancia === '2° Instancia') return 'SEGUNDA';
  if (instancia === 'Residuales') return 'RESIDUALES';
  return String(instancia).toUpperCase();
};

const formatCurrencyExport = (value: number): string => `$${formatARNumber(value, 2)}`;

const formatPctExport = (value: number): string => {
  const n = Number.isInteger(value) ? String(value) : formatARNumber(value, 2);
  return `${n}%`;
};

const applyCellStyle = (
  cell: ExcelJS.Cell,
  opts: {
    bold?: boolean;
    fill?: string;
    align?: 'left' | 'center' | 'right';
    border?: boolean;
    fontSize?: number;
  }
) => {
  cell.font = {
    ...fontStyle(opts.bold ?? false),
    size: opts.fontSize ?? 10,
  };
  if (opts.fill) cell.fill = solidFill(opts.fill);
  else cell.fill = solidFill(COLORS.white);
  cell.alignment = {
    vertical: 'middle',
    horizontal: opts.align ?? 'left',
    wrapText: true,
  };
  if (opts.border !== false) cell.border = thinBorder as ExcelJS.Borders;
};

const filtroLabel = (filtro: DatosGenerales['instanciaFiltro']): string => {
  if (filtro === 'Residuales') return 'residuales';
  return 'instancias';
};

export async function exportPlanillaExcel(
  registros: RegistroCobranza[],
  totales: Totales,
  nroPlanilla: string,
  fechaRendicion: string,
  instanciaFiltro: DatosGenerales['instanciaFiltro']
): Promise<void> {
  const ordenados = [...registros].sort((a, b) => {
    const order = (i: Instancia) =>
      i === '1° Instancia' ? 0 : i === '2° Instancia' ? 1 : 2;
    const diff = order(a.instancia) - order(b.instancia);
    if (diff !== 0) return diff;
    return (a.fechaCobro || '').localeCompare(b.fechaCobro || '');
  });

  const wb = new ExcelJS.Workbook();
  const sheetName = instanciaFiltro === 'Residuales' ? 'Residuales' : 'Instancias';
  const ws = wb.addWorksheet(sheetName, {
    views: [{ showGridLines: true }],
    pageSetup: { orientation: 'landscape', fitToPage: true, fitToWidth: 1 },
  });

  [6, 14, 12, 30, 14, 14, 12, 18, 10, 14, 16, 16, 38].forEach((w, i) => {
    ws.getColumn(i + 1).width = w;
  });

  // Fila 1 — Título
  ws.mergeCells(1, 1, 1, COL_COUNT);
  const titleCell = ws.getCell(1, 1);
  titleCell.value = TITLE;
  applyCellStyle(titleCell, { bold: true, align: 'center', border: false, fontSize: 14 });
  ws.getRow(1).height = 28;

  ws.getRow(2).height = 6;
  ws.getRow(3).height = 6;

  // Fila 4 — Estudio / provincia / fecha
  ws.mergeCells(4, 1, 4, COL_COUNT);
  const metaCell = ws.getCell(4, 1);
  metaCell.value = `${ESTUDIO}   ${PROVINCIA}   FECHA: ${formatFechaRendicion(fechaRendicion)}${
    nroPlanilla ? `   PLANILLA N°: ${nroPlanilla}` : ''
  }`;
  applyCellStyle(metaCell, { bold: true, border: false });
  ws.getRow(4).height = 22;

  // Fila 5 — Encabezados de columna (celeste + negrita)
  const headerRow = ws.getRow(5);
  headerRow.height = 26;
  for (let col = 1; col <= COL_COUNT; col++) {
    const cell = headerRow.getCell(col);
    cell.value = COLUMNS[col - 1];
    applyCellStyle(cell, {
      bold: true,
      fill: COLORS.headerBlue,
      align: 'center',
    });
  }

  // Filas de datos
  let rowNum = 6;
  ordenados.forEach((r, i) => {
    const row = ws.getRow(rowNum);
    row.height = 18;

    const values: (string | number)[] = [
      i + 1,
      formatFechaExport(r.fechaCobro),
      r.nroRecibo,
      (r.nombreApellido || '').toUpperCase(),
      formatDNI(r.dni ?? ''),
      (r.nroFactura || 'TODAS').toUpperCase(),
      formatInstanciaExport(r.instancia),
      formatCurrencyExport(r.cobradoCastillo),
      formatPctExport(r.honorariosPct),
      formatCurrencyExport(r.honorarios),
      formatCurrencyExport(r.totalCobrado),
      (r.cuotasPagar || '').toUpperCase(),
      (r.observacion || '').toUpperCase(),
    ];

    values.forEach((val, idx) => {
      const col = idx + 1;
      const cell = row.getCell(col);
      cell.value = val;
      const isMoney = MONEY_COLS.has(col);
      const align =
        isMoney || col === 9 ? 'right' : col === 1 || col === 7 ? 'center' : 'left';
      applyCellStyle(cell, { bold: isMoney, align });
    });

    rowNum++;
  });

  // Totales
  rowNum += 1;
  const totalCastilloRow = ws.getRow(rowNum);
  totalCastilloRow.height = 20;
  applyCellStyle(totalCastilloRow.getCell(7), { bold: true, align: 'right', border: false });
  totalCastilloRow.getCell(7).value = 'TOTAL CASTILLO:';
  applyCellStyle(totalCastilloRow.getCell(8), { bold: true, align: 'right', border: false });
  totalCastilloRow.getCell(8).value = formatCurrencyExport(totales.totalCastillo);

  rowNum++;
  const totalHonorRow = ws.getRow(rowNum);
  totalHonorRow.height = 20;
  applyCellStyle(totalHonorRow.getCell(7), { bold: true, align: 'right', border: false });
  totalHonorRow.getCell(7).value = 'TOTAL HONORARIO:';
  applyCellStyle(totalHonorRow.getCell(8), { bold: true, align: 'right', border: false });
  totalHonorRow.getCell(8).value = formatCurrencyExport(totales.totalHonorarios);

  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `planilla_rendicion_${filtroLabel(instanciaFiltro)}_${fechaRendicion || 'sin_fecha'}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
}
