import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/forgotPassword/enterAns')({
  component: () =><EnterAns/>
})
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
import toast from 'react-hot-toast';
function EnterAns(){
  const formSchema = z.object({
    securityAns: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      securityAns: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    const data = {
      securityAns:values.securityAns,
      email:email
    }
    try{
      const res = await axios.post(`${URL_ORIGIN}/auth/forgotPassword`, data);
      if(res.status===200)
      {
        toast.success(`${res.data.message}`);
      }else{
        toast.error(`${res.data.error}`)
      }
    }catch(err)
    {
      toast.error(`${err}`);
      console.log(err)
    }

  }
  const securityQues = localStorage.getItem('SecurityQues');
  const email =localStorage.getItem('email');
  return(
    <div className="flex justify-center py-48 bg-hero-pattern bg-cover h-screen">
            <div className="border border-neutral-300 rounded-md shadow px-8 py-6 h-fit">
            <Form {...form} >
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="securityAns"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{securityQues}</FormLabel>
                <FormControl>
                  <Input placeholder="Enter the Security Answer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full bg-[#F2950A] text-white">Submit</Button>
        </form>
      </Form>
      </div>
        </div>
  )
}