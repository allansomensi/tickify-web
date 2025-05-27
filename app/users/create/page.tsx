"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
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

export default function CreateUserPage() {
  const router = useRouter();

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
  const [isPending, startTransition] = useTransition();

  type Field =
    | {
        label: string;
        id: keyof FormState;
        placeholder: string;
        type: "text" | "password" | "email";
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
      label: "Username",
      id: "username",
      placeholder: "Choose a username",
      type: "text",
      required: true,
    },
    {
      label: "Password",
      id: "password",
      placeholder: "Create a password",
      type: "password",
      required: true,
    },
    {
      label: "Confirm Password",
      id: "confirmPassword",
      placeholder: "Confirm your password",
      type: "password",
      required: true,
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
      options: [
        { value: "none", label: "None" },
        { value: "user", label: "User" },
        { value: "moderator", label: "Moderator" },
        { value: "admin", label: "Admin" },
      ],
      required: false,
    },
    {
      label: "Status",
      id: "status",
      type: "select",
      options: [
        { value: "none", label: "None" },
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ],
      required: false,
    },
  ] as const;

  const handleChange = (field: keyof FormState, value: string | null) => {
    const newValue =
      (field === "role" || field === "status") && value === "none"
        ? null
        : value;
    setForm((prev) => ({ ...prev, [field]: newValue }));
  };

  const handleSubmit = () => {
    startTransition(async () => {
      if (!form.username.trim()) {
        setErrorMessage("Username is required.");
        return;
      }
      if (!form.password.trim()) {
        setErrorMessage("Password is required.");
        return;
      }
      if (form.password !== form.confirmPassword) {
        setErrorMessage("Passwords do not match.");
        return;
      }

      const payload: Partial<User> & { password: string } = {
        username: form.username,
        password: form.password,
      };
      if (form.email.trim()) payload.email = form.email;
      if (form.first_name.trim()) payload.first_name = form.first_name;
      if (form.last_name.trim()) payload.last_name = form.last_name;
      if (form.role) payload.role = form.role;
      if (form.status) payload.status = form.status;

      setErrorMessage("");
      setSuccessMessage("");

      try {
        const response = await fetch("/api/users", {
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
          setErrorMessage(data?.error || "User creation failed.");
          return;
        }

        setSuccessMessage("User created successfully!");
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
            <Heading size="8">Create User</Heading>
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
                  {isPending ? (
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
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isPending}>
              Create User
            </Button>
          </Flex>
        </Card>
      </Box>
    </Flex>
  );
}
