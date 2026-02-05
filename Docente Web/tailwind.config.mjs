/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                sage: {
                    DEFAULT: '#7B9669',
                    light: '#BAC8B1',
                    dark: '#404E3B',
                    slate: '#6C8480',
                    bg: '#E6E6E6',
                }
            },
        },
    },
    plugins: [],
}
