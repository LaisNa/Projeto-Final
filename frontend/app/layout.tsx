import 'primereact/resources/themes/saga-blue/theme.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './globals.css'

import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'

import Interface from './componentes/Interface'
import { Providers } from './providers';
import { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'IndieBoxd',
  description: 'IndieBoxd',
  themeColor: '#212937',
  manifest: 'manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="h-full">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={`${inter.className} h-full m-0`}>
        <Providers>
          <Interface>
            {children}
          </Interface>
        </Providers>
        <Toaster />
      </body>
    </html>
  )
}
