import { component$ } from '@builder.io/qwik';
import { Form, type ActionStore } from '@builder.io/qwik-city';

interface DonorFormProps {
    action: ActionStore<any, any>;
    initialValues?: {
        firstName?: string;
        lastName?: string;
        dni?: string;
        birthDate?: string;
        address?: string;
        phone?: string;
        hasDonated?: number; // 1 for yes, 0 for no
        isMarrowDonor?: number; // 1 for yes, 0 for no
    };
    submitLabel?: string;
}

export const DonorForm = component$<DonorFormProps>(({ action, initialValues, submitLabel = 'Registrar' }) => {
    return (
        <Form action={action} class="mt-8 space-y-6">
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
                            value={initialValues?.firstName}
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
                            value={initialValues?.lastName}
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
                            value={initialValues?.dni}
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
                            value={initialValues?.birthDate}
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
                            value={initialValues?.address}
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
                            value={initialValues?.phone}
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
                                checked={initialValues?.hasDonated === 1}
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
                                checked={initialValues?.hasDonated === 0}
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

                {/* Esta registrado como donante de medula osea */}
                <div class="pt-2">
                    <span class="block text-lg font-semibold text-gray-800">¿Está registrado como donante de médula ósea?</span>
                    <div class="mt-4 flex items-center space-x-8">
                        <div class="flex items-center">
                            <input
                                id="marrow-yes"
                                name="isMarrowDonor"
                                type="radio"
                                value="yes"
                                checked={initialValues?.isMarrowDonor === 1}
                                class="focus:ring-indigo-500 h-6 w-6 text-indigo-600 border-gray-300"
                            />
                            <label for="marrow-yes" class="ml-3 block text-lg font-medium text-gray-700">
                                Sí
                            </label>
                        </div>
                        <div class="flex items-center">
                            <input
                                id="marrow-no"
                                name="isMarrowDonor"
                                type="radio"
                                value="no"
                                checked={initialValues?.isMarrowDonor === 0}
                                class="focus:ring-indigo-500 h-6 w-6 text-indigo-600 border-gray-300"
                            />
                            <label for="marrow-no" class="ml-3 block text-lg font-medium text-gray-700">
                                No
                            </label>
                        </div>
                    </div>
                    {action.value?.fieldErrors?.isMarrowDonor && (
                        <p class="mt-1 text-base text-red-600">{action.value.fieldErrors.isMarrowDonor}</p>
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
                    {action.isRunning ? 'Procesando...' : submitLabel}
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
    );
});
