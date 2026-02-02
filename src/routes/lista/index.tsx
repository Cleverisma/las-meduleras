import { component$, useSignal } from '@builder.io/qwik';
import { routeLoader$, useLocation, routeAction$, zod$, z } from '@builder.io/qwik-city';
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

export const useDeleteDonante = routeAction$(async (data, requestEvent) => {
    const client = tursoClient(requestEvent);
    await client.execute({
        sql: 'DELETE FROM donantes WHERE id = ?',
        args: [data.id],
    });
    return { success: true };
}, zod$({
    id: z.coerce.number(),
}));

export default component$(() => {
    const donors = useDonorsLoader();
    const loc = useLocation();
    const deleteAction = useDeleteDonante();
    const viewMode = useSignal<'grid' | 'list'>('grid');

    return (
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="md:flex md:items-center md:justify-between mb-6">
                <h1 class="text-2xl font-bold text-gray-900">Listado de Donantes</h1>
                <div class="mt-4 md:mt-0 flex gap-4">
                    {/* View Toggle Buttons */}
                    <div class="flex rounded-md shadow-sm" role="group">
                        <button
                            type="button"
                            onClick$={() => viewMode.value = 'grid'}
                            class={`px-4 py-2 text-sm font-medium border rounded-l-lg ${viewMode.value === 'grid'
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            onClick$={() => viewMode.value = 'list'}
                            class={`px-4 py-2 text-sm font-medium border rounded-r-lg ${viewMode.value === 'list'
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>

                    <form action={loc.url.pathname} method="get" class="flex gap-2">
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
                                placeholder="Buscar..."
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
                    </form>
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
                <>
                    {viewMode.value === 'grid' ? (
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
                                            <div class="flex justify-end pt-2 space-x-2">
                                                <a
                                                    href={`/editar/${donor.id}`}
                                                    class="inline-flex items-center text-indigo-600 hover:text-indigo-900 text-sm font-medium transition-colors duration-200"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-1">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                                    </svg>
                                                    Editar
                                                </a>
                                                <button
                                                    type="button"
                                                    class="inline-flex items-center text-red-600 hover:text-red-900 text-sm font-medium transition-colors duration-200"
                                                    onClick$={async () => {
                                                        if (confirm('¿Estás seguro de que deseas eliminar a este donante? Esta acción no se puede deshacer.')) {
                                                            await deleteAction.submit({ id: donor.id });
                                                        }
                                                    }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-1">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                    </svg>
                                                    Eliminar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div class="bg-white shadow overflow-hidden sm:rounded-md border border-gray-100">
                            <ul role="list" class="divide-y divide-gray-200">
                                {donors.value.map((donor) => (
                                    <li key={donor.id}>
                                        <div class="px-4 py-4 flex items-center sm:px-6 hover:bg-gray-50 transition duration-150 ease-in-out">
                                            <div class="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                                                <div class="truncate">
                                                    <div class="flex text-sm">
                                                        <p class="font-medium text-indigo-600 truncate">{donor.nombre} {donor.apellido}</p>
                                                        <p class="ml-1 flex-shrink-0 font-normal text-gray-500">DNI: {donor.dni}</p>
                                                    </div>
                                                    <div class="mt-2 flex">
                                                        <div class="flex items-center text-sm text-gray-500">
                                                            <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                                            </svg>
                                                            <p>{donor.celular}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5">
                                                    <div class="flex overflow-hidden -space-x-1">
                                                        {donor.es_donante_previo === 1 && (
                                                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                Donante Previo
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="ml-5 flex-shrink-0 flex space-x-2">
                                                <a
                                                    href={`/editar/${donor.id}`}
                                                    class="inline-flex items-center text-indigo-600 hover:text-indigo-900 border border-transparent hover:bg-indigo-50 p-1 rounded-full transition-colors duration-200"
                                                    title="Editar"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                                    </svg>
                                                </a>
                                                <button
                                                    type="button"
                                                    class="inline-flex items-center text-red-600 hover:text-red-900 border border-transparent hover:bg-red-50 p-1 rounded-full transition-colors duration-200"
                                                    title="Eliminar"
                                                    onClick$={async () => {
                                                        if (confirm('¿Estás seguro de que deseas eliminar a este donante? Esta acción no se puede deshacer.')) {
                                                            await deleteAction.submit({ id: donor.id });
                                                        }
                                                    }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </>
            )}
        </div>
    );
});
