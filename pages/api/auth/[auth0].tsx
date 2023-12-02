import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';


// Handle auth to store user_email in local storage
export default handleAuth();