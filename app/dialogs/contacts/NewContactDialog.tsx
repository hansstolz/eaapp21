import {
  contactsSchema,
  EaContacts,
} from "@/app/schemas/contacts/contact_schema";
import { useContactStore } from "@/app/stores/contact/contact_store";
import { LabeledInput } from "@/components/app/LabeledInput";
import LineRow from "@/components/app/LineRow";
import MovableDialog from "@/components/app/movable_dialog";
import Section from "@/components/app/Section";
import { PageColumns } from "@/components/app/TwoPageColumns";
import VStack from "@/components/app/VStack";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DialogFooter } from "@/components/ui/dialog";
import useAutoFocus from "@/lib/hooks/autofocus";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  contact: EaContacts | null;
};
export default function NewContactDialog(props: Props) {
  const { isOpen, setIsOpen, contact } = props;
  const firstInput = useAutoFocus();
  const { saveContact, setNew, isNew } = useContactStore();

  const saveCloseContact = async (data: EaContacts) => {
    saveContact(data);
    setIsOpen(false);
  };

  const {
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isDirty },
    control,
  } = useForm<EaContacts>({
    resolver: zodResolver(contactsSchema),
  });

  useEffect(() => {
    if (contact) {
      setNew(false);
      reset(contact);
    } else {
      setNew(true);
      reset(contactsSchema.parse({}));
    }
  }, [contact, reset]);

  return (
    <MovableDialog
      isDirty={isDirty}
      open={isOpen}
      setOpen={setIsOpen}
      title={isNew ? "New Contact" : "Edit Contact"}
    >
      <form name="contactForm" onSubmit={handleSubmit(saveCloseContact)}>
        <PageColumns className="grid-cols-2">
          <Card>
            <Section no={1} title={"Address"}>
              <VStack>
                <LabeledInput
                  type="text"
                  ref={firstInput}
                  control={control}
                  name={"first_name"}
                  label={"First name"}
                />
                <LabeledInput
                  name={"last_name"}
                  label={"Last name"}
                  control={control}
                />
                <LabeledInput
                  control={control}
                  label={"street"}
                  name={"streetaddress"}
                />
                <LineRow>
                  <LabeledInput
                    control={control}
                    name={"zip"}
                    label={"zip"}
                    className="w-20"
                  />
                  <LabeledInput
                    control={control}
                    name={"city"}
                    label={"city"}
                  />
                </LineRow>
                <LabeledInput
                  control={control}
                  name={"job_title"}
                  label={"Job Title"}
                />
              </VStack>
            </Section>
          </Card>
          <Card>
            <Section no={2} title={"Communication"}>
              <VStack>
                <LabeledInput control={control} name={"fon"} label={"Phone"} />
                <LabeledInput
                  control={control}
                  name={"email"}
                  label={"Email"}
                />
                <LabeledInput
                  type="textarea"
                  control={control}
                  name={"notes"}
                  label={"Notes"}
                />
              </VStack>
            </Section>
          </Card>
        </PageColumns>
        <DialogFooter className="h-12 py-2 px-4 bg-gray-200">
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsOpen(false)}
            >
              Close
            </Button>
            <Button disabled={!isDirty} variant="destructive" type="submit">
              Save
            </Button>
          </div>
        </DialogFooter>
      </form>
    </MovableDialog>
  );
}
