import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/router';
import {Spinner} from "@nextui-org/react";

export default function Index() {
  const { user, error, isLoading } = useUser();
  const router = useRouter();

  // If the user is loading diplay dark background with spinner
  if (isLoading) return (
    <div className="flex justify-center items-center h-screen bg-black">
      <Spinner color="white" size="lg" />
    </div>
  );
  if (error) return <div>{error.message}</div>;

  // If the user is logged in redirect to /app
  if (user) router.push('/app');

  // Display landing screen with black and white solid split background and blue login button
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-black to-white">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-6xl font-bold text-white">Welcome</h1>
        {/* <h1 className="text-6xl font-bold text-white"></h1> */}
      </div>
      <div className="flex flex-col items-center justify-center">
        <button
          className="px-4 py-2 mt-4 text-xl font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
          onClick={() => router.push('/api/auth/login')}
        >
          Login
        </button>
      </div>
    </div>
  )
}