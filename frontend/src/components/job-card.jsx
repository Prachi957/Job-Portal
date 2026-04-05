/* eslint-disable react/prop-types */
import { Heart, MapPinIcon, Trash2Icon } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Link } from "react-router-dom";
import useFetch from "@/hooks/use-fetch";
import { deleteJob, saveJob } from "@/api/apiJobs";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";

const JobCard = ({
  job,
  savedInit = false,
  onJobAction = () => {},
  isMyJob = false,
}) => {
  const [saved, setSaved] = useState(savedInit);

  const { user } = useUser();

  const { loading: loadingDeleteJob, fn: fnDeleteJob } = useFetch(deleteJob, {
    job_id: job.id,
  });

  const {
    loading: loadingSavedJob,
    data: savedJob,
    fn: fnSavedJob,
  } = useFetch(saveJob);

  const handleSaveJob = async () => {
    await fnSavedJob({
      alreadySaved: saved,
      user_id: user.id,
      job_id: job.id,
    });
    onJobAction();
  };

  const handleDeleteJob = async () => {
    await fnDeleteJob();
    onJobAction();
  };

  useEffect(() => {
    if (savedJob !== undefined) setSaved(savedJob?.length > 0);
  }, [savedJob]);

  return (
    <div className="relative flex flex-col bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden hover:border-teal-500/30 hover:bg-white/[0.05] transition-all duration-200 group">
      
      {loadingDeleteJob && <BarLoader width={"100%"} color="#2dd4bf" />}

      {/* TOP ACCENT LINE */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-teal-500/40 to-transparent" />

      {/* CARD BODY */}
      <div className="flex flex-col gap-4 p-5 flex-1">

        {/* TITLE + DELETE */}
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-base font-bold text-white leading-snug group-hover:text-teal-100 transition-colors">
            {job.title}
          </h3>
          {isMyJob && (
            <Trash2Icon
              size={16}
              fill="red"
              className="text-red-400 cursor-pointer shrink-0 hover:scale-110 transition-transform mt-0.5"
              onClick={handleDeleteJob}
            />
          )}
        </div>

        {/* COMPANY + LOCATION */}
        <div className="flex items-center justify-between">
          {job.company && (
            <img src={job.company.logo_url} className="h-6 object-contain" alt={job.company.name} />
          )}
          <span className="flex items-center gap-1.5 text-xs text-zinc-500">
            <MapPinIcon size={12} className="text-teal-400" />
            {job.location}
          </span>
        </div>

        {/* DIVIDER */}
        <div className="h-px bg-white/5" />

        {/* DESCRIPTION */}
        <p className="text-zinc-400 text-sm leading-relaxed line-clamp-2">
          {job.description.substring(0, job.description.indexOf("."))}.
        </p>
      </div>

      {/* FOOTER */}
      <div className="flex gap-2 px-5 pb-5">
        <Link to={`/job/${job.id}`} className="flex-1">
          <Button
            variant="secondary"
            className="w-full h-10 bg-white/[0.06] hover:bg-teal-500/20 hover:text-teal-300 border border-white/10 hover:border-teal-500/30 rounded-xl text-zinc-300 text-sm font-semibold transition-all duration-200"
          >
            More Details
          </Button>
        </Link>
        {!isMyJob && (
          <Button
            variant="outline"
            className="h-10 w-10 p-0 bg-white/[0.04] border border-white/10 hover:border-red-400/40 hover:bg-red-500/10 rounded-xl transition-all duration-200"
            onClick={handleSaveJob}
            disabled={loadingSavedJob}
          >
            {saved ? (
              <Heart size={16} fill="red" stroke="red" />
            ) : (
              <Heart size={16} className="text-zinc-500 hover:text-red-400" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default JobCard;