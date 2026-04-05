/* eslint-disable react/prop-types */
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useFetch from "@/hooks/use-fetch";
import { addNewCompany } from "@/api/apiCompanies";
import { BarLoader } from "react-spinners";
import { useEffect } from "react";

const schema = z.object({
  name: z.string().min(1, { message: "Company name is required" }),
  logo: z
    .any()
    .refine(
      (file) =>
        file[0] &&
        (file[0].type === "image/png" || file[0].type === "image/jpeg" || file[0].type === "image/jpg" || file[0].type === "image/svg"),
      {
        message: "Only Images are allowed",
      }
    ),
});

const AddCompanyDrawer = ({ fetchCompanies }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const {
    loading: loadingAddCompany,
    error: errorAddCompany,
    data: dataAddCompany,
    fn: fnAddCompany,
  } = useFetch(addNewCompany);

  const onSubmit = async (data) => {
    fnAddCompany({
      ...data,
      logo: data.logo[0],
    });
  };

  useEffect(() => {
    if (dataAddCompany?.length > 0) {
      fetchCompanies();
    }
  }, [loadingAddCompany]);

  return (
    <Drawer>
        <DrawerTrigger asChild>
        <Button
            type="button"
            size="sm"
            className="bg-white/[0.06] hover:bg-teal-500/20 hover:text-teal-300 border border-white/10 hover:border-teal-500/30 rounded-xl text-zinc-300 text-sm font-semibold transition-all duration-200"
        >
            Add Company
        </Button>
        </DrawerTrigger>
        <DrawerContent className="bg-zinc-950 border-t border-white/10">
        <DrawerHeader>
            <DrawerTitle className="text-white text-lg font-bold">Add a New Company</DrawerTitle>
        </DrawerHeader>

        <form className="flex gap-3 p-4 pb-0">
            <Input
            placeholder="Company name"
            className="bg-white/[0.05] border-white/10 text-white placeholder:text-zinc-500 rounded-xl"
            {...register("name")}
            />
            <Input
            type="file"
            accept="image/*"
            className="bg-white/[0.05] border-white/10 text-zinc-400 file:text-zinc-400 rounded-xl"
            {...register("logo")}
            />
            <Button
            type="button"
            onClick={handleSubmit(onSubmit)}
            className="w-40 bg-teal-500 hover:bg-teal-400 text-black font-bold rounded-xl transition-all duration-200"
            >
            Add
            </Button>
        </form>

        <DrawerFooter>
            {errors.name && <p className="text-red-400 text-xs">{errors.name.message}</p>}
            {errors.logo && <p className="text-red-400 text-xs">{errors.logo.message}</p>}
            {errorAddCompany?.message && <p className="text-red-400 text-xs">{errorAddCompany?.message}</p>}
            {loadingAddCompany && <BarLoader width={"100%"} color="#2dd4bf" />}
            <DrawerClose asChild>
            <Button
                type="button"
                className="w-full h-10 bg-white/[0.06] hover:bg-white/10 border border-white/10 rounded-xl text-zinc-300 font-semibold transition-all duration-200"
            >
                Cancel
            </Button>
            </DrawerClose>
        </DrawerFooter>
        </DrawerContent>
    </Drawer>
    );
};

export default AddCompanyDrawer;