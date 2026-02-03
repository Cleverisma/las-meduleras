import { component$ } from "@builder.io/qwik";
import { Form, routeAction$, z, zod$ } from "@builder.io/qwik-city";
import bcrypt from "bcryptjs";
import { tursoClient } from "~/utils/turso";

export const useLogin = routeAction$(
    async (values, requestEvent) => {
        const client = tursoClient(requestEvent);

        // Buscar usuario en la base de datos
        const result = await client.execute({
            sql: "SELECT * FROM usuarios WHERE username = ?",
            args: [values.username],
        });

        if (result.rows.length === 0) {
            return requestEvent.fail(400, {
                message: "Usuario o contraseña inválidos",
            });
        }

        const user = result.rows[0];
        const passwordHash = user.password_hash as string;

        // Verificar contraseña
        const isValid = bcrypt.compareSync(values.password, passwordHash);

        if (!isValid) {
            return requestEvent.fail(400, {
                message: "Usuario o contraseña inválidos",
            });
        }

        // Crear cookie de sesión
        requestEvent.cookie.set("auth_session", "true", {
            httpOnly: true,
            secure: true,
            path: "/",
            maxAge: 60 * 60 * 24, // 1 día
            sameSite: "lax",
        });

        throw requestEvent.redirect(302, "/");
    },
    zod$({
        username: z.string().min(1, "Ingrese usuario"),
        password: z.string().min(1, "Ingrese contraseña"),
    })
);

export default component$(() => {
    const action = useLogin();

    return (
        <div class="flex min-h-screen items-center justify-center bg-gray-100 p-4">
            <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
                <h1 class="mb-6 text-center text-2xl font-bold text-gray-800">
                    Iniciar Sesión
                </h1>

                <Form action={action} class="space-y-4">
                    {action.value?.failed && (
                        <div class="rounded bg-red-100 p-3 text-sm text-red-600">
                            {action.value.message}
                        </div>
                    )}

                    <div>
                        <label class="mb-1 block text-sm font-medium text-gray-700">
                            Usuario
                        </label>
                        <input
                            type="text"
                            name="username"
                            class="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
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
                            class="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                        />
                        {action.value?.fieldErrors?.password && (
                            <p class="mt-1 text-xs text-red-500">
                                {action.value.fieldErrors.password}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        class="w-full rounded bg-blue-600 p-2 font-bold text-white transition hover:bg-blue-700 disabled:opacity-50"
                        disabled={action.isRunning}
                    >
                        {action.isRunning ? "Entrando..." : "Entrar"}
                    </button>
                </Form>
            </div>
        </div>
    );
});
