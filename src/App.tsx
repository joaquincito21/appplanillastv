import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { RegistroCobranza, DatosGenerales } from './types';
import { calcTotales, saveToStorage, loadFromStorage } from './utils';
import Header from './components/Header';
import InstanciaSelector from './components/InstanciaSelector';
import TablaCobranzas from './components/TablaCobranzas';
import TotalesBar from './components/TotalesBar';
import ModalRegistro from './components/ModalRegistro';
import ExportButton from './components/ExportButton';

interface AppState {
  registros: RegistroCobranza[];
  datos: DatosGenerales;
}

const defaultDatos = (): DatosGenerales => ({
  fechaRendicion: new Date().toISOString().split('T')[0],
  nroPlanilla: '',
  instanciaFiltro: 'todas',
});

export default function App() {
  const [state, setState] = useState<AppState>(() =>
    loadFromStorage({ registros: [], datos: defaultDatos() })
  );
  const [modal, setModal] = useState<{ open: boolean; registro?: RegistroCobranza }>({ open: false });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    saveToStorage(state);
  }, [state]);

  const { registros, datos } = state;

  const filtrados =
    datos.instanciaFiltro === 'todas'
      ? registros
      : registros.filter(r => r.instancia === datos.instanciaFiltro);

  const totales = calcTotales(filtrados);

  const setDatos = (field: keyof DatosGenerales, value: string) =>
    setState(s => ({ ...s, datos: { ...s.datos, [field]: value } }));

  const handleSave = (r: RegistroCobranza) => {
    setState(s => {
      const exists = s.registros.find(x => x.id === r.id);
      const registros = exists
        ? s.registros.map(x => (x.id === r.id ? r : x))
        : [...s.registros, r];
      return { ...s, registros };
    });
    setModal({ open: false });
  };

  const handleDelete = (id: string) => {
    setState(s => ({ ...s, registros: s.registros.filter(r => r.id !== id) }));
    setDeleteConfirm(null);
  };

  return (
    <div className="min-h-screen bg-navy-950">
      <Header
        nroPlanilla={datos.nroPlanilla}
        fechaRendicion={datos.fechaRendicion}
        onChange={(f, v) => setDatos(f, v)}
      />

      <main className="max-w-screen-xl mx-auto px-6 py-8 space-y-6">
        {/* Barra de controles */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <InstanciaSelector
            active={datos.instanciaFiltro}
            onChange={v => setDatos('instanciaFiltro', v)}
          />
          <div className="flex flex-wrap gap-3">
            <ExportButton
              registros={filtrados}
              totales={totales}
              nroPlanilla={datos.nroPlanilla}
              fechaRendicion={datos.fechaRendicion}
            />
            <button onClick={() => setModal({ open: true })} className="btn-primary">
              <Plus className="w-4 h-4" />
              Agregar registro
            </button>
          </div>
        </div>

        {/* Totales */}
        <TotalesBar totales={totales} count={filtrados.length} />

        {/* Tabla */}
        <TablaCobranzas
          registros={filtrados}
          onEdit={r => setModal({ open: true, registro: r })}
          onDelete={id => setDeleteConfirm(id)}
        />
      </main>

      {/* Modal de registro */}
      {modal.open && (
        <ModalRegistro
          initial={modal.registro}
          instanciaFiltro={datos.instanciaFiltro}
          onSave={handleSave}
          onClose={() => setModal({ open: false })}
        />
      )}

      {/* Modal de confirmacion de eliminacion */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div
            className="modal-panel max-w-md"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 bg-cream-100">
              <h3 className="text-navy-900 font-bold text-lg mb-2">Eliminar registro</h3>
              <p className="text-navy-600 text-sm leading-relaxed">
                Esta accion es irreversible. Confirmas la eliminacion?
              </p>
            </div>
            <div className="modal-footer">
              <button onClick={() => setDeleteConfirm(null)} className="btn-secondary">
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-5 py-2.5 rounded-lg bg-red-500 text-white font-semibold text-sm
                  hover:bg-red-600 active:scale-[0.98] transition-all"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
