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

/** Blanco y negro para impresión; celeste solo en encabezados de columna */
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

const applyBorder = (cell: ExcelJS.Cell) => {
  cell.border = thinBorder as ExcelJS.Borders;
};

const filtroLabel = (filtro: DatosGenerales['instanciaFiltro']): string => {
  if (filtro === 'Residuales') return 'residuales';
  return 'instancias';
};

const styleTitleRow = (ws: ExcelJS.Worksheet) => {
  const row = ws.getRow(1);
  ws.mergeCells(1, 1, 1, COL_COUNT);
  const cell = row.getCell(1);
  cell.value = TITLE;
  cell.font = { name: FONT, size: 14, bold: true, color: { argb: COLORS.black } };
  cell.fill = solidFill(COLORS.white);
  cell.alignment = { vertical: 'middle', horizontal: 'center' };
  row.height = 28;
};

const styleMetaRow = (ws: ExcelJS.Worksheet, text: string) => {
  const row = ws.getRow(4);
  ws.mergeCells(4, 1, 4, COL_COUNT);
  const cell = row.getCell(1);
  cell.value = text;
  cell.font = { name: FONT, size: 10, bold: true, color: { argb: COLORS.black } };
  cell.fill = solidFill(COLORS.white);
  cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
  row.height = 22;
};

const styleHeaderRow = (row: ExcelJS.Row) => {
  row.height = 24;
  row.eachCell({ includeEmpty: true }, (cell, col) => {
    if (col <= COL_COUNT) {
      cell.value = COLUMNS[col - 1];
      cell.font = { name: FONT, size: 10, bold: true, color: { argb: COLORS.black } };
      cell.fill = solidFill(COLORS.headerBlue);
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      applyBorder(cell);
    }
  });
};

const styleDataRow = (row: ExcelJS.Row) => {
  row.height = 18;
  row.eachCell({ includeEmpty: true }, (cell, col) => {
    if (col <= COL_COUNT) {
      const isMoney = col >= 8 && col <= 11;
      const isCenter = col === 1 || col === 7;
      cell.font = { name: FONT, size: 10, bold: false, color: { argb: COLORS.black } };
      cell.fill = solidFill(COLORS.white);
      cell.alignment = {
        vertical: 'middle',
        horizontal: isMoney ? 'right' : isCenter ? 'center' : 'left',
        wrapText: col === 13,
      };
      applyBorder(cell);
    }
  });
};

const styleTotalRow = (row: ExcelJS.Row, label: string, value: string) => {
  const labelCol = 7;
  const valueCol = 8;
  row.height = 20;

  const labelCell = row.getCell(labelCol);
  labelCell.value = label;
  labelCell.font = { name: FONT, size: 11, bold: true, color: { argb: COLORS.black } };
  labelCell.fill = solidFill(COLORS.white);
  labelCell.alignment = { vertical: 'middle', horizontal: 'right' };

  const valueCell = row.getCell(valueCol);
  valueCell.value = value;
  valueCell.font = { name: FONT, size: 11, bold: true, color: { argb: COLORS.black } };
  valueCell.fill = solidFill(COLORS.white);
  valueCell.alignment = { vertical: 'middle', horizontal: 'right' };
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
  wb.creator = 'Castillo Planillas';
  const sheetName = instanciaFiltro === 'Residuales' ? 'Residuales' : 'Instancias';
  const ws = wb.addWorksheet(sheetName, {
    views: [{ showGridLines: true }],
    pageSetup: {
      orientation: 'landscape',
      fitToPage: true,
      fitToWidth: 1,
    },
  });

  ws.columns = [
    { width: 6 },
    { width: 14 },
    { width: 12 },
    { width: 30 },
    { width: 14 },
    { width: 14 },
    { width: 12 },
    { width: 18 },
    { width: 10 },
    { width: 14 },
    { width: 16 },
    { width: 16 },
    { width: 38 },
  ];

  styleTitleRow(ws);
  ws.getRow(2).height = 4;
  ws.getRow(3).height = 4;

  const metaText = `${ESTUDIO}   ${PROVINCIA}   FECHA: ${formatFechaRendicion(fechaRendicion)}${
    nroPlanilla ? `   PLANILLA N°: ${nroPlanilla}` : ''
  }`;
  styleMetaRow(ws, metaText);

  const headerRowNum = 5;
  styleHeaderRow(ws.getRow(headerRowNum));

  let rowNum = headerRowNum + 1;
  ordenados.forEach((r, i) => {
    const row = ws.getRow(rowNum);
    row.getCell(1).value = i + 1;
    row.getCell(2).value = formatFechaExport(r.fechaCobro);
    row.getCell(3).value = r.nroRecibo;
    row.getCell(4).value = (r.nombreApellido || '').toUpperCase();
    row.getCell(5).value = formatDNI(r.dni ?? '');
    row.getCell(6).value = (r.nroFactura || 'TODAS').toUpperCase();
    row.getCell(7).value = formatInstanciaExport(r.instancia);
    row.getCell(8).value = formatCurrencyExport(r.cobradoCastillo);
    row.getCell(9).value = formatPctExport(r.honorariosPct);
    row.getCell(10).value = formatCurrencyExport(r.honorarios);
    row.getCell(11).value = formatCurrencyExport(r.totalCobrado);
    row.getCell(12).value = (r.cuotasPagar || '').toUpperCase();
    row.getCell(13).value = (r.observacion || '').toUpperCase();
    styleDataRow(row);
    rowNum++;
  });

  rowNum += 1;
  styleTotalRow(ws.getRow(rowNum), 'TOTAL CASTILLO:', formatCurrencyExport(totales.totalCastillo));
  rowNum++;
  styleTotalRow(ws.getRow(rowNum), 'TOTAL HONORARIO:', formatCurrencyExport(totales.totalHonorarios));

  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const fecha = fechaRendicion || 'sin_fecha';
  a.download = `planilla_rendicion_${filtroLabel(instanciaFiltro)}_${fecha}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
}
