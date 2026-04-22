import localFont from 'next/font/local';

const fontMono = localFont({
    src: './GeistMono.woff2',
    variable: '--font-mono',
});

const fontSans = localFont({
    src: [{ path: './Geist.woff2' }, { path: './NotoSansSC.woff2' }],
    variable: '--font-sans',
});

export { fontMono, fontSans };
