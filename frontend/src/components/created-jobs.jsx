import { getMyJobs } from "@/api/apiJobs";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";
import JobCard from "./job-card";
import { useEffect } from "react";

const CreatedJobs = () => {
  const { user } = useUser();

  const {
    loading: loadingCreatedJobs,
    data: createdJobs,
    fn: fnCreatedJobs,
  } = useFetch(getMyJobs, {
    recruiter_id: user.id,
  });

  useEffect(() => {
    fnCreatedJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
        {loadingCreatedJobs ? (
        <BarLoader width={"100%"} color="#2dd4bf" />
        ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {createdJobs?.length ? (
            createdJobs.map((job) => (
                <JobCard
                key={job.id}
                job={job}
                onJobAction={fnCreatedJobs}
                isMyJob
                />
            ))
            ) : (
            <div className="col-span-3 flex flex-col items-center justify-center py-20 text-center">
                <div className="text-5xl mb-4">😢</div>
                <p className="text-zinc-400 text-lg font-medium">No Jobs Found</p>
                <p className="text-zinc-600 text-sm mt-1">You haven't posted any jobs yet</p>
            </div>
            )}
        </div>
        )}
    </div>
    );
};

export default CreatedJobs;