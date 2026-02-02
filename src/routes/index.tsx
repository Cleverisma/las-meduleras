import { component$ } from '@builder.io/qwik';
import { routeAction$, Form, zod$, z } from '@builder.io/qwik-city';
import { tursoClient } from '~/utils/turso';
import Logo from '~/media/logo.avif?jsx';

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
          es_donante_previo
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        args: [
          data.firstName,
          data.lastName,
          data.dni,
          data.birthDate,
          data.address,
          data.phone,
          data.hasDonated === 'yes' ? 1 : 0
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
  })
);

export default component$(() => {
  const action = useDonorRegisterAction();

  return (
    <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
      <div class="max-w-3xl w-full space-y-10 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
        <div class="flex flex-col items-center">
          <Logo />
          <h2 class="mt-4 text-center text-4xl font-extrabold text-gray-900">
            Registrar Nuevo Donante
          </h2>
          <p class="mt-3 text-center text-lg text-gray-600">
            Dimensiones aumentadas para mayor legibilidad.
          </p>
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
              // Simple reload to reset state for this demo, or we could use a signal to toggle view
              onClick$={() => window.location.reload()}
              class="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Registrar nuevo donante
            </button>
          </div>
        ) : (
          <Form action={action} class="mt-8 space-y-6">
            <div class="rounded-md shadow-sm -space-y-px">
              {/* Fields are not literally using -space-y-px here to keep them separated for cleanliness, overriding wrapper */}
            </div>

            <div class="space-y-6">
              {/* Nombre */}
              <div>
                <label for="firstName" class="block text-lg font-semibold text-gray-800">Nombre</label>
                <div class="mt-2">
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    class="appearance-none block w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg transition duration-200"
                    placeholder="Juan"
                  />
                </div>
                {action.value?.fieldErrors?.firstName && (
                  <p class="mt-1 text-base text-red-600">{action.value.fieldErrors.firstName}</p>
                )}
              </div>

              {/* Apellido */}
              <div>
                <label for="lastName" class="block text-lg font-semibold text-gray-800">Apellido</label>
                <div class="mt-2">
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    class="appearance-none block w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg transition duration-200"
                    placeholder="Pérez"
                  />
                </div>
                {action.value?.fieldErrors?.lastName && (
                  <p class="mt-1 text-base text-red-600">{action.value.fieldErrors.lastName}</p>
                )}
              </div>

              {/* DNI */}
              <div>
                <label for="dni" class="block text-lg font-semibold text-gray-800">DNI</label>
                <div class="mt-2">
                  <input
                    id="dni"
                    name="dni"
                    type="text"
                    inputMode="numeric"
                    required
                    class="appearance-none block w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg transition duration-200"
                    placeholder="12345678"
                  />
                </div>
                {action.value?.fieldErrors?.dni && (
                  <p class="mt-1 text-base text-red-600">{action.value.fieldErrors.dni}</p>
                )}
              </div>

              {/* Fecha de Nacimiento */}
              <div>
                <label for="birthDate" class="block text-lg font-semibold text-gray-800">Fecha de Nacimiento</label>
                <div class="mt-2">
                  <input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    required
                    class="appearance-none block w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg transition duration-200"
                  />
                </div>
                {action.value?.fieldErrors?.birthDate && (
                  <p class="mt-1 text-base text-red-600">{action.value.fieldErrors.birthDate}</p>
                )}
              </div>

              {/* Domicilio */}
              <div>
                <label for="address" class="block text-lg font-semibold text-gray-800">Domicilio</label>
                <div class="mt-2">
                  <input
                    id="address"
                    name="address"
                    type="text"
                    required
                    class="appearance-none block w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg transition duration-200"
                    placeholder="Av. Siempre Viva 123"
                  />
                </div>
                {action.value?.fieldErrors?.address && (
                  <p class="mt-1 text-base text-red-600">{action.value.fieldErrors.address}</p>
                )}
              </div>

              {/* Celular */}
              <div>
                <label for="phone" class="block text-lg font-semibold text-gray-800">Celular</label>
                <div class="mt-2">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    required
                    class="appearance-none block w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg transition duration-200"
                    placeholder="1198765432"
                  />
                </div>
                {action.value?.fieldErrors?.phone && (
                  <p class="mt-1 text-base text-red-600">{action.value.fieldErrors.phone}</p>
                )}
              </div>

              {/* Ha donado anteriormente */}
              <div class="pt-2">
                <span class="block text-lg font-semibold text-gray-800">¿Ha donado sangre anteriormente?</span>
                <div class="mt-4 flex items-center space-x-8">
                  <div class="flex items-center">
                    <input
                      id="donated-yes"
                      name="hasDonated"
                      type="radio"
                      value="yes"
                      class="focus:ring-indigo-500 h-6 w-6 text-indigo-600 border-gray-300"
                    />
                    <label for="donated-yes" class="ml-3 block text-lg font-medium text-gray-700">
                      Sí
                    </label>
                  </div>
                  <div class="flex items-center">
                    <input
                      id="donated-no"
                      name="hasDonated"
                      type="radio"
                      value="no"
                      class="focus:ring-indigo-500 h-6 w-6 text-indigo-600 border-gray-300"
                    />
                    <label for="donated-no" class="ml-3 block text-lg font-medium text-gray-700">
                      No
                    </label>
                  </div>
                </div>
                {action.value?.fieldErrors?.hasDonated && (
                  <p class="mt-1 text-base text-red-600">{action.value.fieldErrors.hasDonated}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                class="group relative w-full flex justify-center py-4 px-6 border border-transparent text-xl font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-md hover:shadow-lg"
                disabled={action.isRunning}
              >
                {action.isRunning && (
                  <span class="absolute left-0 inset-y-0 flex items-center pl-4">
                    <svg class="animate-spin h-6 w-6 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                )}
                {action.isRunning ? 'Procesando...' : 'Registrar'}
              </button>
            </div>

            {action.value?.failed && (
              <div class="rounded-md bg-red-50 p-4">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-red-800">
                      Ocurrió un error
                    </h3>
                    <div class="mt-2 text-sm text-red-700">
                      <p>{action.value.message}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Form>
        )}
      </div>
    </div>
  );
});
