/* eslint-disable react/prop-types */
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import useFetch from "@/hooks/use-fetch";
import { applyToJob } from "@/api/apiApplication";
import { BarLoader } from "react-spinners";

const schema = z.object({
  experience: z
    .number()
    .min(0, { message: "Experience must be at least 0" })
    .int(),
  skills: z.string().min(1, { message: "Skills are required" }),
  education: z.enum(["Intermediate", "Graduate", "Post Graduate"], {
    message: "Education is required",
  }),
  resume: z
    .any()
    .refine(
      (file) =>
        file[0] &&
        (file[0].type === "application/pdf" ||
          file[0].type === "application/msword"),
      { message: "Only PDF or Word documents are allowed" }
    ),
});

export function ApplyJobDrawer({ user, job, fetchJob, applied = false }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const {
    loading: loadingApply,
    error: errorApply,
    fn: fnApply,
  } = useFetch(applyToJob);

  const onSubmit = (data) => {
    fnApply({
      ...data,
      job_id: job.id,
      candidate_id: user.id,
      name: user.fullName,
      status: "applied",
      resume: data.resume[0],
    }).then(() => {
      fetchJob();
      reset();
    });
  };

  return (
  <Drawer open={applied ? false : undefined}>
    <DrawerTrigger asChild>
      <Button
        size="lg"
        variant={job?.isOpen && !applied ? "blue" : "destructive"}
        disabled={!job?.isOpen || applied}
        className={`px-10 py-6 text-base font-bold rounded-xl tracking-wide transition-all duration-200 shadow-lg ${
          job?.isOpen && !applied
            ? "bg-teal-500 hover:bg-teal-400 text-black shadow-teal-500/30 hover:shadow-teal-400/40 hover:scale-105"
            : ""
        }`}
      >
        {job?.isOpen ? (applied ? "Applied" : "Apply Now") : "Hiring Closed"}
      </Button>
    </DrawerTrigger>

    <DrawerContent className="bg-[#0d0d14] border-t border-white/10 rounded-t-3xl max-h-[90vh] flex flex-col">
      {/* Header */}
      <DrawerHeader className="px-8 pt-8 pb-4 border-b border-white/5">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1 h-6 rounded-full bg-teal-400" />
          <DrawerTitle className="text-2xl font-black tracking-tight text-white">
            Apply for {job?.title}
          </DrawerTitle>
        </div>
        <DrawerDescription className="text-zinc-500 text-sm pl-4">
          at <span className="text-teal-400 font-semibold">{job?.company?.name}</span> — fill out the form below to submit your application
        </DrawerDescription>
      </DrawerHeader>

      <div className="overflow-y-auto flex flex-col flex-1">
      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5 px-8 py-6"
      >
        {/* Experience */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
            Years of Experience
          </label>
          <Input
            type="number"
            placeholder="e.g. 3"
            className="bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:border-teal-500/50 focus:ring-teal-500/20 h-12 px-4"
            {...register("experience", { valueAsNumber: true })}
          />
          {errors.experience && (
            <p className="text-red-400 text-xs">{errors.experience.message}</p>
          )}
        </div>

        {/* Skills */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
            Skills
          </label>
          <Input
            type="text"
            placeholder="e.g. Python, SQL, TensorFlow"
            className="bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:border-teal-500/50 focus:ring-teal-500/20 h-12 px-4"
            {...register("skills")}
          />
          {errors.skills && (
            <p className="text-red-400 text-xs">{errors.skills.message}</p>
          )}
        </div>

        {/* Education */}
        <div className="flex flex-col gap-3">
          <label className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
            Education
          </label>
          <Controller
            name="education"
            control={control}
            render={({ field }) => (
              <RadioGroup
                onValueChange={field.onChange}
                {...field}
                className="flex flex-row gap-4 flex-wrap"
              >
                {["Intermediate", "Graduate", "Post Graduate"].map((level) => (
                  <div
                    key={level}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer transition-all duration-150 ${
                      field.value === level
                        ? "border-teal-500/60 bg-teal-500/10 text-teal-300"
                        : "border-white/10 bg-white/[0.03] text-zinc-400 hover:border-white/20"
                    }`}
                  >
                    <RadioGroupItem
                      value={level}
                      id={level.toLowerCase().replace(" ", "-")}
                      className="border-zinc-600 text-teal-400"
                    />
                    <Label
                      htmlFor={level.toLowerCase().replace(" ", "-")}
                      className="cursor-pointer text-sm font-medium"
                    >
                      {level}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          />
          {errors.education && (
            <p className="text-red-400 text-xs">{errors.education.message}</p>
          )}
        </div>

        {/* Resume Upload */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
            Resume
          </label>
          <Input
            type="file"
            accept=".pdf, .doc, .docx"
            className="bg-white/[0.04] border border-white/10 rounded-xl text-zinc-400 file:bg-teal-500/20 file:text-teal-300 file:border-0 file:rounded-lg file:px-3 file:py-1.5 file:text-xs file:font-semibold file:mr-3 hover:file:bg-teal-500/30 h-12 px-3 cursor-pointer"
            {...register("resume")}
          />
          {errors.resume && (
            <p className="text-red-400 text-xs">{errors.resume.message}</p>
          )}
        </div>

        {/* API error */}
        {errorApply?.message && (
          <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
            {errorApply?.message}
          </p>
        )}

        {/* Loader */}
        {loadingApply && <BarLoader width={"100%"} color="#2dd4bf" />}

        {/* Submit */}
        <Button
          type="submit"
          variant="blue"
          size="lg"
          className="w-full bg-teal-500 hover:bg-teal-400 text-black font-bold rounded-xl h-12 text-base tracking-wide shadow-lg shadow-teal-500/20 hover:shadow-teal-400/30 transition-all duration-200"
        >
          Submit Application
        </Button>
      </form>

      {/* Footer */}
      <DrawerFooter className="px-8 pb-8 pt-0">
        <DrawerClose asChild>
          <Button
            variant="outline"
            className="w-full border-white/10 bg-white/[0.03] text-zinc-400 hover:text-white hover:bg-white/[0.07] hover:border-white/20 rounded-xl h-11 transition-all duration-150"
          >
            Cancel
          </Button>
        </DrawerClose>
      </DrawerFooter>
      </div>
    </DrawerContent>
  </Drawer>
);
}