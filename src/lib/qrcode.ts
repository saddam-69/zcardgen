import { QRCodeSVG } from 'qrcode.react'

export const QRCode = QRCodeSVG

export const generateQRValue = (data: Record<string, any>) => {
  return JSON.stringify(data)
}

// Options par défaut pour les QR codes
export const defaultQROptions = {
  size: 256,
  level: 'H' as const,
  includeMargin: true,
  imageSettings: {
    excavate: true,
  },
} 