/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
    presets: [require('nativewind/preset')],
    theme: {
        extend: {
            colors: {
                background: '#182122',
                primary: '#534fff',
                secondary: '#c1bffd',
                tertiary: '#ccf888',
            },
            fontFamily: {
                'geistmono-black': ['GeistMono-Black', 'monospace'],
                'geistmono-bold': ['GeistMono-Bold', 'monospace'],
                'geistmono-extra-bold': ['GeistMono-ExtraBold', 'monospace'],
                'geistmono-extra-light': ['GeistMono-ExtraLight', 'monospace'],
                'geistmono-light': ['GeistMono-Light', 'monospace'],
                'geistmono-medium': ['GeistMono-Medium', 'monospace'],
                'geistmono-regular': ['GeistMono-Regular', 'monospace'],
                'geistmono-semi-bold': ['GeistMono-SemiBold', 'monospace'],
                'geistmono-thin': ['GeistMono-Thin', 'monospace'],
                'inter-light': ['Inter-Light', 'sans-serif'],
                'inter-medium': ['Inter-Medium', 'sans-serif'],
                'inter-regular': ['Inter-Regular', 'sans-serif'],
                'inter-semi-bold': ['Inter-SemiBold', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
