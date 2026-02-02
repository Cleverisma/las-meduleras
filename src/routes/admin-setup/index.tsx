import { component$ } from "@builder.io/qwik";
import { Form, routeAction$, z, zod$ } from "@builder.io/qwik-city";
import bcrypt from "bcryptjs";
import { tursoClient } from "~/utils/turso";

export const useCreateUser = routeAction$(
    async (values, requestEvent) => {
        const client = tursoClient(requestEvent);

        // Verificar si el usuario ya existe
        const exists = await client.execute({
            sql: "SELECT id FROM usuarios WHERE username = ?",
            args: [values.username],
        });

        if (exists.rows.length > 0) {
            return requestEvent.fail(400, {
                message: "El usuario ya existe",
            });
        }

        // Hashear contraseña
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(values.password, salt);

        // Guardar usuario
        try {
            await client.execute({
                sql: "INSERT INTO usuarios (username, password_hash) VALUES (?, ?)",
                args: [values.username, hash],
            });
        } catch (e: any) {
            return requestEvent.fail(500, {
                message: `Error al crear usuario: ${e.message}`,
            });
        }

        return {
            success: true,
            message: "Usuario creado correctamente. Ahora puedes iniciar sesión.",
        };
    },
    zod$({
        username: z.string().min(3, "Mínimo 3 caracteres"),
        password: z.string().min(6, "Mínimo 6 caracteres"),
    })
);

export default component$(() => {
    const action = useCreateUser();

    return (
        <div class="flex min-h-screen items-center justify-center bg-gray-100 p-4">
            <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-md border-l-4 border-yellow-500">
                <h1 class="mb-2 text-center text-2xl font-bold text-gray-800">
                    Setup Inicial (Admin)
                </h1>
                <p class="mb-6 text-center text-sm text-gray-500">
                    Crea tu primer usuario administrador.
                    <br />
                    <span class="font-bold text-red-500">IMPORTANTE:</span> Borra esta ruta cuando termines.
                </p>

                <Form action={action} class="space-y-4">
                    {action.value?.success && (
                        <div class="rounded bg-green-100 p-3 text-sm text-green-600">
                            {action.value.message}
                            <a href="/login" class="ml-2 font-bold underline">Ir al Login</a>
                        </div>
                    )}

                    {action.value?.failed && (
                        <div class="rounded bg-red-100 p-3 text-sm text-red-600">
                            {action.value.message}
                        </div>
                    )}

                    <div>
                        <label class="mb-1 block text-sm font-medium text-gray-700">
                            Nuevo Usuario
                        </label>
                        <input
                            type="text"
                            name="username"
                            class="w-full rounded border border-gray-300 p-2 focus:border-yellow-500 focus:outline-none"
                        />
                        {action.value?.fieldErrors?.username && (
                            <p class="mt-1 text-xs text-red-500">
                                {action.value.fieldErrors.username}
                            </p>
                        )}
                    </div>

                    <div>
                        <label class="mb-1 block text-sm font-medium text-gray-700">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            name="password"
                            class="w-full rounded border border-gray-300 p-2 focus:border-yellow-500 focus:outline-none"
                        />
                        {action.value?.fieldErrors?.password && (
                            <p class="mt-1 text-xs text-red-500">
                                {action.value.fieldErrors.password}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        class="w-full rounded bg-yellow-500 p-2 font-bold text-white transition hover:bg-yellow-600 disabled:opacity-50"
                        disabled={action.isRunning}
                    >
                        {action.isRunning ? "Creando..." : "Crear Usuario"}
                    </button>
                </Form>
            </div>
        </div>
    );
});
