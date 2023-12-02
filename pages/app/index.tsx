import type { NextPage } from "next";
import { Content } from "../../components/home/content";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const { user, isLoading } = useUser();
  const router = useRouter();
  if (isLoading) return <div>Loading...</div>;
  if (user === undefined) {
    router.push("/api/auth/login");
  }
  if (user) {
    localStorage.setItem("user_email", user?.email as string);
  }
  return <Content />
};

export default Home;
