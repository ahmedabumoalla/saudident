import type { Metadata, Viewport } from "next";import "./globals.css";
export const metadata:Metadata={title:"تجربة سعودي دنت",description:"جولة تفاعلية في فرعي سعودي دنت بأبها وخميس مشيط",applicationName:"سعودي دنت",appleWebApp:{capable:true,statusBarStyle:"black-translucent",title:"سعودي دنت"},formatDetection:{telephone:false}};
export const viewport:Viewport={width:"device-width",initialScale:1,maximumScale:1,userScalable:false,viewportFit:"cover",themeColor:"#171818"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ar" dir="rtl"><body>{children}</body></html>}
