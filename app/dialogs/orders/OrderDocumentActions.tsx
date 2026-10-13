"use client";

import { useEffect, useId, useRef, useState } from "react";
import { FiMail, FiPrinter } from "react-icons/fi";
import { useOrderStore } from "@/app/stores/order/order_store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useDocumentRefreshStore } from "@/app/stores/documents/document_store";
import MovableDialog from "@/components/app/movable_dialog";

type DocumentType = "Costestimate" | "Invoice" | "Creditnote" | "Warranty" | "Reminders" | "Payments" | "Mail";
const documentEndpoints: Partial<Record<DocumentType, string>> = {
  Costestimate: "/orders/costestimate_document",
  Invoice: "/orders/invoice_document",
  Creditnote: "/orders/creditnote_document",
  Payments: "/orders/payments_document",
  Reminders: "/orders/reminder_document",
  Mail: "/mails/document",
  Warranty: "/orders/warranty_document",
};

type Props = { documentType: DocumentType; documentNo?: number | null; documentId?: number | null; disabled?: boolean; beforeRequest?: () => Promise<void> };
type Context = Props & { orderId: number; customer: string; recipient: string; language: string; emailSubject?: string; emailText?: string; onClose: () => void };

function DocumentInfo({ documentType, documentNo, orderId, customer }: Context) {
  return <div className="rounded-lg border bg-muted/40 px-3 py-2">
    <div className="font-medium">{documentType}{documentNo ? ` #${documentNo}` : ""}</div>
    <div className="text-sm text-muted-foreground">{orderId ? `Order #${orderId} · ` : ""}{customer}</div>
  </div>;
}

function DocumentOptions({ documentType, language: defaultLanguage }: Pick<Context, "documentType" | "language">) {
  const id = useId();
  const [languages, setLanguages] = useState<string[] | null>(null);
  const [error, setError] = useState("");
  const [language, setLanguage] = useState("");
  const [version, setVersion] = useState("original");
  const [documents, setDocuments] = useState("document");

  useEffect(() => {
    const controller = new AbortController();
    void fetch("/orders/get_document_languages", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Languages could not be loaded.");
        setLanguages(await response.json() as string[]);
      })
      .catch((reason: unknown) => {
        if (controller.signal.aborted) return;
        setError(reason instanceof Error ? reason.message : "Languages could not be loaded.");
        setLanguages([]);
      });
    return () => controller.abort();
  }, []);

  const selectedLanguage = languages?.includes(language)
    ? language
    : languages?.includes(defaultLanguage) ? defaultLanguage : languages?.[0] ?? "";
  const selectClass = "h-9 w-full rounded-md border border-input bg-background px-3 text-sm disabled:opacity-50";
  return <div className="grid gap-4">
    <div className="grid grid-cols-2 gap-4">
      <div className="grid gap-2">
        <Label htmlFor={`${id}-language`}>Language</Label>
        <select name="language" id={`${id}-language`} className={selectClass} value={selectedLanguage} disabled={!languages?.length} onChange={(event) => setLanguage(event.target.value)}>
          {!languages?.length && <option value="">{languages === null ? "Loading…" : "No languages available"}</option>}
          {languages?.map((value) => <option key={value} value={value}>{value}</option>)}
        </select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor={`${id}-version`}>Document version</Label>
        <select name="version" id={`${id}-version`} className={selectClass} value={version} onChange={(event) => setVersion(event.target.value)}>
          <option value="original">Original</option>
          <option value="copy">Copy</option>
        </select>
      </div>
    </div>
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    {(documentType === "Costestimate" || documentType === "Invoice") && (
      <div className="grid gap-2">
        <Label htmlFor={`${id}-documents`}>PDF documents</Label>
        <select name="documents" id={`${id}-documents`} className={selectClass} value={documents} onChange={(event) => setDocuments(event.target.value)}>
          <option value="document">{documentType} only</option>
          <option value="document-and-client">{documentType} + Dealer Client Form</option>
          <option value="client">Dealer Client Form only</option>
        </select>
      </div>
    )}
  </div>;
}

