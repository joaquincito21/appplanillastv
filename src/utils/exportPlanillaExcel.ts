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
const HEADER_FILL: ExcelJS.Fill = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'FFB4C7E7' },
};

const thinBorder: Partial<ExcelJS.Borders> = {
  top: { style: 'thin', color: { argb: 'FF000000' } },
  left: { style: 'thin', color: { argb: 'FF000000' } },
  bottom: { style: 'thin', color: { argb: 'FF000000' } },
  right: { style: 'thin', color: { argb: 'FF000000' } },
};

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

const styleHeaderRow = (row: ExcelJS.Row) => {
  row.height = 22;
  row.eachCell({ includeEmpty: true }, (cell, col) => {
    if (col <= COL_COUNT) {
      cell.value = COLUMNS[col - 1];
      cell.font = { bold: true, size: 10, name: 'Arial' };
      cell.fill = HEADER_FILL;
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      applyBorder(cell);
    }
  });
};

const styleDataRow = (row: ExcelJS.Row) => {
  row.eachCell({ includeEmpty: true }, (cell, col) => {
    if (col <= COL_COUNT) {
      cell.font = { size: 10, name: 'Arial' };
      cell.alignment = {
        vertical: 'middle',
        horizontal: col >= 8 && col <= 11 ? 'right' : 'left',
        wrapText: col === 13,
      };
      applyBorder(cell);
    }
  });
};

const filtroLabel = (filtro: DatosGenerales['instanciaFiltro']): string => {
  if (filtro === 'todas') return 'todas';
  if (filtro === 'Residuales') return 'residuales';
  if (filtro === '1° Instancia') return '1_instancia';
  return '2_instancia';
};

export async function exportPlanillaExcel(
  registros: RegistroCobranza[],
  totales: Totales,
  nroPlanilla: string,
  fechaRendicion: string,
  instanciaFiltro: DatosGenerales['instanciaFiltro']
): Promise<void> {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Castillo Planillas';
  const ws = wb.addWorksheet('Planilla', {
    views: [{ showGridLines: true }],
    pageSetup: { orientation: 'landscape', fitToPage: true, fitToWidth: 1 },
  });

  ws.columns = [
    { width: 6 },
    { width: 14 },
    { width: 12 },
    { width: 28 },
    { width: 14 },
    { width: 14 },
    { width: 12 },
    { width: 18 },
    { width: 10 },
    { width: 14 },
    { width: 16 },
    { width: 16 },
    { width: 36 },
  ];

  const titleRow = ws.getRow(1);
  ws.mergeCells(1, 1, 1, COL_COUNT);
  const titleCell = titleRow.getCell(1);
  titleCell.value = TITLE;
  titleCell.font = { bold: true, size: 12, name: 'Arial' };
  titleCell.alignment = { vertical: 'middle', horizontal: 'left' };
  titleRow.height = 24;

  ws.getRow(2).height = 6;
  ws.getRow(3).height = 6;

  const metaRow = ws.getRow(4);
  ws.mergeCells(4, 1, 4, COL_COUNT);
  const metaCell = metaRow.getCell(1);
  metaCell.value = `${ESTUDIO}   ${PROVINCIA}   FECHA: ${formatFechaRendicion(fechaRendicion)}${
    nroPlanilla ? `   PLANILLA N°: ${nroPlanilla}` : ''
  }`;
  metaCell.font = { bold: true, size: 10, name: 'Arial' };
  metaCell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
  metaRow.height = 20;

  const headerRowNum = 5;
  styleHeaderRow(ws.getRow(headerRowNum));

  let rowNum = headerRowNum + 1;
  registros.forEach((r, i) => {
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
  const totalCastilloRow = ws.getRow(rowNum);
  const labelCol = 7;
  const valueCol = 8;
  totalCastilloRow.getCell(labelCol).value = 'TOTAL CASTILLO:';
  totalCastilloRow.getCell(labelCol).font = { bold: true, size: 10, name: 'Arial' };
  totalCastilloRow.getCell(valueCol).value = formatCurrencyExport(totales.totalCastillo);
  totalCastilloRow.getCell(valueCol).font = { bold: true, size: 10, name: 'Arial' };
  totalCastilloRow.getCell(valueCol).alignment = { horizontal: 'right' };

  rowNum++;
  const totalHonorRow = ws.getRow(rowNum);
  totalHonorRow.getCell(labelCol).value = 'TOTAL HONORARIO:';
  totalHonorRow.getCell(labelCol).font = { bold: true, size: 10, name: 'Arial' };
  totalHonorRow.getCell(valueCol).value = formatCurrencyExport(totales.totalHonorarios);
  totalHonorRow.getCell(valueCol).font = { bold: true, size: 10, name: 'Arial' };
  totalHonorRow.getCell(valueCol).alignment = { horizontal: 'right' };

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
