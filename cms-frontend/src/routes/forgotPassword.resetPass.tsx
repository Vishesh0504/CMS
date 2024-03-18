import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/forgotPassword/resetPass")({
  component: () => <ResetPass />,
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
import axios from "axios";
import toast from "react-hot-toast";
const ResetPass = () => {
  const navigate = useNavigate();
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
    pass: passwordSchema,
    confPass: passwordSchema,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pass: "",
      confPass: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.pass !== values.confPass) {
      toast.error("Passwords don't match,Please try again");
      return;
    }
    const data = {
      password: values.pass,
      email: localStorage.getItem("email"),
    };
    console.log(data);
    try {
      const res = await axios.post(
        `${URL_ORIGIN}/auth/forgotPassword/resetPass`,
        data,
      );
      if (res.status === 200) {
        toast.success(`${res.data.message}`);
      } else {
        toast.error(`${res.data.error}`);
      }
    } catch (err) {
      console.log(err);
      toast.error(`${err}`);
    }
  }

  return (
    <div className="flex justify-center py-48 bg-hero-pattern bg-cover h-screen">
      <div className="border border-neutral-300 rounded-md shadow px-8 py-6 h-fit w-96 flex flex-col gap-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="pass"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the new password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confPass"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Re-enter Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Re-enter the new password"
                      {...field}
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-[#F2950A] text-white">
              Reset
            </Button>
          </form>
        </Form>
        <div className="flex justify-end gap-2">
          Try
          <button className="underline " onClick={() => navigate({ to: "/" })}>
            Login?
          </button>
        </div>
      </div>
    </div>
  );
};
