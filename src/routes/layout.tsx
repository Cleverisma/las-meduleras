import { component$, Slot } from '@builder.io/qwik';
import { Link, useLocation, routeAction$, Form } from '@builder.io/qwik-city';
import logoSrc from '~/media/logo_meduleras.png';

export const useLogout = routeAction$((props, { cookie, redirect }) => {
    cookie.delete('auth_session', { path: '/' });
    throw redirect(302, '/login');
});

export default component$(() => {
    const loc = useLocation();
    const logout = useLogout();

    return (
        <div class="min-h-screen bg-gray-50 font-sans">
            <header class="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
                <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    {/* Logo Section */}
                    <div class="flex-shrink-0 flex items-center">
                        <Link href="/" class="flex items-center gap-2">
                            <img src={logoSrc} alt="Las Meduleras" class="h-12 w-auto" width={48} height={48} />
                            <span class="text-2xl font-bold text-indigo-700 tracking-tight">Las Meduleras</span>
                        </Link>
                    </div>

                    {/* Centered Navigation Buttons (Hidden on small mobile, visible on larger) */}
                    <div class="hidden md:flex flex-1 justify-center space-x-8">
                        <Link
                            href="/"
                            class={`px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 shadow-sm ${loc.url.pathname === '/'
                                ? 'bg-indigo-600 text-white shadow-indigo-200'
                                : 'bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 border border-gray-200'
                                }`}
                        >
                            📝 Registrar Donante
                        </Link>
                        <Link
                            href="/lista/"
                            class={`px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 shadow-sm ${loc.url.pathname.startsWith('/lista')
                                ? 'bg-indigo-600 text-white shadow-indigo-200'
                                : 'bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 border border-gray-200'
                                }`}
                        >
                            📋 Ver Listado
                        </Link>
                    </div>

                    {/* Right Side: Logout */}
                    <div class="flex items-center">
                        <Form action={logout}>
                            <button
                                type="submit"
                                class="px-4 py-2 rounded-md text-base font-medium text-gray-600 hover:text-red-700 hover:bg-red-50 transition-colors duration-200"
                            >
                                Salir
                            </button>
                        </Form>
                    </div>
                </nav>
            </header>

            {/* Mobile Navigation Buttons (Visible only on mobile) */}
            <div class="md:hidden bg-white border-b border-gray-200 px-4 py-3 space-y-3 shadow-sm">
                <Link
                    href="/"
                    class={`block w-full text-center px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${loc.url.pathname === '/'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                >
                    📝 Registrar Donante
                </Link>
                <Link
                    href="/lista/"
                    class={`block w-full text-center px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${loc.url.pathname.startsWith('/lista')
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                >
                    📋 Ver Listado
                </Link>
            </div>

            <main>
                <Slot />
            </main>
        </div >
    );
});
