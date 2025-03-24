import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import Error from "./error";
import { login } from "@/db/apiAuth";
import { BeatLoader } from "react-spinners";
import useFetch from "@/hooks/use-fetch";
import { UrlState } from "@/context";

const schema = Yup.object().shape({
  email: Yup.string().email("Invalid Email").required("Email is required"),
  password: Yup.string()
    .min(8, "It must be at least 8 characters long")
    .required("Password is required"),
});

const Login = () => {
  let [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const navigate = useNavigate();
  const { fetchUser } = UrlState();

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { loading, error, fn: fnLogin, data } = useFetch(login, formData);

  useEffect(() => {
    if (!error && data) {
      fetchUser();
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
    }
  }, [error, data, fetchUser, longLink, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleLogin = async () => {
    setErrors({});
    try {
      await schema.validate(formData, { abortEarly: false });
      await fnLogin();
    } catch (e) {
      const newErrors = {};
      e?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-sm p-6 shadow-md bg-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Log In</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
          {error && <Error message={error.message} />}
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block font-medium">Email Address</label>
            <Input
              name="email"
              type="email"
              id="email"
              placeholder="Enter your email here"
              onChange={handleInputChange}
            />
            {errors.email && <Error message={errors.email} />}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block font-medium">Password</label>
            <Input
              name="password"
              type="password"
              id="password"
              placeholder="Use a strong password"
              onChange={handleInputChange}
            />
            {errors.password && <Error message={errors.password} />}
          </div>
        </CardContent>

        <CardFooter className="flex justify-center">
          <Button
            className="px-6 w-full flex items-center justify-center gap-2"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? <BeatLoader size={10} color="#36d7b7" /> : "Log In"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
