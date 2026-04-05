import { useEffect } from "react";
import { BarLoader } from "react-spinners";
import { useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Briefcase, DoorClosed, DoorOpen, MapPinIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ApplyJobDrawer } from "@/components/apply-job";
import { getSingleJob, updateHiringStatus } from "@/api/apiJobs";
import MDEditor from "@uiw/react-md-editor";
import ApplicationCard from "@/components/application-card";
import useFetch from "@/hooks/use-fetch";

const JobPage = () => {
  const { id } = useParams();
  const { isLoaded, user } = useUser();

  const {
    loading: loadingJob,
    data: job,
    fn: fnJob,
  } = useFetch(getSingleJob, {
    job_id: id,
  });

  useEffect(() => {
    if (isLoaded) fnJob();
  }, [isLoaded]);

  const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(
    updateHiringStatus,
    {
      job_id: id,
    }
  );

  const handleStatusChange = (value) => {
    const isOpen = value === "open";
    fnHiringStatus(isOpen).then(() => fnJob());
  };

  if (!isLoaded || loadingJob) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      
      {/* HERO HEADER */}
      <div className="relative overflow-hidden border-b border-white/5">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-950/40 via-transparent to-zinc-950 pointer-events-none" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          {/* Left: text */}
          <div className="flex flex-col gap-4">
            {/* Badge */}
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-teal-400 bg-teal-400/10 border border-teal-400/20 rounded-full px-3 py-1 w-fit">
              {job?.isOpen ? (
                <><DoorOpen size={12} /> Actively Hiring</>
              ) : (
                <><DoorClosed size={12} /> Position Closed</>
              )}
            </span>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none">
              {job?.title}
            </h1>

            <div className="flex flex-wrap items-center gap-5 text-sm text-zinc-400 mt-1">
              <span className="flex items-center gap-2">
                <MapPinIcon size={14} className="text-teal-400" />
                {job?.location}
              </span>
              <span className="w-px h-4 bg-zinc-700" />
              <span className="flex items-center gap-2">
                <Briefcase size={14} className="text-teal-400" />
                {job?.applications?.length} Applicant{job?.applications?.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Right: logo */}
          <div className="shrink-0 bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
            <img
              src={job?.company?.logo_url}
              className="h-14 w-auto object-contain"
              alt={job?.title}
            />
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-6">

        {/* STATUS (RECRUITER) */}
        {job?.recruiter_id === user?.id && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">Hiring Status</p>
            <Select onValueChange={handleStatusChange}>
              <SelectTrigger
                className={`w-full font-semibold border-none rounded-xl text-sm ${
                  job?.isOpen
                    ? "bg-teal-500/20 text-teal-300 ring-1 ring-teal-500/30"
                    : "bg-red-500/20 text-red-300 ring-1 ring-red-500/30"
                }`}
              >
                <SelectValue
                  placeholder={
                    "Hiring Status " + (job?.isOpen ? "( Open )" : "( Closed )")
                  }
                />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-700">
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* TWO-COLUMN LAYOUT */}
        <div className="grid md:grid-cols-5 gap-6">

          {/* ABOUT - wider */}
          <div className="md:col-span-3 rounded-2xl border border-white/10 bg-white/[0.03] p-7 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 rounded-full bg-teal-400" />
              <h2 className="text-lg font-bold tracking-tight">About the Job</h2>
            </div>
            <p className="text-zinc-400 leading-relaxed text-sm">
              {job?.description}
            </p>
          </div>

          {/* QUICK STATS - narrower */}
          <div className="md:col-span-2 rounded-2xl border border-white/10 bg-white/[0.03] p-7 flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 rounded-full bg-teal-400" />
              <h2 className="text-lg font-bold tracking-tight">Overview</h2>
            </div>
            <div className="flex flex-col gap-4 text-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-teal-400/10 text-teal-400">
                  <MapPinIcon size={15} />
                </div>
                <div>
                  <p className="text-zinc-500 text-xs">Location</p>
                  <p className="font-medium">{job?.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-teal-400/10 text-teal-400">
                  <Briefcase size={15} />
                </div>
                <div>
                  <p className="text-zinc-500 text-xs">Applicants</p>
                  <p className="font-medium">{job?.applications?.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${job?.isOpen ? "bg-teal-400/10 text-teal-400" : "bg-red-400/10 text-red-400"}`}>
                  {job?.isOpen ? <DoorOpen size={15} /> : <DoorClosed size={15} />}
                </div>
                <div>
                  <p className="text-zinc-500 text-xs">Status</p>
                  <p className={`font-medium ${job?.isOpen ? "text-teal-400" : "text-red-400"}`}>
                    {job?.isOpen ? "Open" : "Closed"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* REQUIREMENTS */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 rounded-full bg-teal-400" />
            <h2 className="text-lg font-bold tracking-tight">What We're Looking For</h2>
          </div>
          <MDEditor.Markdown
            source={job?.requirements}
            className="!bg-transparent text-zinc-400 text-sm
              [&_ul]:list-none [&_ul]:pl-0 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2
              [&_li]:flex [&_li]:items-start [&_li]:gap-3
              [&_li]:before:content-['→'] [&_li]:before:text-teal-400 [&_li]:before:font-bold [&_li]:before:shrink-0
              [&_strong]:text-white [&_p]:leading-relaxed"
          />
        </div>

        {/* LOADER */}
        {loadingHiringStatus && (
          <BarLoader width={"100%"} color="#2dd4bf" />
        )}

        {/* APPLICATIONS */}
        {job?.applications?.length > 0 && job?.recruiter_id === user?.id && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 rounded-full bg-teal-400" />
                <h2 className="text-lg font-bold tracking-tight">Applications</h2>
              </div>
              <span className="text-xs font-semibold bg-teal-400/10 text-teal-400 border border-teal-400/20 rounded-full px-3 py-1">
                {job?.applications?.length} Total
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {job?.applications.map((application) => (
                <ApplicationCard key={application.id} application={application} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* APPLY BUTTON */}
      {job?.recruiter_id !== user?.id && (
        <div className="flex border-t border-white/5 bg-[#0a0a0f]/80 backdrop-blur-md justify-center py-4 pb-10">
          <div className="max-w-5xl mx-auto">
            <ApplyJobDrawer
              job={job}
              user={user}
              fetchJob={fnJob}
              applied={job?.applications?.find((ap) => ap.candidate_id === user.id)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default JobPage;

