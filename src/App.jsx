import React,{ useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RECAPTCHA_SITE_KEY } from "./config";
import AppRouter from "./routes/AppRouter";





function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);  
  
    useEffect(() => {
        const script = document.createElement('script');
        //console.log('RECAPTCHA_SITE_KEY en AppEgresados:',RECAPTCHA_SITE_KEY);
        script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
        script.async = true; 
        script.defer = true; 
        document.body.appendChild(script);

        // Cleanup: Opcional, pero bueno para mantener limpio el DOM si el componente se desmontara (ej: testing)
        return () => {
            document.body.removeChild(script);
        };
    }, []); 

    // Control de Visibilidad del Badge (Reacciona al cambio de isAuthenticated)
    useEffect(() => {
        const toggleBadgeVisibility = () => {            
            if (window.grecaptcha && window.grecaptcha.ready) {
                window.grecaptcha.ready(() => {
                    const badge = document.querySelector(".grecaptcha-badge");
                    
                    if (badge) {
                        // Si esta autenticado (true) -> Ocultar
                        // Si no esta autenticado (false) -> Mostrar
                        badge.style.display = isAuthenticated ? "none" : "block";
                        console.log(`Recaptcha en AppEgresados: ${isAuthenticated ? 'OCULTADO' : 'VISIBLE'}`);
                    }
                    // Si el badge no se encuentra (puede tardar un momento), no hacemos nada o reintentamos
                });
            } else {
                // Si grecaptcha aún no está cargado (la librería tarda), reintentamos en un momento
                setTimeout(toggleBadgeVisibility, 200);
            }
        };

        toggleBadgeVisibility();
        
    }, [isAuthenticated]);
    
  return <AppRouter />;
}

export default App;
