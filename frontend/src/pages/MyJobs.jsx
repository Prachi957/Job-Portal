import CreatedApplications from "@/components/created-applications";
import CreatedJobs from "@/components/created-jobs";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";

const MyJobs = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className="text-white">
      {/* HEADER */}
      <div className="text-center pt-0 pb-8 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-teal-400 bg-teal-400/10 border border-teal-400/20 rounded-full px-4 py-1 mb-3">
          {user?.unsafeMetadata?.role === "candidate" ? "Candidate" : "Recruiter"}
        </span>
        <h1 className="text-6xl sm:text-7xl font-black tracking-tight text-white leading-none">
          {user?.unsafeMetadata?.role === "candidate" ? "My Applications" : "My Jobs"}
        </h1>
      </div>

      {user?.unsafeMetadata?.role === "candidate" ? (
        <CreatedApplications />
      ) : (
        <CreatedJobs />
      )}
    </div>
  );
};

export default MyJobs;