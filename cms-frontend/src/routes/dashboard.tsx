import { URL_ORIGIN } from "@/constants";
import { AuthContext } from "@/context/AuthContext";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import axios, { Axios, AxiosError } from "axios";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useCookies } from "react-cookie";
export const Route = createFileRoute("/dashboard")({
  component: () => <Dashboard />,
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
import Modal from "@/components/Modal";
export interface Conference {
  _id?: number;
  __v?: number;
  CreatedBy?: string;
  EventName: string;
  Description: string;
  date: string;
  startTimeString: string;
  startTimeObj?: Date;
  endTimeString: string;
  endTimeObj?: Date;
  room: number;
  invitedUsers?: { name: string; email: string }[];
}

const Dashboard = () => {
  const tableHeadings = [
    "Name",
    "Description",
    "Date",
    "Start Time",
    "End Time",
    "Room",
  ];
  const [conf,setConf] = useState<Conference | undefined>();
  const navigate = useNavigate();
  const [modalOpen,setModalOpen]=useState(false);
  const [, , removeCookie] = useCookies(["user", "access_token"]);
  const { user } = useContext(AuthContext);

  const [upcoming, setUpcoming] = useState<Conference[]>();
  const [past, setPast] = useState<Conference[]>();
  const [current, setCurrent] = useState<string>("Upcoming");
  const [createModal,setCreateModal]= useState(false);
  // const [invited,setInvited] = useState<User[]>([]);
  // const [users,setUsers] = useState<User[]>();
  const conferences = current === "Upcoming" ? upcoming : past;
  const formSchema = z.object({
    EventName: z.string(),
    Description:z.string(),
    date: z.string(),
    startTimeString:z.string(),
    endTimeString: z.string(),
    room: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      EventName: "",
      Description: "",
      date: "",
      startTimeString: "",
      endTimeString: "",
      room:""
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    try {
      const conference = {...values}
      const res = await axios.post(`${URL_ORIGIN}/dashboard/createConference`, conference,{withCredentials:true});
      if (res.status === 200) {
        toast.success(`${res.data.message}`);
      } else {
        toast.error(`${res.data.error}`);
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(`${err.response?.data.error}`);
      }
      console.log(err);
    }
  }
  // interface User{
  //   email:string;
  //   name:string;
  // }

  // useEffect((
  // )=>{
  //   async function fetchAllUser(){
  //     const res = await axios.get(`${URL_ORIGIN}/dashboard/fetchAllUsers`,{withCredentials:true});
  //     setUsers(res.data);
  //   }
  //   if(createModal)
  //   {
  //     fetchAllUser();
  //   }
  // },[createModal])

  useEffect(() => {
    async function fetchConferences() {
      try {
        const res = await axios.get(
          `${URL_ORIGIN}/dashboard/fetchConferences`,
          { withCredentials: true },
        );
        console.log(res);
        setUpcoming(res.data.upcomingConferences);
        setPast(res.data.pastConferences);
      } catch (err) {
        console.log(err);
        toast.error(`${err}`);
      }
    }
    fetchConferences();
  }, []);
  async function handleDelete(id:number){
    try{

      const res = await axios.post(`${URL_ORIGIN}/deleteConference`,{id});
      toast.success(res.data.message);
    }catch(err)
    {
      console.log(err)
      if(err instanceof AxiosError)
      {
        toast.error(`${err.response?.data.error}`)
      }
    }
  }
  console.log(createModal);
  return (
    <div className="flex ">
      {createModal && <Modal isOpen={createModal} setIsOpen={setCreateModal}>
        <div className="flex flex-col gap-2">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
        <FormField
              control={form.control}
              name="EventName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Description" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input placeholder="Date(YYYY-MM-DD)" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startTimeString"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <Input placeholder="(HH:MM)" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endTimeString"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <FormControl>
                    <Input placeholder="(HH:MM)" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
              <FormField
              control={form.control}
              name="room"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conference Room</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Room" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        <Button type="submit" className="w-full bg-[#F2950A] text-white">
              Create
        </Button>
        </form>
        </Form> </div></Modal>}
      {modalOpen && <Modal isOpen={modalOpen} setIsOpen={setModalOpen}>
        <div className="flex flex-col gap-4">
        <div className="flex justify-end">
            <button>
              <img src="/delete.png" className="size-7 opacity-50 -mt-9"/>
            </button>
            <button>
              <img/>
            </button>
        </div>
        <div>
            <p className="text-[#F2950A]  font-semibold">Created By:</p>
            <p className="text-neutral-500 ml-4">{conf?.CreatedBy}</p>
          </div>
          <div>
            <p className="text-[#F2950A]  font-semibold">Event Name:</p>
            <p className="text-neutral-500 ml-4">{conf?.EventName}</p>
          </div>
          <div>
            <p className="text-[#F2950A] font-semibold">Description:</p>
            <p  className="text-neutral-500 ml-4">{conf?.Description}</p>
          </div>
          <div>
            <p className="text-[#F2950A] font-semibold">Date:</p>
            <p className="text-neutral-500 ml-4">{conf?.date}</p>
          </div>
          <div>
          <p className="text-[#F2950A] font-semibold">Start Time:</p>
          <p className="text-neutral-500 ml-4">{conf?.startTimeString}</p>
          </div>
          <div>
          <p className="text-[#F2950A] font-semibold">End time:</p>
          <p className="text-neutral-500 ml-4">{conf?.endTimeString}</p>
          </div>
          <div>
          <p className="text-[#F2950A] font-semibold">Conference Room:</p>
          <p className="text-neutral-500 ml-4">{conf?.room}</p>
          </div>
          <div>
          <p className="text-[#F2950A] font-semibold">Invited Users:</p>
          <div className="flex gap-2">
          {(conf?.invitedUsers)?.map((user)=>{
            // console.log(user)
            return(
              <div key={user.email} className="rounded-md bg-[#C7D0EF] px-3 py-1">
                {user.name}
              </div>
            )
          })}</div>
          </div>
        </div>
      </Modal>}
      <div className="w-1/5 bg-[#C7D0EF] h-screen px-8 py-6 flex flex-col gap-4">
        <div className="flex ">
          <img src="/logo.png" className="size-8" />
          <p className="text-2xl"> The Conference Lab</p>
        </div>
        <div className="px-4 rounded-md py-2 bg-opacity-75 text-black border border-neutral-400 mt-2">
          Dashboard
        </div>
      </div>
      <div className="flex-1 flex flex-col px-6 gap-4">
        <div className="border-b-2 border-neutral-300 py-4">
          <div className="flex justify-between items-center">
            <p className="text-2xl">
              Welcome Back, {user ? user?.name : "User"}
            </p>
            <button
              className="rounded-md px-4 py-2 border-neutral-400 border bg-[#C7D0EF]"
              onClick={() => {
                removeCookie("user");
                toast.success("User Logged Out");
                navigate({ to: "/" });
              }}
            >
              Logout
            </button>
          </div>
        </div>
        <div className="flex justify-between ">
          <p className="text-2xl ">Your Conferences</p>
          <button className="font-semibold text-lg px-4 py-2 bg-[#F2950A] rounded-md text-white"
          onClick={()=>{setCreateModal(true)}}>
            + Create New Conference
          </button>
        </div>
        <div className="flex divide-x-2 rounded-lg border border-[#F2950A] w-fit mx-6">
          <button
            className={`${current === "Upcoming" ? " text-white bg-[#F2950A]" : ""} px-4 py-2 rounded-lg rounded-r-none`}
            onClick={() => setCurrent("Upcoming")}
          >
            Upcoming
          </button>
          <button
            className={`${current === "Past" ? " text-white bg-[#F2950A]" : ""} px-4 py-2 rounded-lg rounded-l-none`}
            onClick={() => setCurrent("Past")}
          >
            Past
          </button>
        </div>
        <div>
          <div className="bg-[#F1F3F9] flex jusify-center px-8 py-4 rounded-top-lg w-full pr-2 ">
            {tableHeadings.map((heading, index) => {
              return (
                <div key={index} className="flex w-full">
                  {heading}
                </div>
              );
            })}
          </div>
          <div className="flex flex-col gap-2">
            {conferences &&
              conferences.map((conference) => {
                const filteredConference = Object.fromEntries(
                  Object.entries(conference).filter(([key]) => !['endTimeObj', 'startTimeObj', 'CreatedBy','__v','invitedUsers','_id'].includes(key))
                );
                return (
                  <div className="flex jusify-evenly w-full items-center">
                    {Object.values(filteredConference).map((value,index) => {
                      return (
                        <div
                          key={index}
                          className="jusify-center px-8 py-4 w-full"
                        >
                          {value}
                        </div>
                      );
                    })}
                    <button className="w-36 opacity-50"
                    onClick={()=>{
                      setModalOpen(true);
                      console.log("Current Conf",conference)
                    setConf(conference)}}>
                      <img src="/expand.png"/></button>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};
