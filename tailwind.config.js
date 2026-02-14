/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                terminal: {
                    green: '#00ff41',
                    black: '#0d0d0d',
                    dim: '#003b00',
                    alert: '#ff0000',
                    warning: '#ffcc00'
                }
            },
            fontFamily: {
                mono: ['"Fira Code"', 'monospace', 'ui-monospace', 'SFMono-Regular']
            }
        },
    },
    plugins: [],
}
