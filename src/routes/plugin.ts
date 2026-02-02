import type { RequestHandler } from "@builder.io/qwik-city";

export const onRequest: RequestHandler = async ({ url, cookie, redirect }) => {
    const publicRoutes = ["/login", "/admin-setup"];
    const isPublic = publicRoutes.some((path) => url.pathname.startsWith(path));

    // Verificar sesión
    const sessionCookie = cookie.get("auth_session");
    const isAuthenticated = !!sessionCookie?.value;

    if (!isPublic && !isAuthenticated) {
        throw redirect(302, "/login");
    }
};