function useDocumentRequest(props: Context) {
  const container = useRef<HTMLDivElement>(null);
  const { getOrderById } = useOrderStore();
  const refreshDocuments = useDocumentRefreshStore((state) => state.refreshDocuments);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(action: "print" | "mail", email?: { to: string; subject: string; text: string }) {
    if (busy) return;
    const option = (name: string) => container.current?.querySelector<HTMLSelectElement>(`select[name="${name}"]`)?.value;
    if (!option("language")) { setError("Bitte eine Sprache auswählen."); return; }
    // Open during the click so the browser does not block the PDF window.
    const preview = action === "print" ? window.open("", "_blank", "popup,width=1000,height=800") : null;
    if (action === "print" && !preview) { setError("Bitte Pop-ups für die PDF-Anzeige erlauben."); return; }
    if (preview) { preview.opener = null; preview.document.title = `${props.documentType} PDF`; preview.document.body.textContent = "PDF wird erstellt…"; }
    setBusy(true);
    try {
      await props.beforeRequest?.();
      const response = await fetch(documentEndpoints[props.documentType]!, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: props.documentId, action, language: option("language"), version: option("version"), documents: option("documents") ?? "document", email }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Dokumentanfrage fehlgeschlagen.");
      refreshDocuments();
      if (preview) {
        const documents = result.documents as { filename: string; content: string; contentType: string; encoding: string }[];
        if (!Array.isArray(documents) || !documents.length) throw new Error("Keine PDF-Dokumente erhalten.");
        const urls: string[] = [];
        preview.document.body.replaceChildren();
        preview.document.body.style.margin = "0";
        for (const document of documents) {
          if (document.contentType !== "application/pdf" || document.encoding !== "base64") throw new Error("Ungültige PDF-Antwort.");
          const bytes = Uint8Array.from(atob(document.content), (char) => char.charCodeAt(0));
          const url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
          urls.push(url);
          const frame = preview.document.createElement("iframe");
          frame.src = url; frame.title = document.filename; frame.style.cssText = "width:100%;height:95vh;border:0;display:block";
          preview.document.body.append(frame);
        }
        const cleanup = window.setInterval(() => {
          if (preview.closed) { urls.forEach((url) => URL.revokeObjectURL(url)); window.clearInterval(cleanup); }
        }, 1000);
      } else toast.success("E-Mail wurde vom Mailserver angenommen.", {
        description: `Empfänger: ${result.email.accepted.join("; ")}`,
        duration: 10000,
      });
      if (result.documentWarning) toast.warning(result.documentWarning, { duration: 15000 });
      if (documentEndpoints[props.documentType] && props.orderId) {
        try { await getOrderById(props.orderId); }
        catch { toast.warning(`${action === "mail" ? "E-Mail versendet." : "PDF erstellt."} Die aktualisierten Dokumentdaten konnten nicht geladen werden; bitte die Auftragsansicht neu laden.`); }
      }
      props.onClose();
    } catch (reason) {
      preview?.close();
      setError(reason instanceof Error ? reason.message : "Dokumentanfrage fehlgeschlagen.");
    } finally { setBusy(false); }
  }
  const errorDialog = error ? <MovableDialog open setOpen={(open) => { if (!open) setError(""); }} title="Dokumentanfrage fehlgeschlagen" className="min-w-md max-w-lg">
    <DialogDescription role="alert">{error}</DialogDescription>
    <DialogFooter><Button type="button" onClick={() => setError("")}>Schließen</Button></DialogFooter>
  </MovableDialog> : null;
  return { container, busy, submit, errorDialog };
}

function PrintDialog(props: Context) {
  const { container, busy, submit, errorDialog } = useDocumentRequest(props);
  return <><MovableDialog open setOpen={(open) => { if (!open && !busy) props.onClose(); }} title={`Print ${props.documentType}`} className="min-w-lg max-w-lg">
    <div ref={container} className="grid max-h-[75vh] gap-4 overflow-y-auto">
      <DialogDescription>Prepare the document for printing.</DialogDescription>
      <DocumentInfo {...props} />
      <DocumentOptions documentType={props.documentType} language={props.language} />
      {!documentEndpoints[props.documentType] && <p className="text-sm text-muted-foreground">Printing will be available in the next step.</p>}
      <DialogFooter>
        <Button type="button" variant="outline" disabled={busy} onClick={props.onClose}>Close</Button>
        <Button type="button" disabled={busy || (!documentEndpoints[props.documentType]) || !props.documentId} onClick={() => void submit("print")}><FiPrinter /> {busy ? "Creating PDF…" : "Print"}</Button>
      </DialogFooter>
    </div>
  </MovableDialog>{errorDialog}</>;
}

