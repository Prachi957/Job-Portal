/* eslint-disable react/prop-types */
import { Boxes, BriefcaseBusiness, Download, School } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { updateApplicationStatus } from "@/api/apiApplication";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";

const ApplicationCard = ({ application, isCandidate = false }) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = application?.resume;
    link.target = "_blank";
    link.click();
  };

  const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(
    updateApplicationStatus,
    {
      job_id: application.job_id,
    }
  );

  const handleStatusChange = (status) => {
    fnHiringStatus(status).then(() => fnHiringStatus());
  };

  return (
    <div className="relative bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden hover:border-teal-500/30 transition-all duration-200 group">

      {loadingHiringStatus && <BarLoader width={"100%"} color="#2dd4bf" />}

      {/* Top accent line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-teal-500/40 to-transparent" />

      <div className="p-6 flex flex-col gap-5">

        {/* TITLE ROW */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 rounded-full bg-teal-400 shrink-0" />
            <h3 className="text-lg font-black text-white tracking-tight leading-snug group-hover:text-teal-100 transition-colors">
              {isCandidate
                ? `${application?.job?.title} at ${application?.job?.company?.name}`
                : application?.name}
            </h3>
          </div>
          <button
            onClick={handleDownload}
            className="shrink-0 p-2 rounded-xl bg-white/[0.05] border border-white/10 hover:bg-teal-500/20 hover:border-teal-500/30 text-zinc-400 hover:text-teal-300 transition-all duration-150"
          >
            <Download size={16} />
          </button>
        </div>

        {/* STATS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-center gap-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3">
            <BriefcaseBusiness size={14} className="text-teal-400 shrink-0" />
            <div>
              <p className="text-[10px] uppercase tracking-widest text-zinc-600 font-semibold">Experience</p>
              <p className="text-sm text-zinc-300 font-medium">{application?.experience} years</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3">
            <School size={14} className="text-teal-400 shrink-0" />
            <div>
              <p className="text-[10px] uppercase tracking-widest text-zinc-600 font-semibold">Education</p>
              <p className="text-sm text-zinc-300 font-medium">{application?.education}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3">
            <Boxes size={14} className="text-teal-400 shrink-0" />
            <div>
              <p className="text-[10px] uppercase tracking-widest text-zinc-600 font-semibold">Skills</p>
              <p className="text-sm text-zinc-300 font-medium truncate">{application?.skills}</p>
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="h-px bg-white/5" />

        {/* FOOTER ROW */}
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs text-zinc-600">
            {new Date(application?.created_at).toLocaleString()}
          </span>

          {isCandidate ? (
            <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border ${
              application.status === "hired"
                ? "bg-green-500/15 text-green-400 border-green-500/25"
                : application.status === "interviewing"
                ? "bg-teal-500/15 text-teal-400 border-teal-500/25"
                : application.status === "rejected"
                ? "bg-red-500/15 text-red-400 border-red-500/25"
                : "bg-zinc-500/15 text-zinc-400 border-zinc-500/25"
            }`}>
              {application.status}
            </span>
          ) : (
            <Select
              onValueChange={handleStatusChange}
              defaultValue={application.status}
            >
              <SelectTrigger className="w-48 h-9 bg-white/[0.04] border border-white/10 rounded-xl text-zinc-300 text-sm hover:border-white/20 transition-colors">
                <SelectValue placeholder="Application Status" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-700 rounded-xl">
                <SelectItem value="applied" className="text-zinc-300 focus:bg-teal-500/20 focus:text-teal-300">Applied</SelectItem>
                <SelectItem value="interviewing" className="text-zinc-300 focus:bg-teal-500/20 focus:text-teal-300">Interviewing</SelectItem>
                <SelectItem value="hired" className="text-zinc-300 focus:bg-green-500/20 focus:text-green-300">Hired</SelectItem>
                <SelectItem value="rejected" className="text-zinc-300 focus:bg-red-500/20 focus:text-red-300">Rejected</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;