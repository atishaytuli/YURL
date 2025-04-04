import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import Error from "./error";
import { login } from "@/db/apiAuth";
import { BeatLoader } from "react-spinners";
import useFetch from "@/hooks/use-fetch";
import { UrlState } from "@/context";
import { Mail, Lock } from 'lucide-react';

const Login = () => {
  const [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const { loading, error, fn: fnLogin, data } = useFetch(login, formData);
  const { fetchUser } = UrlState();

  useEffect(() => {
    if (error === null && data) {
      fetchUser();
      navigate(longLink ? `/dashboard?createNew=${longLink}` : "/dashboard");
    }
  }, [error, data, fetchUser, navigate, longLink]);

  const handleLogin = async () => {
    setErrors({});
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .email("Invalid email")
          .required("Email is required"),
        password: Yup.string()
          .min(6, "Password must be at least 6 characters")
          .required("Password is required"),
      });

      await schema.validate(formData, { abortEarly: false });
      await fnLogin();
    } catch (e) {
      const newErrors = {};

      if (e?.inner) {
        e.inner.forEach((err) => {
          newErrors[err.path] = err.message;
        });
      } else if (e?.message) {
        newErrors.api = e.message;
      }

      setErrors(newErrors);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          to your YURL account if you already have one
        </CardDescription>
        {error && <Error message={typeof error === 'object' ? error.message : String(error)} />}
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            name="email"
            type="email"
            placeholder="Enter Email"
            className="pl-10"
            onChange={handleInputChange}
            value={formData.email}
          />
        </div>
        {errors.email && <Error message={errors.email} />}
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            name="password"
            type="password"
            placeholder="Enter Password"
            className="pl-10"
            onChange={handleInputChange}
            value={formData.password}
          />
        </div>
        {errors.password && <Error message={errors.password} />}
        {errors.api && <Error message={errors.api} />}
      </CardContent>
      <CardFooter>
        <Button onClick={handleLogin} className="w-full">
          {loading ? <BeatLoader size={10} color="#36d7b7" /> : "Login"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Login;