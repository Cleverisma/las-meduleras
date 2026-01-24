import { component$, Slot } from '@builder.io/qwik';
import { Link, useLocation } from '@builder.io/qwik-city';

export default component$(() => {
    const loc = useLocation();

    return (
        <div class="min-h-screen bg-gray-50 font-sans">
            <header class="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
                <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div class="flex items-center">
                        <Link href="/" class="text-xl font-bold text-indigo-600 tracking-tight">
                            Cleverisma
                        </Link>
                    </div>
                    <div class="flex space-x-4">
                        <Link
                            href="/"
                            class={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${loc.url.pathname === '/'
                                    ? 'bg-indigo-50 text-indigo-700'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            📝 Registrar
                        </Link>
                        <Link
                            href="/lista/"
                            class={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${loc.url.pathname.startsWith('/lista')
                                    ? 'bg-indigo-50 text-indigo-700'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            📋 Ver Listado
                        </Link>
                    </div>
                </nav>
            </header>
            <main>
                <Slot />
            </main>
        </div>
    );
});
