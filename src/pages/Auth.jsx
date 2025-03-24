import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from "react-router-dom";
import Login from "@/components/login";
import Signup from "@/components/signup";
const Auth = () => {
  const [searchParams] = useSearchParams();
  return (
    <div className="mt-36 flex flex-col items-center gap-10">
      <h2 className="text-5xl font-semibold">
        {searchParams.get("createNew")
          ? "Hold up! Let's login first ...."
          : "LogIn / SignUp"}
      </h2>

      <Tabs defaultValue="Login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="Login">LogIn</TabsTrigger>
          <TabsTrigger value="Signup">Signup</TabsTrigger>
        </TabsList>
        <TabsContent value="Login">
          <Login />
        </TabsContent>
        <TabsContent value="Signup">
          <Signup />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Auth;
