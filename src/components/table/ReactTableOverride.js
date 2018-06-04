import { ReactTableDefaults } from 'react-table';

const reactTableOverride = () => {
  Object.assign(ReactTableDefaults, {
    defaultPageSize: 10,
    minRows: 10,
    previousText: 'Anterior',
    nextText: 'Siguiente',
    loadingText: 'Cargando...',
    noDataText: 'No se encontraron datos',
    pageText: 'Página',
    ofText: 'de',
    rowsText: 'filas',
    showPagination: true,
    className: '-stripped -highlight'
  });
};

export default reactTableOverride;

