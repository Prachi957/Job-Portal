import { getCompanies } from "@/api/apiCompanies";
import { addNewJob } from "@/api/apiJobs";
import AddCompanyDrawer from "@/components/add-company-drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import MDEditor from "@uiw/react-md-editor";
import { State } from "country-state-city";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  location: z.string().min(1, { message: "Select a location" }),
  company_id: z.string().min(1, { message: "Select or Add a new Company" }),
  requirements: z.string().min(1, { message: "Requirements are required" }),
});

const PostJob = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: { location: "", company_id: "", requirements: "" },
    resolver: zodResolver(schema),
  });

  const {
    loading: loadingCreateJob,
    error: errorCreateJob,
    data: dataCreateJob,
    fn: fnCreateJob,
  } = useFetch(addNewJob);

  const onSubmit = (data) => {
    fnCreateJob({
      ...data,
      recruiter_id: user.id,
      isOpen: true,
    });
  };

  useEffect(() => {
    if (dataCreateJob?.length > 0) navigate("/jobs");
  }, [loadingCreateJob]);

  const {
    loading: loadingCompanies,
    data: companies,
    fn: fnCompanies,
  } = useFetch(getCompanies);

  useEffect(() => {
    if (isLoaded) {
      fnCompanies();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  if (!isLoaded || loadingCompanies) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  if (user?.unsafeMetadata?.role !== "recruiter") {
    return <Navigate to="/jobs" />;
  }

  return (
    <div className="px-4 pt-1 pb-6">
      {/* HEADER */}
      <div className="text-center mb-6">
        <span className="inline-flex items-center gap-2 border border-teal-500/40 text-teal-400 text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4">
          Post a Job
        </span>
        <h1 className="text-5xl sm:text-7xl font-extrabold text-white">
          Create a <span className="text-teal-400">Listing</span>
        </h1>
      </div>

      {/* FORM CARD */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-teal-500/40 to-transparent" />

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 p-6 pb-0">

          <Input
            placeholder="Job Title"
            className="bg-white/[0.05] border-white/10 text-white placeholder:text-zinc-500 rounded-xl h-11"
            {...register("title")}
          />
          {errors.title && <p className="text-red-400 text-xs">{errors.title.message}</p>}

          <Textarea
            placeholder="Job Description"
            className="bg-white/[0.05] border-white/10 text-white placeholder:text-zinc-500 rounded-xl min-h-[100px]"
            {...register("description")}
          />
          {errors.description && <p className="text-red-400 text-xs">{errors.description.message}</p>}

          <div className="flex gap-3 items-center">
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="bg-white/[0.05] border-white/10 text-zinc-300 rounded-xl">
                    <SelectValue placeholder="Job Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {State.getStatesOfCountry("IN").map(({ name }) => (
                        <SelectItem key={name} value={name}>{name}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            <Controller
              name="company_id"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="bg-white/[0.05] border-white/10 text-zinc-300 rounded-xl">
                    <SelectValue placeholder="Company">
                      {field.value
                        ? companies?.find((com) => com.id === Number(field.value))?.name
                        : "Company"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {companies?.map(({ name, id }) => (
                        <SelectItem key={name} value={id}>{name}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            <AddCompanyDrawer fetchCompanies={fnCompanies} />
          </div>

          {errors.location && <p className="text-red-400 text-xs">{errors.location.message}</p>}
          {errors.company_id && <p className="text-red-400 text-xs">{errors.company_id.message}</p>}

          <Controller
            name="requirements"
            control={control}
            render={({ field }) => (
              <MDEditor value={field.value} onChange={field.onChange} data-color-mode="light"/>
            )}
          />
          {errors.requirements && <p className="text-red-400 text-xs">{errors.requirements.message}</p>}
          {errors.errorCreateJob && <p className="text-red-400 text-xs">{errors?.errorCreateJob?.message}</p>}
          {errorCreateJob?.message && <p className="text-red-400 text-xs">{errorCreateJob?.message}</p>}
          {loadingCreateJob && <BarLoader width={"100%"} color="#2dd4bf" />}

          <div className="px-0 py-4">
            <Button
              type="submit"
              variant="blue"
              size="lg"
              className="w-full h-11 bg-teal-500 hover:bg-teal-400 text-black font-bold rounded-xl transition-all duration-200"
            >
              Submit
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default PostJob;