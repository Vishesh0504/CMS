import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/forgotPassword/")({
  component: () => <ForgotPassword />,
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
const ForgotPassword = () => {
  const navigate = useNavigate();
  const formSchema = z.object({
    email: z.string().email(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    localStorage.setItem("email", values.email);
    try {
      const res = await axios.post(`${URL_ORIGIN}/auth/forgotPassword`, values);
      localStorage.setItem("SecurityQues", res.data.securityQues);
      navigate({ to: "/forgotPassword/enterAns" });
    } catch (err) {
      console.log(err);
      if(err instanceof AxiosError)
      {
        toast.error(`${err.response?.data.error}`);

      }
    }
  }
  return (
    <div className="flex justify-center py-48 bg-hero-pattern bg-cover h-screen">
      <div className="border border-neutral-300 rounded-md shadow px-8 py-6 h-fit">
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
            <Button type="submit" className="w-full bg-[#F2950A] text-white">
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
