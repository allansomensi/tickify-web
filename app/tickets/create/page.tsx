"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useTransition } from "react";
import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Text,
  DataList,
  TextField,
  Select,
  Callout,
  Skeleton,
} from "@radix-ui/themes";
import {
  ExclamationTriangleIcon,
  CheckCircledIcon,
} from "@radix-ui/react-icons";
import { Ticket, Requester } from "@/types/ticket";
import { User } from "@/types/user";

export default function CreateTicketPage() {
  const router = useRouter();

  interface FormState {
    title: string;
    description: string;
    status: string | null;
    requesterId: string | null;
  }

  const [form, setForm] = useState<FormState>({
    title: "",
    description: "",
    status: null,
    requesterId: null,
  });
  const [requesters, setRequesters] = useState<Requester[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isLoadingRequesters, setIsLoadingRequesters] = useState(true);

  type Field =
    | {
        label: string;
        id: keyof FormState;
        placeholder: string;
        type: "text" | "textarea";
        required: boolean;
      }
    | {
        label: string;
        id: keyof FormState;
        type: "select";
        options: { value: string; label: string }[];
        required: boolean;
      };

  const fields: readonly Field[] = [
    {
      label: "Title",
      id: "title",
      placeholder: "Enter ticket title",
      type: "text",
      required: true,
    },
    {
      label: "Description",
      id: "description",
      placeholder: "Enter ticket description",
      type: "textarea",
      required: true,
    },
    {
      label: "Status",
      id: "status",
      type: "select",
      options: [
        { value: "none", label: "None" },
        { value: "open", label: "Open" },
        { value: "closed", label: "Closed" },
        { value: "pending", label: "Pending" },
      ],
      required: true,
    },
    {
      label: "Requester",
      id: "requesterId",
      type: "select",
      options: requesters.map((requester) => ({
        value: requester.id,
        label: requester.username,
      })),
      required: true,
    },
  ] as const;

  useEffect(() => {
    startTransition(async () => {
      try {
        const res = await fetch("/api/users", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (res.status === 401) {
          router.push("/login");
          return;
        }

        if (!res.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await res.json();
        setRequesters(
          data.map((user: Partial<User>) => ({
            id: user.id,
            username: user.username,
          })),
        );
      } catch {
        setErrorMessage("Failed to load requesters. Please try again.");
      } finally {
        setIsLoadingRequesters(false);
      }
    });
  }, [router]);

  const handleChange = (field: keyof FormState, value: string | null) => {
    const newValue =
      (field === "status" || field === "requesterId") && value === "none"
        ? null
        : value;
    setForm((prev) => ({ ...prev, [field]: newValue }));
  };

  const handleSubmit = () => {
    startTransition(async () => {
      if (!form.title.trim()) {
        setErrorMessage("Title is required.");
        return;
      }
      if (!form.description.trim()) {
        setErrorMessage("Description is required.");
        return;
      }
      if (!form.status) {
        setErrorMessage("Status is required.");
        return;
      }
      if (!form.requesterId) {
        setErrorMessage("Requester is required.");
        return;
      }

      const payload: Partial<Ticket> & { requesterId: string } = {
        title: form.title,
        description: form.description,
        status: form.status,
        requesterId: form.requesterId,
      };

      setErrorMessage("");
      setSuccessMessage("");

      try {
        const response = await fetch("/api/tickets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.status === 401) {
          router.push("/login");
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          setErrorMessage(data?.error || "Ticket creation failed.");
          return;
        }

        setSuccessMessage("Ticket created successfully!");
        setTimeout(() => router.push("/admin"), 2000);
      } catch {
        setErrorMessage("Something went wrong. Please try again.");
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (
      e.key === "Enter" &&
      !["textarea"].includes(e.currentTarget.tagName.toLowerCase())
    ) {
      handleSubmit();
    }
  };

  return (
    <Flex className="min-h-screen bg-gray-900" p="6">
      <Box flexGrow="1">
        <Card mb="4">
          <Flex justify="between" align="center" p="2">
            <Heading size="8">Create Ticket</Heading>
            <Button
              variant="solid"
              onClick={() => router.push("/admin")}
              disabled={isPending}
            >
              Back to Admin
            </Button>
          </Flex>
        </Card>

        {errorMessage && (
          <Callout.Root color="red" mb="4">
            <Callout.Icon>
              <ExclamationTriangleIcon />
            </Callout.Icon>
            <Callout.Text>{errorMessage}</Callout.Text>
          </Callout.Root>
        )}
        {successMessage && (
          <Callout.Root color="green" mb="4">
            <Callout.Icon>
              <CheckCircledIcon />
            </Callout.Icon>
            <Callout.Text>{successMessage}</Callout.Text>
          </Callout.Root>
        )}

        <Card size="4">
          <DataList.Root>
            {fields.map(({ label, id, type, required }, index) => (
              <DataList.Item key={id} align="center">
                <DataList.Label>
                  {label}
                  {required && <Text color="red"> *</Text>}
                </DataList.Label>
                <DataList.Value>
                  {isPending ||
                  (id === "requesterId" && isLoadingRequesters) ? (
                    <Skeleton>
                      {type === "select" ? (
                        <Select.Root disabled>
                          <Select.Trigger
                            placeholder="Loading..."
                            style={{ width: "300px" }}
                          />
                        </Select.Root>
                      ) : (
                        <TextField.Root
                          placeholder="Loading..."
                          style={{ width: "300px" }}
                          disabled
                        />
                      )}
                    </Skeleton>
                  ) : type === "select" ? (
                    <Select.Root
                      value={form[id] ?? ""}
                      onValueChange={(value) => handleChange(id, value)}
                      disabled={isPending}
                    >
                      <Select.Trigger
                        placeholder="Select value"
                        style={{ width: "300px" }}
                        tabIndex={index + 1}
                      />
                      <Select.Content>
                        {(
                          fields.find(
                            (f) => f.id === id && f.type === "select",
                          ) as
                            | { options: { value: string; label: string }[] }
                            | undefined
                        )?.options.map((option) => (
                          <Select.Item key={option.value} value={option.value}>
                            {option.label}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                  ) : (
                    <TextField.Root
                      placeholder={
                        (
                          fields.find((f) => f.id === id) as
                            | { placeholder: string }
                            | undefined
                        )?.placeholder || ""
                      }
                      type={type === "textarea" ? undefined : type}
                      value={form[id] ?? ""}
                      onChange={(e) => handleChange(id, e.target.value)}
                      onKeyDown={handleKeyDown}
                      style={{
                        width: "300px",
                        ...(type === "textarea" ? { minHeight: "100px" } : {}),
                      }}
                      tabIndex={index + 1}
                      disabled={isPending}
                    />
                  )}
                </DataList.Value>
              </DataList.Item>
            ))}
          </DataList.Root>

          <Flex mt="6" justify="end" gap="4">
            <Button
              variant="outline"
              onClick={() => router.push("/admin")}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isPending}>
              Create Ticket
            </Button>
          </Flex>
        </Card>
      </Box>
    </Flex>
  );
}
