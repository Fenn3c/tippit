/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors:{
        'main-white': '#FFFFFF',
        'main-50': '#ECF4FF',
        'main-100': '#D8EAFF',
        'main-150': '#C5E0FF',
        'main-200': '#B1D5FF',
        'main-300': '#8BC0FF',
        'main-400': '#64ABFF',
        'main-500': '#3D96FF',
        'main-600': '#317AD0',
        'main-700': '#255EA1',
        'main-800': '#184172',
        'main-850': '#12335B',
        'main-900': '#0C2543',
        'main-900': '#06172C',
        'main-black': '#000914',
        'gray-bg': '#F6F6F6',
        'gray-stroke': '#E2E2E2',
        'gray-text': '#C7C7C7',
        'error': '#FF3D3D',
        'done': '#6ECC6C'
      }
    },
  },
  plugins: [],
}
