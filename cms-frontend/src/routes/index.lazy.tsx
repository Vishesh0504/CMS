import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
export const Route = createLazyFileRoute("/")({
  component: Index,
});
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { URL_ORIGIN } from "@/constants";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
function Index() {
  const passwordSchema = z
    .string()
    .min(10, { message: "Password must be at least 10 characters long" })
    .refine((value) => /[a-z]/.test(value), {})
    .refine((value) => /[A-Z]/.test(value), {
      message: "Password must contain an uppercase letter",
    })
    .refine((value) => /[!@#$%^&*]/.test(value), {
      message: "Password must contain a special character",
    });

  const formSchema = z.object({
    email: z.string().email(),
    password: passwordSchema,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    try {
      const res = await axios.post(`${URL_ORIGIN}/auth/login`, values);
      if (res.status === 200) {
        toast.success(`${res.data.message}`);
        navigate({to:"/dashboard"})
      } else {
        toast.error(`${res.data.error}`);
      }
    } catch (err) {
      console.log(err);
      if(err instanceof AxiosError)
      {
        toast.error(`${err.response?.data.error}`);

      }
    }
  }
  const navigate = useNavigate();
  return (
    <div className="flex justify-center py-48 bg-hero-pattern bg-cover h-screen">
      <div className="border border-neutral-300 px-8 py-6 flex flex-col gap-10 rounded-md shadow-md w-96 h-fit">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter the email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the Password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-[#F2950A] text-white">
              Login
            </Button>
          </form>
        </Form>
        <div className="flex justify-between">
          <button
            className=" underline"
            onClick={() => {
              navigate({ to: "/forgotPassword" });
            }}
          >
            Forgot Password
          </button>
          <div className="flex gap-2">
            <p>Can't Login</p>
            <button
              className="underline"
              onClick={() => {
                navigate({ to: "/signup" });
              }}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
