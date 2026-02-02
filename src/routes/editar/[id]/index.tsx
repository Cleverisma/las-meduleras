import { component$ } from '@builder.io/qwik';
import { routeAction$, routeLoader$, zod$, z } from '@builder.io/qwik-city';
import { DonorForm } from '~/components/donor-form/donor-form';
import { tursoClient } from '~/utils/turso';

export const useDonorLoader = routeLoader$(async (requestEvent) => {
    const client = tursoClient(requestEvent);
    const donorId = requestEvent.params.id;

    const result = await client.execute({
        sql: 'SELECT * FROM donantes WHERE id = ?',
        args: [donorId],
    });

    if (result.rows.length === 0) {
        throw requestEvent.error(404, 'Donante no encontrado');
    }

    const row = result.rows[0];
    return {
        firstName: row.nombre as string,
        lastName: row.apellido as string,
        dni: row.dni as string,
        birthDate: row.fecha_nacimiento as string,
        address: row.domicilio as string,
        phone: row.celular as string,
        hasDonated: row.es_donante_previo as number,
    };
});

export const useDonorUpdateAction = routeAction$(
    async (data, requestEvent) => {
        try {
            const client = tursoClient(requestEvent);
            const donorId = requestEvent.params.id;

            await client.execute({
                sql: `UPDATE donantes SET 
          nombre = ?, 
          apellido = ?, 
          dni = ?, 
          fecha_nacimiento = ?, 
          domicilio = ?, 
          celular = ?, 
          es_donante_previo = ?
          WHERE id = ?`,
                args: [
                    data.firstName,
                    data.lastName,
                    data.dni,
                    data.birthDate,
                    data.address,
                    data.phone,
                    data.hasDonated === 'yes' ? 1 : 0,
                    donorId,
                ],
            });

            return {
                success: true,
                message: 'Donante actualizado correctamente',
            };
        } catch (e: any) {
            if (e.code === 'SQLITE_CONSTRAINT' || (e.message && e.message.includes('UNIQUE constraint failed: donantes.dni'))) {
                return requestEvent.fail(400, {
                    fieldErrors: {
                        dni: 'Este DNI ya está registrado por otro donante.',
                    },
                    message: 'Error de validación',
                });
            }

            console.error('Error updating donor:', e);
            return requestEvent.fail(500, {
                message: 'Ocurrió un error al actualizar los datos.',
            });
        }
    },
    zod$({
        firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
        lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
        dni: z.string().regex(/^\d+$/, 'El DNI debe contener solo números').min(7, 'El DNI debe tener al menos 7 dígitos'),
        birthDate: z.string().refine((date) => new Date(date).toString() !== 'Invalid Date', 'Fecha de nacimiento requerida'),
        address: z.string().min(5, 'El domicilio debe tener al menos 5 caracteres'),
        phone: z.string().regex(/^\d+$/, 'El celular debe contener solo números').min(10, 'El celular debe tener al menos 10 dígitos'),
        hasDonated: z.enum(['yes', 'no'], {
            errorMap: () => ({ message: 'Por favor seleccione una opción' }),
        }),
    })
);

export default component$(() => {
    const donor = useDonorLoader();
    const action = useDonorUpdateAction();

    return (
        <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
            <div class="max-w-3xl w-full space-y-10 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
                <div class="flex flex-col items-center">
                    <h2 class="mt-4 text-center text-4xl font-extrabold text-gray-900">
                        Editar Donante
                    </h2>
                </div>

                {action.value?.success ? (
                    <div class="rounded-md bg-green-50 p-4 animate-fadeIn">
                        <div class="flex">
                            <div class="flex-shrink-0">
                                <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                                </svg>
                            </div>
                            <div class="ml-3">
                                <p class="text-sm font-medium text-green-800">
                                    {action.value.message}
                                </p>
                            </div>
                        </div>
                        <a
                            href="/lista/"
                            class="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Volver al listado
                        </a>
                    </div>
                ) : (
                    <DonorForm
                        action={action}
                        initialValues={donor.value}
                        submitLabel="Guardar Cambios"
                    />
                )}
            </div>
        </div>
    );
});
