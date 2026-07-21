import { useEffect, useState } from "react";
import { EaCalc } from "./CalcSchema";
import { useForm } from "react-hook-form";

export default function CalcController() {
  const [inout, setInOut] = useState("in");

  const {
    register,
    handleSubmit,
    reset,

    formState: { isDirty },
  } = useForm<EaCalc>({
    defaultValues: {
      so13: 0, si13: 0, sum1: 0, nb13: 0, sum2: 0, or1: 0, or3: 0, sum3: 0, ir13: 0,
      so24: 0, si24: 0, sum1r: 0, nb24: 0, sum2r: 0, or2: 0, or4: 0, sum3r: 0, ir24: 0,
    },
  });

  useEffect(() => {
    reset();
  }, [inout, reset]);

  return { register, handleSubmit, isDirty, inout, setInOut };
}
