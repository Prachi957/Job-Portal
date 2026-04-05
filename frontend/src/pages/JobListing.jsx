import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { State } from "country-state-city";
import { BarLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCompanies } from "@/api/apiCompanies";
import { getJobs } from "@/api/apiJobs";
import useFetch from "@/hooks/use-fetch";
import JobCard from "@/components/job-card";

const JobListing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");

  const { isLoaded } = useUser();

  const {
    // loading: loadingCompanies,
    data: companies,
    fn: fnCompanies,
  } = useFetch(getCompanies);

  const {
    loading: loadingJobs,
    data: jobs,
    fn: fnJobs,
  } = useFetch(getJobs, {
    location,
    company_id,
    searchQuery,
  });

  useEffect(() => {
    if (isLoaded) {
      fnCompanies();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded) fnJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, location, company_id, searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);

    const query = formData.get("search-query");
    if (query) setSearchQuery(query);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setCompany_id("");
    setLocation("");
  };

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className="text-white">

      {/* HEADER */}
      <div className="text-center pt-0 pb-6 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-teal-400 bg-teal-400/10 border border-teal-400/20 rounded-full px-4 py-1 mb-3">
          Opportunities
        </span>
        <h1 className="text-6xl sm:text-7xl font-black tracking-tight text-white leading-none">
          Latest <span className="text-teal-400">Jobs</span>
        </h1>
      </div>

      {/* SEARCH + FILTERS */}
      <div className="flex flex-col gap-3 mb-6">
        <form onSubmit={handleSearch} className="flex gap-3">
          <Input
            type="text"
            placeholder="Search jobs by title..."
            name="search-query"
            className="h-12 flex-1 px-5 bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:border-teal-500/50 text-sm"
          />
          <Button
            type="submit"
            variant="blue"
            className="h-12 px-8 bg-teal-500 hover:bg-teal-400 text-black font-bold rounded-xl shadow-lg shadow-teal-500/20 transition-all hover:scale-105"
          >
            Search
          </Button>
        </form>

        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={location} onValueChange={(value) => setLocation(value)}>
            <SelectTrigger className="h-11 bg-white/[0.04] border border-white/10 rounded-xl text-zinc-400 flex-1">
              <SelectValue placeholder="Filter by Location" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-700 rounded-xl">
              <SelectGroup>
                {State.getStatesOfCountry("IN").map(({ name }) => (
                  <SelectItem key={name} value={name} className="text-zinc-300 focus:bg-teal-500/20 focus:text-teal-300">
                    {name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={company_id} onValueChange={(value) => setCompany_id(value)}>
            <SelectTrigger className="h-11 bg-white/[0.04] border border-white/10 rounded-xl text-zinc-400 flex-1">
              <SelectValue placeholder="Filter by Company" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-700 rounded-xl">
              <SelectGroup>
                {companies?.map(({ name, id }) => (
                  <SelectItem key={name} value={id} className="text-zinc-300 focus:bg-teal-500/20 focus:text-teal-300">
                    {name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Button
            variant="destructive"
            onClick={clearFilters}
            className="h-11 px-6 bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/20 rounded-xl font-semibold transition-all"
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {/* LOADER */}
      {loadingJobs && <BarLoader width={"100%"} color="#2dd4bf" />}

      {/* JOB GRID */}
      {loadingJobs === false && (
        <div className="pb-12">
          {jobs?.length ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} savedInit={job?.saved?.length > 0} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-5xl mb-4">😢</div>
              <p className="text-zinc-400 text-lg font-medium">No Jobs Found</p>
              <p className="text-zinc-600 text-sm mt-1">Try adjusting your filters or search query</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobListing;