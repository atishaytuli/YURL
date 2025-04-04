import { useEffect, useState } from "react";
import Error from "./error";
import { Input } from "@/components/ui/input";
import * as Yup from "yup";
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
import { signup } from "@/db/apiAuth";
import { BeatLoader } from "react-spinners";
import useFetch from "@/hooks/use-fetch";
import { UrlState } from "@/context";
import { User, Mail, Lock, Upload } from 'lucide-react';

const Signup = () => {
  const [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: null,
  });
  const [fileName, setFileName] = useState("");
  const { fetchUser } = UrlState();

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profile_pic" && files && files[0]) {
      setFileName(files[0].name);
      setFormData((prevState) => ({
        ...prevState,
        [name]: files[0],
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const { loading, error, fn: fnSignup, data } = useFetch(signup, formData);

  useEffect(() => {
    if (data) {
      // Fetch user data after successful signup
      fetchUser();
      // Navigate to dashboard with the longLink parameter if it exists
      navigate(longLink ? `/dashboard?createNew=${longLink}` : "/dashboard");
    }
  }, [data, navigate, longLink, fetchUser]);

  const handleSignup = async () => {
    setErrors({});
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required("Name is required"),
        email: Yup.string()
          .email("Invalid email")
          .required("Email is required"),
        password: Yup.string()
          .min(6, "Password must be at least 6 characters")
          .required("Password is required"),
        profile_pic: Yup.mixed().required("Profile picture is required"),
      });

      await schema.validate(formData, { abortEarly: false });
      await fnSignup();
    } catch (error) {
      const newErrors = {};
      if (error?.inner) {
        error.inner.forEach((err) => {
          newErrors[err.path] = err.message;
        });
        setErrors(newErrors);
      } else if (error?.message) {
        setErrors({ api: error.message });
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Signup</CardTitle>
        <CardDescription>
          Create a new account if you haven&rsquo;t already
        </CardDescription>
        {/* Fix: Only render the error message string, not the error object */}
        {error && <Error message={typeof error === 'object' ? error.message : String(error)} />}
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            name="name"
            type="text"
            placeholder="Enter Name"
            className="pl-10"
            onChange={handleInputChange}
            value={formData.name}
          />
        </div>
        {errors.name && <Error message={errors.name} />}
        
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
        
        <div className="relative">
          <div className="flex items-center gap-2 border rounded-md p-2">
            <Upload className="h-4 w-4 text-gray-400" />
            <label htmlFor="profile-pic" className="cursor-pointer text-sm text-gray-500">
              {fileName || "Choose profile picture"}
            </label>
            <input
              id="profile-pic"
              name="profile_pic"
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              className="hidden"
            />
          </div>
        </div>
        {errors.profile_pic && <Error message={errors.profile_pic} />}
        {errors.api && <Error message={errors.api} />}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSignup} className="w-full">
          {loading ? (
            <BeatLoader size={10} color="#36d7b7" />
          ) : (
            "Create Account"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Signup;