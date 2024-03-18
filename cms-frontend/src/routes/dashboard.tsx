import { URL_ORIGIN } from "@/constants";
import { AuthContext } from "@/context/AuthContext";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useCookies } from "react-cookie";
export const Route = createFileRoute("/dashboard")({
  component: () => <Dashboard />,
});
interface Conference {
  _id?:number;
  __v?:number;
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

  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies([
    "user",
    "access_token",
  ]);
  const { user } = useContext(AuthContext);

  const [upcoming, setUpcoming] = useState<Conference[]>();
  const [past, setPast] = useState<Conference[]>();
  const [current, setCurrent] = useState<string>("Upcoming");
  const conferences = (current === "Upcoming") ? upcoming : past;
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
  return (
    <div className="flex ">
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
          <button className="font-semibold text-lg px-4 py-2 bg-[#F2950A] rounded-md text-white">
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
                delete conference.endTimeObj;
                delete conference.startTimeObj;
                delete conference.CreatedBy;
                delete conference.__v;
                delete conference.invitedUsers;
                delete conference._id;
                // console.log(conference);
                return (
                  <div className="flex jusify-evenly  w-full">
                    {Object.values(conference).map((value) => {
                      return <div key={value} className="jusify-center px-8 py-4 w-full">{value}</div>;
                    })}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};
