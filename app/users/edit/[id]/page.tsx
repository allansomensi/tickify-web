"use client";

import { useRouter, useParams } from "next/navigation";
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
import { User } from "@/types/user";

export default function EditUserPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [initialForm, setInitialForm] = useState<FormState | null>(null);

  interface FormState {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    confirmPassword: string;
    role: string | null;
    status: string | null;
    username: string;
  }

  type PartialUserUpdate = Partial<Omit<User, "id">> & { password?: string };

  const [form, setForm] = useState<FormState>({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    confirmPassword: "",
    role: null,
    status: null,
    username: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const fields: {
    label: string;
    id: keyof FormState;
    placeholder?: string;
    type: "text" | "email" | "password" | "select";
    required: boolean;
    options?: { value: string; label: string }[];
  }[] = [
    {
      label: "Username",
      id: "username",
      placeholder: "Choose a username",
      type: "text",
      required: false,
    },
    {
      label: "Password",
      id: "password",
      placeholder: "Update password (leave blank to keep current)",
      type: "password",
      required: false,
    },
    {
      label: "Confirm Password",
      id: "confirmPassword",
      placeholder: "Confirm new password",
      type: "password",
      required: false,
    },
    {
      label: "Email",
      id: "email",
      placeholder: "Enter email",
      type: "email",
      required: false,
    },
    {
      label: "First Name",
      id: "first_name",
      placeholder: "Enter first name",
      type: "text",
      required: false,
    },
    {
      label: "Last Name",
      id: "last_name",
      placeholder: "Enter last name",
      type: "text",
      required: false,
    },
    {
      label: "Role",
      id: "role",
      type: "select",
      required: false,
      options: [
        { value: "none", label: "None" },
        { value: "user", label: "User" },
        { value: "moderator", label: "Moderator" },
        { value: "admin", label: "Admin" },
      ],
    },
    {
      label: "Status",
      id: "status",
      type: "select",
      required: false,
      options: [
        { value: "none", label: "None" },
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ],
    },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/users/edit/${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (res.status === 401) {
          router.push("/login");
          return;
        }

        if (!res.ok) {
          throw new Error("Failed to fetch user");
        }

        const data: User = await res.json();

        if (typeof data.role !== "string" && data.role !== null) {
          throw new Error("Invalid role type");
        }

        if (typeof data.status !== "string" && data.status !== null) {
          throw new Error("Invalid status");
        }

        setForm({
          email: data.email || "",
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          password: "",
          confirmPassword: "",
          role: data.role || null,
          status: data.status || null,
          username: data.username,
        });

        setInitialForm({
          email: data.email || "",
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          password: "",
          confirmPassword: "",
          role: data.role || null,
          status: data.status || null,
          username: data.username,
        });
      } catch {
        setErrorMessage("Failed to load user data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id, router]);

  const handleChange = (field: keyof FormState, value: string | null) => {
    const newValue =
      (field === "role" || field === "status") && value === "none"
        ? null
        : value;
    setForm((prev) => ({ ...prev, [field]: newValue }));
  };

  const handleSubmit = () => {
    startTransition(async () => {
      if (form.password && form.password !== form.confirmPassword) {
        setErrorMessage("Passwords do not match.");
        return;
      }

      if (!initialForm) return;

      const payload: PartialUserUpdate & { id: string } = { id };

      (Object.keys(form) as (keyof FormState)[]).forEach((key) => {
        if (
          key === "confirmPassword" ||
          (key === "password" && !form.password.trim())
        ) {
          return;
        }

        if (form[key] !== initialForm[key]) {
          payload[key as keyof PartialUserUpdate] = form[key]!;
        }
      });

      if (Object.keys(payload).length === 1) {
        setSuccessMessage("No changes to update.");
        return;
      }

      setErrorMessage("");
      setSuccessMessage("");

      try {
        const response = await fetch(`/api/users/edit/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.status === 401) {
          router.push("/login");
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          setErrorMessage(data?.error || "User update failed.");
          return;
        }

        setSuccessMessage("User updated successfully!");
        setTimeout(() => router.push("/admin"), 2000);
      } catch {
        setErrorMessage("Something went wrong. Please try again.");
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <Flex className="min-h-screen bg-gray-900" p="6">
      <Box flexGrow="1">
        <Card mb="4">
          <Flex justify="between" align="center" p="2">
            <Heading size="8">Edit User</Heading>
            <Button
              variant="solid"
              onClick={() => router.push("/admin")}
              disabled={isPending || isLoading}
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
                  {isLoading || isPending ? (
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
                      value={form[id] ?? "none"}
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
                          ) as { options: { value: string; label: string }[] }
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
                          fields.find((f) => f.id === id) as {
                            placeholder: string;
                          }
                        )?.placeholder || ""
                      }
                      type={type}
                      value={form[id] ?? ""}
                      onChange={(e) => handleChange(id, e.target.value)}
                      onKeyDown={handleKeyDown}
                      style={{ width: "300px" }}
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
              disabled={isPending || isLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isPending || isLoading}>
              Update User
            </Button>
          </Flex>
        </Card>
      </Box>
    </Flex>
  );
}
