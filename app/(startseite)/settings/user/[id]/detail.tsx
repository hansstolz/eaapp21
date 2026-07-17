"use client";

import { EaUser } from "@/app/data_types/user/ea_user";
import { AlertDialog } from "@/app/dialogs/general/alert_dialog";
import { roleOptions } from "@/app/data_types/user/rights";
import UserSchema from "@/app/schemas/user/user_schema";
import { FormSelect } from "@/components/app/form_select";
import { LabeledInput } from "@/components/app/LabeledInput";
import LineLR from "@/components/app/LineLR";
import ListSave from "@/components/app/list_save";
import Section from "@/components/app/Section";
import { PageColumns } from "@/components/app/TwoPageColumns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useAutoFocus from "@/lib/hooks/autofocus";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

export default function Detail({ data }: { data: EaUser }) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { userSchema } = UserSchema();
  const firstInput = useAutoFocus();
  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      city: data.city ?? "",
      country: data.country ?? "",
      firstname: data.firstname ?? "",
      name: data.name ?? "",
      notes: data.notes ?? "",
      postal_zip: data.postal_zip ?? "",
      street_no: data.street_no ?? "",
      user_group: data.user_group ?? "",
      user_name: data.user_name ?? "",
      user_password: data.user_password ?? "",
      user_rights: data.user_rights,
      uid_user: data.uid_user,
    },
  });

  const { isDirty } = form.formState;

  async function onSubmit(data: z.infer<typeof userSchema>) {
    if (!isDirty) {
      return;
    }
    const isNew = !data.uid_user;
    const res = await saveUser(
      isNew ? "/user/create_user" : "/user/update_user",
      isNew ? "POST" : "PUT",
      data,
    );

    if (res?.uid_user) {
      toast.success("User settings updated successfully");
      form.reset(res);
      if (isNew) router.replace(`/settings/user/${res.uid_user}`);
    } else {
      toast.error("Failed to update user settings");
    }
  }

  async function deleteUser() {
    if (!data.uid_user) return;

    const response = await fetch(`/user/delete_user/${data.uid_user}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      toast.error("Failed to delete user");
      setIsDeleteDialogOpen(false);
      return;
    }

    toast.success("User deleted successfully");
    router.push("/settings/user");
    router.refresh();
  }

  return (
    <>
      {data && (
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <LineLR>
            <ListSave isDirty={isDirty} path="/settings/user" />
            {data.uid_user ? (
              <Button
                type="button"
                variant="destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                Delete User
              </Button>
            ) : null}
          </LineLR>
          <PageColumns className="grid-cols-2 w-full">
            <Card>
              <CardContent>
                <Section no={1} title="Personal">
                  <div className="flex flex-col gap-5">
                    <LabeledInput
                      ref={firstInput}
                      name={"name"}
                      label={"name"}
                      control={form.control}
                    />
                    <LabeledInput
                      name={"firstname"}
                      label={"firstname"}
                      control={form.control}
                    />
                    <LabeledInput
                      name={"street_no"}
                      label={"street no."}
                      control={form.control}
                    />
                    <LabeledInput
                      name={"city"}
                      label={"city"}
                      control={form.control}
                    />
                    <LabeledInput
                      name={"country"}
                      label={"country"}
                      control={form.control}
                    />
                  </div>
                </Section>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Section no={2} title="User">
                  <div className="flex flex-col gap-5">
                    <LabeledInput
                      disabled={true}
                      name={"user_group"}
                      label={"user_group"}
                      control={form.control}
                    />
                    <LabeledInput
                      name={"user_name"}
                      label={"user_name"}
                      control={form.control}
                    />
                    <LabeledInput
                      type="password"
                      name={"user_password"}
                      label={"user_password"}
                      control={form.control}
                    />

                    <FormSelect
                      name="user_rights"
                      label="User Rights"
                      placeholder="Bitte wählen"
                      options={roleOptions}
                      control={form.control}
                      error={form.formState.errors.user_rights?.message}
                    />

                    <LabeledInput
                      type="textarea"
                      name={"notes"}
                      label={"notes"}
                      control={form.control}
                    />
                  </div>
                </Section>
              </CardContent>
            </Card>
          </PageColumns>
        </form>
      )}
      <AlertDialog
        open={isDeleteDialogOpen}
        setOpen={setIsDeleteDialogOpen}
        onConfirm={() => void deleteUser()}
        title="Delete User"
        description={`Do you really want to delete the user “${data.user_name}”?`}
      />
    </>
  );
}

async function saveUser(
  url: string,
  method: "POST" | "PUT",
  data: unknown,
): Promise<EaUser | null> {
  try {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) return null;

    return (await response.json()) as EaUser;
  } catch {
    return null;
  }
}

/*
<LabeledInput
                      focus={false}
                      type="select"
                      register={register("user_rights")}
                      label={"Rights"}
                      error={errors.user_rights?.message}
                      items={roles}
                      width="w-1/3"
                    />
                    */
