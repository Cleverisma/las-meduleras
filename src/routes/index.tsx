import { component$ } from '@builder.io/qwik';
import { routeAction$, zod$, z } from '@builder.io/qwik-city';
import { tursoClient } from '~/utils/turso';
import logoSrc from '~/media/logo_meduleras.png';
import { DonorForm } from '~/components/donor-form/donor-form';

export const useDonorRegisterAction = routeAction$(
  async (data, requestEvent) => {
    try {
      const client = tursoClient(requestEvent);

      await client.execute({
        sql: `INSERT INTO donantes (
          nombre, 
          apellido, 
          dni, 
          fecha_nacimiento, 
          domicilio, 
          celular, 
          es_donante_previo,
          es_donante_medula
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          data.firstName,
          data.lastName,
          data.dni,
          data.birthDate,
          data.address,
          data.phone,
          data.hasDonated === 'yes' ? 1 : 0,
          data.isMarrowDonor === 'yes' ? 1 : 0
        ],
      });

      return {
        success: true,
        message: 'Donante registrado correctamente',
      };
    } catch (e: any) {
      if (e.code === 'SQLITE_CONSTRAINT' || (e.message && e.message.includes('UNIQUE constraint failed: donantes.dni'))) {
        return requestEvent.fail(400, {
          fieldErrors: {
            dni: 'Este DNI ya está registrado.',
          },
          message: 'Error de validación',
        });
      }

      console.error('Error registering donor:', e);
      return requestEvent.fail(500, {
        message: 'Ocurrió un error al guardar los datos. Intente nuevamente.',
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
    isMarrowDonor: z.enum(['yes', 'no'], {
      errorMap: () => ({ message: 'Por favor seleccione una opción' }),
    }),
  })
);

export default component$(() => {
  const action = useDonorRegisterAction();

  return (
    <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
      <div class="max-w-3xl w-full space-y-10 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
        <div class="flex flex-col items-center">
          <img src={logoSrc} alt="Las Meduleras" class="h-32 w-auto" height={128} width={128} />
          <h2 class="mt-4 text-center text-4xl font-extrabold text-gray-900">
            Registrar Nuevo Donante
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
            <button
              onClick$={() => window.location.reload()}
              class="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Registrar nuevo donante
            </button>
          </div>
        ) : (
          <DonorForm action={action} />
        )}
      </div>
    </div>
  );
});
