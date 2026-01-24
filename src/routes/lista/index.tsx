import { component$ } from '@builder.io/qwik';
import { routeLoader$, Form, useLocation } from '@builder.io/qwik-city';
import { tursoClient } from '~/utils/turso';

interface Donante {
    id: number;
    nombre: string;
    apellido: string;
    dni: string;
    celular: string;
    es_donante_previo: number;
    created_at: string;
}

export const useDonorsLoader = routeLoader$<Donante[]>(async (requestEvent) => {
    const client = tursoClient(requestEvent);
    const q = requestEvent.url.searchParams.get('q');

    let sql = 'SELECT * FROM donantes';
    let args: any[] = [];

    if (q) {
        sql += ' WHERE nombre LIKE ? OR apellido LIKE ? OR dni LIKE ?';
        const likeQuery = `%${q}%`;
        args = [likeQuery, likeQuery, likeQuery];
    }

    sql += ' ORDER BY created_at DESC';

    const rs = await client.execute({ sql, args });

    // Map rows to Donante object
    return rs.rows.map((row) => ({
        id: row.id as number,
        nombre: row.nombre as string,
        apellido: row.apellido as string,
        dni: row.dni as string,
        celular: row.celular as string,
        es_donante_previo: row.es_donante_previo as number,
        created_at: row.created_at as string,
    }));
});

export default component$(() => {
    const donors = useDonorsLoader();
    const loc = useLocation();

    return (
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="md:flex md:items-center md:justify-between mb-6">
                <h1 class="text-2xl font-bold text-gray-900">Listado de Donantes</h1>
                <div class="mt-4 md:mt-0">
                    <Form action={loc.url.pathname} method="get" class="flex gap-2">
                        <div class="relative rounded-md shadow-sm">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                name="q"
                                id="search"
                                class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
                                placeholder="Buscar por nombre o DNI"
                                value={loc.url.searchParams.get('q') || ''}
                            />
                        </div>
                        <button
                            type="submit"
                            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Buscar
                        </button>
                        {loc.url.searchParams.get('q') && (
                            <a
                                href="/lista/"
                                class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Limpiar
                            </a>
                        )}
                    </Form>
                </div>
            </div>

            {donors.value.length === 0 ? (
                <div class="text-center py-12">
                    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                    <h3 class="mt-2 text-sm font-medium text-gray-900">No hay donantes</h3>
                    <p class="mt-1 text-sm text-gray-500">No se encontraron resultados para tu búsqueda o aún no hay registros.</p>
                </div>
            ) : (
                <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {donors.value.map((donor) => (
                        <div key={donor.id} class="bg-white overflow-hidden rounded-lg shadow border border-gray-100 hover:shadow-md transition-shadow duration-300">
                            <div class="px-4 py-5 sm:p-6 opacity-100">
                                <div class="flex items-center justify-between">
                                    <h3 class="text-lg leading-6 font-medium text-gray-900 truncate">
                                        {donor.nombre} {donor.apellido}
                                    </h3>
                                    {donor.es_donante_previo === 1 && (
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            <svg class="-ml-0.5 mr-1.5 h-2 w-2 text-green-400" fill="currentColor" viewBox="0 0 8 8">
                                                <circle cx="4" cy="4" r="3" />
                                            </svg>
                                            Donante Previo
                                        </span>
                                    )}
                                </div>
                                <div class="mt-4 space-y-2">
                                    <div class="flex items-center text-sm text-gray-500">
                                        <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fill-rule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clip-rule="evenodd" />
                                        </svg>
                                        <span class="font-medium text-gray-900 mr-2">DNI:</span> {donor.dni}
                                    </div>
                                    <div class="flex items-center text-sm text-gray-500">
                                        <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                        </svg>
                                        <span class="font-medium text-gray-900 mr-2">Cel:</span> {donor.celular}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
});
