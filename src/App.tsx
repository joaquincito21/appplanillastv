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
    <div className="min-h-screen">
      <Header
        nroPlanilla={datos.nroPlanilla}
        fechaRendicion={datos.fechaRendicion}
        onChange={(f, v) => setDatos(f, v)}
      />

      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <InstanciaSelector
            active={datos.instanciaFiltro}
            onChange={v => setDatos('instanciaFiltro', v)}
          />
          <div className="flex flex-wrap gap-2">
            <ExportButton
              registros={registros}
              nroPlanilla={datos.nroPlanilla}
              fechaRendicion={datos.fechaRendicion}
              instanciaFiltro={datos.instanciaFiltro}
            />
            <button onClick={() => setModal({ open: true })} className="btn-primary">
              <Plus className="w-4 h-4" />
              Agregar registro
            </button>
          </div>
        </div>

        <TotalesBar totales={totales} count={filtrados.length} />

        <TablaCobranzas
          registros={filtrados}
          onEdit={r => setModal({ open: true, registro: r })}
          onDelete={id => setDeleteConfirm(id)}
        />
      </main>

      {modal.open && (
        <ModalRegistro
          initial={modal.registro}
          instanciaFiltro={datos.instanciaFiltro}
          onSave={handleSave}
          onClose={() => setModal({ open: false })}
        />
      )}

      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div
            className="modal-panel max-w-md"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6">
              <h3 className="text-white font-semibold text-lg mb-2">Eliminar registro</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Esta acción es irreversible. ¿Confirmás la eliminación?
              </p>
            </div>
            <div className="modal-footer">
              <button onClick={() => setDeleteConfirm(null)} className="btn-secondary">
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-5 py-2.5 rounded-lg bg-red-600/90 text-white font-semibold text-sm
                  hover:bg-red-500 transition-all"
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