function MailDialog(props: Context) {
  const { container, busy, submit, errorDialog } = useDocumentRequest(props);
  const id = useId();
  const [recipient, setRecipient] = useState(props.recipient);
  const [cc, setCc] = useState("");
  const [subject, setSubject] = useState(props.emailSubject ?? `${props.documentType}${props.documentNo ? ` #${props.documentNo}` : ""} · Order #${props.orderId}`);
  const [message, setMessage] = useState(props.emailText ?? "");
  return <><MovableDialog open setOpen={(open) => { if (!open && !busy) props.onClose(); }} title={`Mail ${props.documentType}`} className="min-w-xl max-w-xl">
    <div ref={container} className="grid max-h-[75vh] gap-4 overflow-y-auto">
      <DialogDescription>Prepare an email with this document as a PDF attachment.</DialogDescription>
      <DocumentInfo {...props} />
      <DocumentOptions documentType={props.documentType} language={props.language} />
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor={`${id}-to`}>To</Label>
          <Input id={`${id}-to`} type="text" inputMode="email" placeholder="mail@example.com; second@example.com;" value={recipient} onChange={(event) => setRecipient(event.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor={`${id}-cc`}>CC</Label>
          <Input disabled={Boolean(documentEndpoints[props.documentType])} placeholder={Boolean(documentEndpoints[props.documentType]) ? "CC is not supported by the templates API" : undefined} id={`${id}-cc`} type="email" multiple value={cc} onChange={(event) => setCc(event.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor={`${id}-subject`}>Subject</Label>
          <Input id={`${id}-subject`} value={subject} onChange={(event) => setSubject(event.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor={`${id}-message`}>Message</Label>
          <Textarea id={`${id}-message`} rows={5} value={message} onChange={(event) => setMessage(event.target.value)} />
        </div>
      </div>
      {!documentEndpoints[props.documentType] && <p className="text-sm text-muted-foreground">Sending email will be available in the next step.</p>}
      <DialogFooter>
        <Button type="button" variant="outline" disabled={busy} onClick={props.onClose}>Close</Button>
        <Button type="button" disabled={busy || (!documentEndpoints[props.documentType]) || !props.documentId || !recipient.trim() || !subject.trim()} onClick={() => void submit("mail", { to: recipient.trim(), subject, text: message })}><FiMail /> {busy ? "Sending…" : "Send"}</Button>
      </DialogFooter>
    </div>
  </MovableDialog>{errorDialog}</>;
}

export function MailLetterDocumentDialog(props: {
  action: "print" | "email";
  mailId: number;
  customer: string;
  recipient: string;
  subject: string;
  text: string;
  onClose: () => void;
}) {
  const context: Context = {
    documentType: "Mail", documentId: props.mailId, documentNo: props.mailId,
    orderId: 0, customer: props.customer, recipient: props.recipient,
    language: "german", emailSubject: props.subject, emailText: props.text, onClose: props.onClose,
  };
  return props.action === "print" ? <PrintDialog {...context} /> : <MailDialog {...context} />;
}

export default function OrderDocumentActions(props: Props) {
  const { order } = useOrderStore();
  const [dialog, setDialog] = useState<"print" | "mail" | null>(null);
  const data = order?.getOrder();
  const context: Context = {
    ...props,
    documentId: props.documentType === "Invoice" || props.documentType === "Creditnote" || props.documentType === "Payments" || props.documentType === "Reminders" || props.documentType === "Warranty" ? order?.uid_order : props.documentId,
    documentNo: props.documentNo ?? (props.documentType === "Invoice" ? data?.invoice_no : null),
    orderId: order?.uid_order ?? 0,
    customer: data?.customer_name ?? "",
    recipient: data?.customer_email ?? "",
    language: data?.user_print_language ?? "de",
    onClose: () => setDialog(null),
  };
  return <>
    {props.documentType !== "Payments" && (
      <Button disabled={!order || props.disabled} type="button" size="sm" onClick={() => setDialog("mail")}><FiMail /> Mail</Button>
    )}
    <Button disabled={!order || props.disabled} type="button" size="sm" onClick={() => setDialog("print")}><FiPrinter /> Print</Button>
    {order && !props.disabled && dialog === "print" && <PrintDialog key={`${order.uid_order}-${props.documentNo ?? ""}`} {...context} />}
    {order && dialog === "mail" && props.documentType !== "Payments" && <MailDialog key={`${order.uid_order}-${props.documentNo ?? ""}`} {...context} />}
  </>;
}
